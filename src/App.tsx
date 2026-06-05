import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Code2,
  Download,
  Flame,
  ListChecks,
  Play,
  RotateCcw,
  Search,
  SkipForward,
  Trophy,
  Upload,
} from 'lucide-react'
import './App.css'
import {
  allProblems,
  subjects,
  type Problem,
  type ProblemDifficulty,
  type ProblemType,
  type Subject,
} from './course'
import { validateCourse } from './courseValidation'
import { gradeJs, specs, type GradeResult } from './grader'

type ProgressState = {
  completed: string[]
  notes: Record<string, string>
  selectedChoice: Record<string, number>
  code: Record<string, string>
}

const storageKey = 'backend-omniscience-progress'

const emptyProgress: ProgressState = {
  completed: [],
  notes: {},
  selectedChoice: {},
  code: {},
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
      code: parsed.code ?? {},
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

function findProblemLocation(problemId: string) {
  for (const subject of subjects) {
    const problem = subject.problems.find((item) => item.id === problemId)
    if (problem) return { subject, problem }
  }
  return undefined
}

function getInitialLocation() {
  const hashProblemId = window.location.hash.replace('#', '')
  return findProblemLocation(hashProblemId) ?? {
    subject: subjects[0],
    problem: subjects[0].problems[0],
  }
}

function App() {
  const initialLocation = useMemo(() => getInitialLocation(), [])
  const [activeSubjectId, setActiveSubjectId] = useState(initialLocation.subject.id)
  const [activeProblemId, setActiveProblemId] = useState(initialLocation.problem.id)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<ProblemType | 'all'>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<ProblemDifficulty | 'all'>('all')
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const [importMessage, setImportMessage] = useState('')
  const [gradeResults, setGradeResults] = useState<Record<string, GradeResult>>({})
  const [runningProblemId, setRunningProblemId] = useState('')
  const importInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    const syncFromHash = () => {
      const location = findProblemLocation(window.location.hash.replace('#', ''))
      if (!location) return
      setActiveSubjectId(location.subject.id)
      setActiveProblemId(location.problem.id)
    }

    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  const activeSubject = subjects.find((subject) => subject.id === activeSubjectId) ?? subjects[0]
  const activeProblem =
    activeSubject.problems.find((problem) => problem.id === activeProblemId) ??
    activeSubject.problems[0]

  const problemIds = useMemo(() => new Set(allProblems.map((problem) => problem.id)), [])
  const completedSet = useMemo(
    () => new Set(progress.completed.filter((problemId) => problemIds.has(problemId))),
    [problemIds, progress.completed],
  )
  const completedCount = completedSet.size
  const specsByProblemId = useMemo(
    () => new Map(specs.map((spec) => [spec.problemId, spec])),
    [],
  )
  const gradableCount = specsByProblemId.size
  const totalMinutes = allProblems.reduce((sum, problem) => sum + problem.minutes, 0)
  const completedMinutes = allProblems
    .filter((problem) => completedSet.has(problem.id))
    .reduce((sum, problem) => sum + problem.minutes, 0)
  const remainingMinutes = totalMinutes - completedMinutes
  const completionPercent = Math.round((completedCount / allProblems.length) * 100)
  const activeIndex = allProblems.findIndex((problem) => problem.id === activeProblem.id)
  const problemTypes = useMemo(
    () => [...new Set(allProblems.map((problem) => problem.type))],
    [],
  )
  const problemDifficulties = useMemo(
    () => [...new Set(allProblems.map((problem) => problem.difficulty))],
    [],
  )
  const courseWarnings = useMemo(() => validateCourse(subjects), [])
  const filteredProblemIds = useMemo(() => {
    const ids = new Set<string>()
    subjects.forEach((subject) => {
      subject.problems.forEach((problem) => {
        const searchable = `${subject.title} ${subject.subtitle} ${problem.title} ${problem.prompt}`
        const matchesSearch = searchable.toLowerCase().includes(query.toLowerCase())
        const matchesType = typeFilter === 'all' || problem.type === typeFilter
        const matchesDifficulty =
          difficultyFilter === 'all' || problem.difficulty === difficultyFilter
        if (matchesSearch && matchesType && matchesDifficulty) ids.add(problem.id)
      })
    })
    return ids
  }, [difficultyFilter, query, typeFilter])
  const filteredProblemCount = filteredProblemIds.size
  const filteredCompletedCount = [...filteredProblemIds].filter((problemId) =>
    completedSet.has(problemId),
  ).length
  const filteredSubjects = subjects
    .map((subject) => ({
      ...subject,
      problems: subject.problems.filter((problem) => filteredProblemIds.has(problem.id)),
    }))
    .filter((subject) => subject.problems.length > 0)

  function openProblem(subject: Subject, problem: Problem) {
    setActiveSubjectId(subject.id)
    setActiveProblemId(problem.id)
    window.history.replaceState(null, '', `#${problem.id}`)
  }

  function moveProblem(direction: -1 | 1) {
    const next = allProblems[activeIndex + direction]
    if (!next) return
    const subject = subjects.find((item) => item.id === next.subjectId)
    if (!subject) return
    openProblem(subject, next)
  }

  function openNextUnsolved() {
    const searchStart = Math.max(activeIndex, 0)
    const ordered = [...allProblems.slice(searchStart + 1), ...allProblems.slice(0, searchStart + 1)]
    const next = ordered.find((problem) => !completedSet.has(problem.id))
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

  function updateCode(problemId: string, value: string) {
    setProgress((current) => ({
      ...current,
      code: { ...current.code, [problemId]: value },
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

  function exportProgress() {
    const payload = {
      app: 'Backend Omniscience',
      exportedAt: new Date().toISOString(),
      progress,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'backend-omniscience-progress.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  async function importProgress(file: File | undefined) {
    if (!file) return
    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as { progress?: Partial<ProgressState> }
      const imported = parsed.progress ?? {}
      setProgress({
        completed: [...new Set(imported.completed ?? [])].filter((problemId) =>
          problemIds.has(problemId),
        ),
        notes: imported.notes ?? {},
        selectedChoice: imported.selectedChoice ?? {},
        code: imported.code ?? {},
      })
      setImportMessage('Progress imported.')
    } catch {
      setImportMessage('Import failed. Choose a Backend Omniscience progress JSON file.')
    }
  }

  async function runCodingTests() {
    const spec = specsByProblemId.get(activeProblem.id)
    if (!spec) return

    setRunningProblemId(activeProblem.id)
    const code = progress.code[activeProblem.id] ?? spec.starter
    const result = await gradeJs(code, spec.tests)
    setGradeResults((current) => ({ ...current, [activeProblem.id]: result }))
    setRunningProblemId('')

    if (result.passed && !completedSet.has(activeProblem.id)) {
      toggleComplete(activeProblem.id)
    }
  }

  const selectedChoice = progress.selectedChoice[activeProblem.id]
  const quizAnswered = selectedChoice !== undefined
  const quizCorrect = selectedChoice === activeProblem.correctChoice
  const activeSpec = specsByProblemId.get(activeProblem.id)
  const activeCode = activeSpec ? (progress.code[activeProblem.id] ?? activeSpec.starter) : ''
  const activeGradeResult = gradeResults[activeProblem.id]
  const isRunningTests = runningProblemId === activeProblem.id

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Flame size={22} />
          </div>
          <div>
            <p className="eyebrow">Roadmap gauntlet</p>
            <h1>Backend Omniscience</h1>
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
          <div className="time-stats">
            <span>{Math.round(totalMinutes / 60)}h curriculum</span>
            <span>{Math.max(0, Math.round(remainingMinutes / 60))}h left</span>
          </div>
          <div className="test-stats">
            <Code2 size={15} />
            <span>{gradableCount} runnable coding drills</span>
          </div>
          <div className="progress-tools">
            <button onClick={exportProgress} type="button">
              <Download size={15} />
              Export
            </button>
            <button onClick={() => importInputRef.current?.click()} type="button">
              <Upload size={15} />
              Import
            </button>
            <input
              ref={importInputRef}
              accept="application/json"
              type="file"
              onChange={(event) => {
                void importProgress(event.target.files?.[0])
                event.target.value = ''
              }}
            />
          </div>
          {importMessage && <span className="import-message">{importMessage}</span>}
        </div>

        <label className="search-box">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search subjects"
          />
        </label>

        <div className="filter-stack" aria-label="Problem filters">
          <div className="filter-group">
            <span>Type</span>
            <div className="filter-row">
              <button
                className={typeFilter === 'all' ? 'active' : ''}
                onClick={() => setTypeFilter('all')}
                type="button"
              >
                All
              </button>
              {problemTypes.map((type) => (
                <button
                  key={type}
                  className={typeFilter === type ? 'active' : ''}
                  onClick={() => setTypeFilter(type)}
                  type="button"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span>Difficulty</span>
            <div className="filter-row">
              <button
                className={difficultyFilter === 'all' ? 'active' : ''}
                onClick={() => setDifficultyFilter('all')}
                type="button"
              >
                All
              </button>
              {problemDifficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  className={difficultyFilter === difficulty ? 'active' : ''}
                  onClick={() => setDifficultyFilter(difficulty)}
                  type="button"
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-summary">
          <span>{filteredProblemCount} showing</span>
          <span>{filteredCompletedCount} complete</span>
        </div>

        {courseWarnings.length > 0 && (
          <details className="warning-block">
            <summary>{courseWarnings.length} curriculum warnings</summary>
            <ul>
              {courseWarnings.slice(0, 8).map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </details>
        )}

        <nav className="subject-list" aria-label="Course subjects">
          {filteredSubjects.map((subject) => {
            const subjectDone = subject.problems.filter((problem) =>
              completedSet.has(problem.id),
            ).length
            const subjectPercent = Math.round((subjectDone / subject.problems.length) * 100)
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
                <div className="subject-progress" aria-label={`${subjectPercent}% complete`}>
                  <div style={{ width: `${subjectPercent}%`, background: subject.color }} />
                </div>

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
                          {specsByProblemId.has(problem.id) && <Code2 size={14} />}
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
          <div className="topbar-actions">
            <button
              className="icon-button"
              onClick={openNextUnsolved}
              disabled={completedCount >= allProblems.length}
              aria-label="Next unsolved problem"
              type="button"
            >
              <SkipForward size={18} />
            </button>
            <button
              className="icon-button"
              onClick={() => moveProblem(1)}
              disabled={activeIndex >= allProblems.length - 1}
              aria-label="Next problem"
              type="button"
            >
              <ChevronRight size={18} />
            </button>
          </div>
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

          {activeProblem.explanation && (
            <section className="explanation-block">
              <h3>Explanation</h3>
              <p>{activeProblem.explanation}</p>
            </section>
          )}

          {activeProblem.production && (
            <section className="production-block">
              <h3>Why This Matters In Production</h3>
              <p>{activeProblem.production}</p>
            </section>
          )}

          {activeProblem.walkthrough && (
            <section className="walkthrough-block">
              <h3>Guided Walkthrough</h3>
              <ol>
                {activeProblem.walkthrough.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
          )}

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

          {activeSpec && (
            <section className="coding-block">
              <div className="coding-heading">
                <div>
                  <h3>Coding Tests</h3>
                  <p>{activeSpec.title} · JavaScript</p>
                </div>
                <button
                  className="run-button"
                  onClick={() => void runCodingTests()}
                  disabled={isRunningTests}
                  type="button"
                >
                  <Play size={17} />
                  {isRunningTests ? 'Running' : 'Run tests'}
                </button>
              </div>

              <textarea
                className="code-editor"
                value={activeCode}
                onChange={(event) => updateCode(activeProblem.id, event.target.value)}
                spellCheck={false}
              />

              {activeGradeResult && (
                <div className={`test-results ${activeGradeResult.passed ? 'pass' : 'fail'}`}>
                  <strong>
                    {activeGradeResult.passed ? 'All tests passed.' : 'Tests need work.'}
                  </strong>
                  {activeGradeResult.error && <p>{activeGradeResult.error}</p>}
                  {activeGradeResult.timedOut && <p>Execution timed out.</p>}
                  <ul>
                    {activeGradeResult.results.map((result) => (
                      <li key={result.name} className={result.pass ? 'pass' : 'fail'}>
                        {result.pass ? <Check size={15} /> : <Circle size={15} />}
                        <span>
                          {result.name}
                          {result.message && <small>{result.message}</small>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {activeProblem.questions && (
            <section className="review-block">
              <h3>Review Questions</h3>
              <ol>
                {activeProblem.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ol>
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
