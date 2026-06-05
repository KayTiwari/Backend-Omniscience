import { useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Code2,
  Flame,
  ListChecks,
  RotateCcw,
  Search,
  Trophy,
} from 'lucide-react'
import './App.css'
import { allProblems, subjects, type Problem, type ProblemType, type Subject } from './course'

type ProgressState = {
  completed: string[]
  notes: Record<string, string>
  selectedChoice: Record<string, number>
}

const storageKey = 'pro-backend-gauntlet-progress'

const emptyProgress: ProgressState = {
  completed: [],
  notes: {},
  selectedChoice: {},
}

function loadProgress(): ProgressState {
  try {
    const stored = window.localStorage.getItem(storageKey)
    if (!stored) return emptyProgress
    const parsed = JSON.parse(stored) as ProgressState
    return {
      completed: parsed.completed ?? [],
      notes: parsed.notes ?? {},
      selectedChoice: parsed.selectedChoice ?? {},
    }
  } catch {
    return emptyProgress
  }
}

function ProblemTypeIcon({ type }: { type: ProblemType }) {
  if (type === 'coding') return <Code2 size={18} />
  if (type === 'quiz') return <ListChecks size={18} />
  if (type === 'design') return <Trophy size={18} />
  return <BookOpen size={18} />
}

function App() {
  const [activeSubjectId, setActiveSubjectId] = useState(subjects[0].id)
  const [activeProblemId, setActiveProblemId] = useState(subjects[0].problems[0].id)
  const [query, setQuery] = useState('')
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(progress))
  }, [progress])

  const activeSubject = subjects.find((subject) => subject.id === activeSubjectId) ?? subjects[0]
  const activeProblem =
    activeSubject.problems.find((problem) => problem.id === activeProblemId) ??
    activeSubject.problems[0]

  const completedSet = useMemo(() => new Set(progress.completed), [progress.completed])
  const completedCount = progress.completed.length
  const completionPercent = Math.round((completedCount / allProblems.length) * 100)
  const activeIndex = allProblems.findIndex((problem) => problem.id === activeProblem.id)
  const filteredSubjects = subjects
    .map((subject) => ({
      ...subject,
      problems: subject.problems.filter((problem) => {
        const searchable = `${subject.title} ${subject.subtitle} ${problem.title} ${problem.prompt}`
        return searchable.toLowerCase().includes(query.toLowerCase())
      }),
    }))
    .filter((subject) => subject.problems.length > 0)

  function openProblem(subject: Subject, problem: Problem) {
    setActiveSubjectId(subject.id)
    setActiveProblemId(problem.id)
  }

  function moveProblem(direction: -1 | 1) {
    const next = allProblems[activeIndex + direction]
    if (!next) return
    const subject = subjects.find((item) => item.id === next.subjectId)
    if (!subject) return
    openProblem(subject, next)
  }

  function toggleComplete(problemId: string) {
    setProgress((current) => {
      const completed = new Set(current.completed)
      if (completed.has(problemId)) completed.delete(problemId)
      else completed.add(problemId)
      return { ...current, completed: [...completed] }
    })
  }

  function updateNote(problemId: string, value: string) {
    setProgress((current) => ({
      ...current,
      notes: { ...current.notes, [problemId]: value },
    }))
  }

  function selectChoice(problemId: string, choiceIndex: number) {
    setProgress((current) => ({
      ...current,
      selectedChoice: { ...current.selectedChoice, [problemId]: choiceIndex },
    }))
  }

  function resetProgress() {
    setProgress(emptyProgress)
  }

  const selectedChoice = progress.selectedChoice[activeProblem.id]
  const quizAnswered = selectedChoice !== undefined
  const quizCorrect = selectedChoice === activeProblem.correctChoice

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Flame size={22} />
          </div>
          <div>
            <p className="eyebrow">Backend omniscience</p>
            <h1>Pro Backend Gauntlet</h1>
          </div>
        </div>

        <div className="progress-block">
          <div className="progress-copy">
            <span>{completedCount} solved</span>
            <span>{allProblems.length} total</span>
          </div>
          <div className="progress-track" aria-label={`${completionPercent}% complete`}>
            <div style={{ width: `${completionPercent}%` }} />
          </div>
          <strong>{completionPercent}% complete</strong>
        </div>

        <label className="search-box">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search subjects"
          />
        </label>

        <nav className="subject-list" aria-label="Course subjects">
          {filteredSubjects.map((subject) => {
            const subjectDone = subject.problems.filter((problem) =>
              completedSet.has(problem.id),
            ).length
            const SubjectIcon = subject.icon

            return (
              <section key={subject.id} className="subject-group">
                <button
                  className={`subject-button ${subject.id === activeSubject.id ? 'active' : ''}`}
                  onClick={() => openProblem(subject, subject.problems[0])}
                  type="button"
                >
                  <span className="subject-icon" style={{ color: subject.color }}>
                    <SubjectIcon size={18} />
                  </span>
                  <span>
                    <strong>{subject.title}</strong>
                    <small>
                      {subjectDone}/{subject.problems.length}
                    </small>
                  </span>
                </button>

                {subject.id === activeSubject.id && (
                  <div className="problem-list">
                    {subject.problems.map((problem) => {
                      const done = completedSet.has(problem.id)
                      return (
                        <button
                          key={problem.id}
                          className={`problem-link ${
                            problem.id === activeProblem.id ? 'active' : ''
                          }`}
                          onClick={() => openProblem(subject, problem)}
                          type="button"
                        >
                          {done ? <Check size={15} /> : <Circle size={15} />}
                          <span>{problem.title}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </section>
            )
          })}
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <button
            className="icon-button"
            onClick={() => moveProblem(-1)}
            disabled={activeIndex <= 0}
            aria-label="Previous problem"
            type="button"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="topbar-title">
            <span>{activeSubject.title}</span>
            <strong>
              Problem {activeIndex + 1} of {allProblems.length}
            </strong>
          </div>
          <button
            className="icon-button"
            onClick={() => moveProblem(1)}
            disabled={activeIndex >= allProblems.length - 1}
            aria-label="Next problem"
            type="button"
          >
            <ChevronRight size={18} />
          </button>
        </header>

        <article className="problem-panel">
          <div className="problem-heading">
            <div className="problem-type">
              <ProblemTypeIcon type={activeProblem.type} />
              <span>{activeProblem.type}</span>
            </div>
            <div className="problem-meta">
              <span>{activeProblem.difficulty}</span>
              <span>{activeProblem.minutes} min</span>
            </div>
          </div>

          <h2>{activeProblem.title}</h2>
          <p className="subject-subtitle">{activeSubject.subtitle}</p>

          <section className="prompt-block">
            <h3>Prompt</h3>
            <p>{activeProblem.prompt}</p>
          </section>

          {activeProblem.example && (
            <section className="example-block">
              <h3>Example</h3>
              <pre>{activeProblem.example}</pre>
            </section>
          )}

          {activeProblem.choices && (
            <section className="quiz-block">
              <h3>Choose</h3>
              <div className="choices">
                {activeProblem.choices.map((choice, index) => {
                  const isSelected = selectedChoice === index
                  const isCorrect = activeProblem.correctChoice === index
                  const reveal = quizAnswered && (isSelected || isCorrect)

                  return (
                    <button
                      key={choice}
                      className={`choice ${isSelected ? 'selected' : ''} ${
                        reveal && isCorrect ? 'correct' : ''
                      } ${reveal && isSelected && !isCorrect ? 'wrong' : ''}`}
                      onClick={() => selectChoice(activeProblem.id, index)}
                      type="button"
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {choice}
                    </button>
                  )
                })}
              </div>
              {quizAnswered && (
                <p className={`quiz-result ${quizCorrect ? 'pass' : 'fail'}`}>
                  {quizCorrect ? 'Correct.' : 'Not quite.'} {activeProblem.answer}
                </p>
              )}
            </section>
          )}

          <section className="checklist-block">
            <h3>Acceptance Checklist</h3>
            <ul>
              {activeProblem.checklist.map((item) => (
                <li key={item}>
                  <Check size={15} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="notes-block">
            <h3>Your Answer / Notes</h3>
            <textarea
              value={progress.notes[activeProblem.id] ?? ''}
              onChange={(event) => updateNote(activeProblem.id, event.target.value)}
              placeholder="Sketch your answer, paste code, or write your debugging path."
            />
          </section>

          <div className="actions">
            <button
              className={`complete-button ${
                completedSet.has(activeProblem.id) ? 'done' : ''
              }`}
              onClick={() => toggleComplete(activeProblem.id)}
              type="button"
            >
              <Check size={18} />
              {completedSet.has(activeProblem.id) ? 'Marked complete' : 'Mark complete'}
            </button>
            <button className="reset-button" onClick={resetProgress} type="button">
              <RotateCcw size={17} />
              Reset progress
            </button>
          </div>
        </article>
      </section>
    </main>
  )
}

export default App
