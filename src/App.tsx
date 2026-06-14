import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type UIEvent } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Code2,
  Flame,
  Home,
  ListChecks,
  Moon,
  Play,
  RotateCcw,
  Search,
  SkipForward,
  Sun,
  Trophy,
  X,
} from 'lucide-react'
import './App.css'
import {
  allProblems,
  subjects,
  subjectTracks,
  type Problem,
  type ProblemType,
  type Subject,
} from './course'
import { validateCourse } from './courseValidation'
import { applyEditorKey } from './editorKeys'
import { appendixTargetByGlossaryId } from './course.appendix'
import { glossaryEntries, glossaryEntryById } from './glossaryEntries'
import { glossaryId } from './glossary'
import { Diagram } from './Diagram'
import { Modal } from './Modal'
import { awsCardById } from './course.aws'
import { renderGlossaryText } from './GlossaryText'
import type { GradeResult, GradeSpec } from './grader/types'
import { highlight } from './highlight'
import { InlineDrill } from './InlineDrill'
import { InteractiveDiagram } from './InteractiveDiagram'
import { parseProse, renderProse } from './LessonProse'
import { ScrollProgress } from './ScrollProgress'
import { interviewAnswers } from './interviewAnswers'
import { getTeachingModel } from './problemTeaching'
import { projects } from './projects'
import { quickWrites } from './quickWrite'
import { requestLifecycle } from './requestLifecycle'
import './highlight.css'

type ProgressState = {
  completed: string[]
  notes: Record<string, string>
  recallAnswer: Record<string, string>
  selectedChoice: Record<string, number>
  criterionChoice: Record<string, number>
  tutorialChoice: Record<string, number>
  checkedSolutions: Record<string, boolean>
  defended: Record<string, boolean>
  code: Record<string, string>
}

const storageKey = 'backend-omniscience-progress'
const themeKey = 'backend-omniscience-theme'

type Theme = 'light' | 'dark'
type ConfidenceLevel = 'Not started' | 'Learned' | 'Can explain' | 'Can build' | 'Can defend'
type GraderModule = typeof import('./grader')
const confidenceLevels: ConfidenceLevel[] = [
  'Not started',
  'Learned',
  'Can explain',
  'Can build',
  'Can defend',
]

const emptyProgress: ProgressState = {
  completed: [],
  notes: {},
  recallAnswer: {},
  selectedChoice: {},
  criterionChoice: {},
  tutorialChoice: {},
  checkedSolutions: {},
  defended: {},
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
      recallAnswer: parsed.recallAnswer ?? {},
      selectedChoice: parsed.selectedChoice ?? {},
      criterionChoice: parsed.criterionChoice ?? {},
      tutorialChoice: parsed.tutorialChoice ?? {},
      checkedSolutions: parsed.checkedSolutions ?? {},
      defended: parsed.defended ?? {},
      code: parsed.code ?? {},
    }
  } catch {
    return emptyProgress
  }
}

const TYPE_COLOR: Record<ProblemType, string> = {
  lesson:  '#2f80ed',
  quiz:    '#7c3aed',
  coding:  '#f59f00',
  debug:   '#e84a5f',
  design:  '#0f8b8d',
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Warmup: '#00a878',
  Core:   '#2f80ed',
  Hard:   '#f59f00',
  Boss:   '#e84a5f',
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

function loadTheme(): Theme {
  return window.localStorage.getItem(themeKey) === 'dark' ? 'dark' : 'light'
}

function flameFavicon() {
  const start = '#263238'
  const end = '#2f80ed'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${start}"/><stop offset="1" stop-color="${end}"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="url(#g)"/><g transform="translate(14 14) scale(1.5)"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.6"/></g></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function App() {
  const initialLocation = useMemo(() => getInitialLocation(), [])
  const [isHome, setIsHome] = useState(() => window.location.hash.replace('#', '') === '')
  const [activeSubjectId, setActiveSubjectId] = useState(initialLocation.subject.id)
  // Which subject's problem list is expanded in the sidebar (accordion). Kept
  // separate from activeSubjectId so a second click can collapse without
  // navigating away from the current page.
  const [expandedSubjectId, setExpandedSubjectId] = useState(initialLocation.subject.id)
  const [activeProblemId, setActiveProblemId] = useState(initialLocation.problem.id)
  const [query, setQuery] = useState('')
  const [homeQuery, setHomeQuery] = useState('')
  const [openModal, setOpenModal] = useState<string | null>(null)
  const [encQuery, setEncQuery] = useState('')
  const [encLetter, setEncLetter] = useState('')
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const [gradeResults, setGradeResults] = useState<Record<string, GradeResult>>({})
  const [specsByProblemId, setSpecsByProblemId] = useState<Map<string, GradeSpec>>(
    () => new Map(),
  )
  const [runningProblemId, setRunningProblemId] = useState('')
  const [theme, setTheme] = useState<Theme>(() => loadTheme())
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  // Lesson page navigation, keyed to the problem so switching problems lands
  // back on the first page without an effect.
  const [lessonNav, setLessonNav] = useState({ problemId: '', step: 0 })
  const celebrateTimerRef = useRef<number | undefined>(undefined)
  const codeHighlightRef = useRef<HTMLPreElement>(null)
  const graderModuleRef = useRef<Promise<GraderModule> | null>(null)

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    window.localStorage.setItem(themeKey, theme)
    document.documentElement.dataset.theme = theme
    document
      .querySelector<HTMLLinkElement>('link[rel="icon"]')
      ?.setAttribute('href', flameFavicon())
  }, [theme])

  useEffect(() => {
    const syncFromHash = () => {
      const location = findProblemLocation(window.location.hash.replace('#', ''))
      if (!location) {
        setIsHome(true)
        return
      }
      setIsHome(false)
      setActiveSubjectId(location.subject.id)
      setExpandedSubjectId(location.subject.id)
      setActiveProblemId(location.problem.id)
    }

    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  useEffect(() => {
    const openGlossary = (event: Event) => {
      const id = (event as CustomEvent<{ id?: string }>).detail?.id
      if (!id) return
      const problemId = appendixTargetByGlossaryId[id]
      if (!problemId) return
      const location = findProblemLocation(problemId)
      if (!location) return
      openProblem(location.subject, location.problem)
      window.setTimeout(() => {
        const target = document.getElementById(id)
        target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        target?.classList.add('dictionary-card-focus')
        window.setTimeout(() => target?.classList.remove('dictionary-card-focus'), 1600)
      }, 150)
    }

    window.addEventListener('backend-omniscience:open-glossary', openGlossary)
    return () => window.removeEventListener('backend-omniscience:open-glossary', openGlossary)
  }, [])

  const activeSubject = subjects.find((subject) => subject.id === activeSubjectId) ?? subjects[0]
  const activeProblem =
    activeSubject.problems.find((problem) => problem.id === activeProblemId) ??
    activeSubject.problems[0]
  const isCodingProblem = activeProblem.type === 'coding'

  const problemIds = useMemo(() => new Set(allProblems.map((problem) => problem.id)), [])
  const completedSet = useMemo(
    () => new Set(progress.completed.filter((problemId) => problemIds.has(problemId))),
    [problemIds, progress.completed],
  )

  async function loadGrader(): Promise<GraderModule> {
    graderModuleRef.current ??= import('./grader')
    const graderModule = await graderModuleRef.current
    setSpecsByProblemId((current) => {
      if (current.size > 0) return current
      return new Map(graderModule.allSpecs.map((spec) => [spec.problemId, spec]))
    })
    return graderModule
  }

  const lessonStep = lessonNav.problemId === activeProblem.id ? lessonNav.step : 0
  function setLessonStep(step: number) {
    setLessonNav({ problemId: activeProblem.id, step })
  }

  const hasInlineDrills =
    !!activeProblem.interactive &&
    ((activeProblem.interactive.drills?.length ?? 0) > 0 ||
      !!activeProblem.interactive.writeDrillId)
  useEffect(() => {
    const needsSpecs = isCodingProblem || hasInlineDrills
    if (!needsSpecs || specsByProblemId.size > 0) return
    void loadGrader()
  }, [activeProblem.id, isCodingProblem, hasInlineDrills, specsByProblemId])

  function getProblemConfidence(problem: Problem): ConfidenceLevel {
    if (completedSet.has(problem.id) && progress.defended[problem.id]) return 'Can defend'
    if (completedSet.has(problem.id)) return 'Can build'

    const isCoding = problem.type === 'coding'
    if (isCoding && gradeResults[problem.id]?.passed) return 'Can build'

    const hasQuizAnswer = progress.selectedChoice[problem.id] !== undefined
    const hasSolutionCheck = progress.checkedSolutions[problem.id] === true
    const hasCodeEdit = isCoding ? progress.code[problem.id] !== undefined : false
    const hasRecall = [0, 1, 2].some(
      (index) => (progress.recallAnswer[`${problem.id}:${index}`] ?? '').trim().length > 0,
    )
    const hasTutorialAnswer = Object.keys(progress.tutorialChoice).some((key) =>
      key.startsWith(`${problem.id}:`),
    )
    const hasCriterionAnswer = Object.keys(progress.criterionChoice).some((key) =>
      key.startsWith(`${problem.id}:`),
    )

    if (hasSolutionCheck && (hasCriterionAnswer || hasQuizAnswer || !problem.choices)) {
      return 'Can build'
    }
    if (hasRecall || hasTutorialAnswer || hasCriterionAnswer || hasQuizAnswer) return 'Can explain'
    if (hasSolutionCheck || hasCodeEdit || (progress.notes[problem.id] ?? '').trim()) return 'Learned'
    return 'Not started'
  }

  const completedCount = completedSet.size
  const gradableCount = allProblems.filter((problem) => problem.type === 'coding').length
  const totalMinutes = allProblems.reduce((sum, problem) => sum + problem.minutes, 0)
  const completionPercent = Math.round((completedCount / allProblems.length) * 100)
  const activeIndex = allProblems.findIndex((problem) => problem.id === activeProblem.id)
  const courseWarnings = useMemo(() => validateCourse(subjects), [])
  const filteredProblemIds = useMemo(() => {
    const ids = new Set<string>()
    subjects.forEach((subject) => {
      subject.problems.forEach((problem) => {
        const searchable = `${subject.title} ${subject.subtitle} ${problem.title} ${problem.prompt}`
        if (searchable.toLowerCase().includes(query.toLowerCase())) ids.add(problem.id)
      })
    })
    return ids
  }, [query])
  const filteredSubjects = subjects
    .map((subject) => ({
      ...subject,
      problems: subject.problems.filter((problem) => filteredProblemIds.has(problem.id)),
    }))
    .filter((subject) => subject.problems.length > 0)
  const nextUnsolved =
    allProblems.find((problem) => !completedSet.has(problem.id)) ?? allProblems[0]
  const subjectSummaries = subjects.map((subject) => {
    const done = subject.problems.filter((problem) => completedSet.has(problem.id)).length
    const codingCount = subject.problems.filter((problem) => problem.type === 'coding').length
    const confidenceCounts = subject.problems.reduce<Record<ConfidenceLevel, number>>(
      (counts, problem) => {
        counts[getProblemConfidence(problem)] += 1
        return counts
      },
      {
        'Not started': 0,
        Learned: 0,
        'Can explain': 0,
        'Can build': 0,
        'Can defend': 0,
      },
    )
    return {
      ...subject,
      codingCount,
      confidenceCounts,
      done,
      percent: Math.round((done / subject.problems.length) * 100),
    }
  })
  const homeSearchResults = useMemo(() => {
    const term = homeQuery.trim().toLowerCase()
    if (!term) return []

    return allProblems
      .map((problem) => {
        const subject = subjects.find((item) => item.id === problem.subjectId)
        return { problem, subject }
      })
      .filter(({ problem, subject }) => {
        const searchable = [
          subject?.title,
          subject?.subtitle,
          problem.title,
          problem.type,
          problem.difficulty,
          problem.prompt,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return searchable.includes(term)
      })
      .slice(0, 12)
  }, [homeQuery])
  const lifecycleHops = useMemo(
    () =>
      requestLifecycle.map((hop) => ({
        ...hop,
        subject: subjects.find((subject) => subject.id === hop.subjectId),
      })),
    [],
  )
  const activeInterviewAnswers = interviewAnswers.filter(
    (answer) => answer.subjectId === activeSubject.id,
  )
  const activeQuickWrites = quickWrites.filter((item) => item.subjectId === activeSubject.id)

  function openProblem(subject: Subject, problem: Problem) {
    setIsHome(false)
    setActiveSubjectId(subject.id)
    setExpandedSubjectId(subject.id)
    setActiveProblemId(problem.id)
    window.history.replaceState(null, '', `#${problem.id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Sidebar accordion: expand a subject, or collapse it on a second click,
  // without opening a problem or scrolling the page.
  function toggleSubject(subject: Subject) {
    setExpandedSubjectId((current) => (current === subject.id ? '' : subject.id))
  }

  function openHome() {
    setIsHome(true)
    window.history.replaceState(null, '', window.location.pathname)
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

  function openFirstProblemFor(problemId: string) {
    const location = findProblemLocation(problemId)
    if (!location) return
    openProblem(location.subject, location.problem)
  }

  function openSubjectById(subjectId: string) {
    const subject = subjects.find((item) => item.id === subjectId)
    if (!subject) return
    openProblem(subject, subject.problems[0])
  }

  function markProblemComplete(problemId: string) {
    setProgress((current) => {
      const completed = new Set(current.completed)
      completed.add(problemId)
      return { ...current, completed: [...completed] }
    })
    setCelebrating(true)
    window.clearTimeout(celebrateTimerRef.current)
    celebrateTimerRef.current = window.setTimeout(() => setCelebrating(false), 2200)
  }

  function updateNote(problemId: string, value: string) {
    setProgress((current) => ({
      ...current,
      notes: { ...current.notes, [problemId]: value },
    }))
  }

  function updateRecallAnswer(problemId: string, promptIndex: number, value: string) {
    setProgress((current) => ({
      ...current,
      recallAnswer: {
        ...current.recallAnswer,
        [`${problemId}:${promptIndex}`]: value,
      },
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
      checkedSolutions: { ...current.checkedSolutions, [problemId]: false },
    }))
  }

  function selectCriterion(problemId: string, criterionIndex: number, choiceIndex: number) {
    setProgress((current) => ({
      ...current,
      criterionChoice: {
        ...current.criterionChoice,
        [`${problemId}:${criterionIndex}`]: choiceIndex,
      },
      checkedSolutions: { ...current.checkedSolutions, [problemId]: false },
    }))
  }

  function selectTutorialStep(problemId: string, stepIndex: number, choiceIndex: number) {
    setProgress((current) => ({
      ...current,
      tutorialChoice: {
        ...current.tutorialChoice,
        [`${problemId}:${stepIndex}`]: choiceIndex,
      },
      checkedSolutions: { ...current.checkedSolutions, [problemId]: false },
    }))
  }

  function markDefended(problemId: string) {
    setProgress((current) => ({
      ...current,
      defended: { ...current.defended, [problemId]: true },
    }))
  }

  function resetProgress() {
    setProgress(emptyProgress)
  }

  async function runCodingTests(problemId: string = activeProblem.id) {
    const graderModule = await loadGrader()
    const spec =
      specsByProblemId.get(problemId) ??
      graderModule.allSpecs.find((candidate) => candidate.problemId === problemId)
    if (!spec) return

    setRunningProblemId(problemId)
    const code = progress.code[problemId] ?? spec.starter
    const result = await graderModule.grade(spec, code)
    setGradeResults((current) => ({ ...current, [problemId]: result }))
    setRunningProblemId('')

    if (
      problemId === activeProblem.id &&
      result.passed &&
      solutionChecked &&
      tutorialCorrect &&
      acceptanceCorrect &&
      quizRequirementCorrect &&
      !completedSet.has(activeProblem.id)
    ) {
      markProblemComplete(activeProblem.id)
    }
  }

  const selectedChoice = progress.selectedChoice[activeProblem.id]
  const solutionChecked = progress.checkedSolutions[activeProblem.id] === true
  const quizAnswered = selectedChoice !== undefined
  const quizCorrect = selectedChoice === activeProblem.correctChoice
  const activeSpec = specsByProblemId.get(activeProblem.id)
  const activeCode = activeSpec ? (progress.code[activeProblem.id] ?? activeSpec.starter) : ''
  const activeCodeLanguage =
    activeSpec?.language ??
    (activeProblem.id.startsWith('py-')
      ? 'py'
      : activeProblem.id.startsWith('ts-')
        ? 'ts'
        : 'js')
  const highlightedCode = activeSpec ? highlight(activeCode || '\n', activeCodeLanguage) : ''
  const teachingModel = getTeachingModel(activeSubject, activeProblem)
  const activeGradeResult = gradeResults[activeProblem.id]
  const isRunningTests = runningProblemId === activeProblem.id
  const previousProblem = activeIndex > 0 ? allProblems[activeIndex - 1] : undefined
  const nextProblem = activeIndex < allProblems.length - 1 ? allProblems[activeIndex + 1] : undefined
  const interactive = activeProblem.interactive
  const interactiveDrillIds = interactive
    ? (interactive.drills ?? (interactive.writeDrillId ? [interactive.writeDrillId] : []))
    : []
  // Only authored questions gate progress. Interactive lessons carry real
  // predict-the-output checks; everything else has no generated quiz filler.
  const tutorialChecks = interactive
    ? interactive.predicts.map((predict) => ({
        correctChoice: predict.correct,
        explanation: predict.why,
        options: predict.options,
        question: predict.question,
      }))
    : []
  // Optional deep practice: authored quick-writes only, never generated filler
  // and never a completion gate.
  const recallPrompts = interactive
    ? []
    : activeQuickWrites.map((item, index) => ({
        badge: index === 0 ? 'Interview recall' : 'Production recall',
        expected: item.expected,
        placeholder: 'Write the answer you would say out loud in an interview.',
        productionAnchor: item.productionAnchor,
        prompt: item.prompt,
      }))
  const tutorialCorrect = tutorialChecks.every(
    (check, index) =>
      progress.tutorialChoice[`${activeProblem.id}:${index}`] === check.correctChoice,
  )
  const tutorialCorrectCount = tutorialChecks.filter(
    (check, index) =>
      progress.tutorialChoice[`${activeProblem.id}:${index}`] === check.correctChoice,
  ).length
  const firstIncompleteTutorialIndex = tutorialChecks.findIndex(
    (check, index) =>
      progress.tutorialChoice[`${activeProblem.id}:${index}`] !== check.correctChoice,
  )
  const visibleTutorialCount =
    firstIncompleteTutorialIndex === -1 ? tutorialChecks.length : firstIncompleteTutorialIndex + 1
  // The checklist is a one-click self-check, stored as 1 in criterionChoice.
  const checklistChecked = activeProblem.checklist.map(
    (_, index) => progress.criterionChoice[`${activeProblem.id}:${index}`] === 1,
  )
  const acceptanceCorrect = checklistChecked.every(Boolean)
  const acceptanceCorrectCount = checklistChecked.filter(Boolean).length
  const quizRequirementCorrect =
    !activeProblem.choices || activeProblem.correctChoice === undefined || quizCorrect
  const codeRequirementCorrect = !isCodingProblem || activeGradeResult?.passed === true
  const applyRequirementDone = isCodingProblem
    ? codeRequirementCorrect
    : activeProblem.choices
      ? quizRequirementCorrect
      : solutionChecked
  const canComplete = tutorialCorrect && acceptanceCorrect && applyRequirementDone
  const canCompleteAfterCheck =
    tutorialCorrect &&
    acceptanceCorrect &&
    (isCodingProblem ? codeRequirementCorrect : activeProblem.choices ? quizRequirementCorrect : true)
  const masterySteps = [
    ...(tutorialChecks.length > 0
      ? [
          {
            label: 'Predict it',
            detail: `${tutorialCorrectCount}/${tutorialChecks.length}`,
            help: 'Run the snippet in your head, then answer.',
            done: tutorialCorrect,
          },
        ]
      : []),
    {
      label: isCodingProblem ? 'Run the code' : activeProblem.choices ? 'Answer the quiz' : 'Apply it',
      detail: isCodingProblem
        ? activeGradeResult?.passed
          ? 'passed'
          : activeSpec
            ? 'run tests'
            : 'loading'
        : activeProblem.choices
          ? quizCorrect
            ? 'correct'
            : 'answer'
        : solutionChecked
            ? 'checked'
            : 'check prompt',
      help: isCodingProblem
        ? 'Use the editor and pass the runnable tests.'
        : activeProblem.choices
          ? 'Choose an answer and read the feedback.'
          : 'Use Check Solution after you attempt the prompt.',
      done: applyRequirementDone,
    },
    {
      label: 'Check yourself',
      detail: `${acceptanceCorrectCount}/${activeProblem.checklist.length}`,
      help: 'Tick each skill once you can honestly do it.',
      done: acceptanceCorrect,
    },
  ]
  const masteryDone = masterySteps.filter((step) => step.done).length
  const masteryPercent = Math.round((masteryDone / masterySteps.length) * 100)
  const nextMasteryStep = masterySteps.find((step) => !step.done)
  const activeConfidence: ConfidenceLevel = canComplete
    ? progress.defended[activeProblem.id]
      ? 'Can defend'
      : 'Can build'
    : tutorialCorrect && (acceptanceCorrectCount > 0 || applyRequirementDone)
        ? 'Can explain'
        : tutorialCorrectCount > 0 || acceptanceCorrectCount > 0 || solutionChecked
          ? 'Learned'
          : 'Not started'
  // Lesson pages: each cognitive step gets its own screen instead of one long
  // scroll. Pages without content for this problem are skipped automatically.
  const lessonPages = [
    {
      id: 'learn' as const,
      label: 'Learn',
      hint: 'Read and run',
      done: tutorialCorrectCount > 0 || applyRequirementDone || acceptanceCorrectCount > 0,
    },
    ...(tutorialChecks.length > 0
      ? [{ id: 'predict' as const, label: 'Predict', hint: 'Check yourself', done: tutorialCorrect }]
      : []),
    ...(interactiveDrillIds.length > 0 || isCodingProblem || activeProblem.choices
      ? [
          {
            id: 'practice' as const,
            label: 'Practice',
            hint: isCodingProblem || interactiveDrillIds.length > 0 ? 'Write code' : 'Answer it',
            done: applyRequirementDone,
          },
        ]
      : []),
    {
      id: 'prove' as const,
      label: 'Prove',
      hint: 'Lock it in',
      done: acceptanceCorrect && completedSet.has(activeProblem.id),
    },
  ]
  const pageIndex = Math.min(lessonStep, lessonPages.length - 1)
  const activePage = lessonPages[pageIndex].id

  function checkSolutions() {
    setProgress((current) => ({
      ...current,
      checkedSolutions: { ...current.checkedSolutions, [activeProblem.id]: true },
    }))

    if (canCompleteAfterCheck && !completedSet.has(activeProblem.id)) {
      markProblemComplete(activeProblem.id)
    }
  }

  function openProblemById(problemId: string) {
    const location = findProblemLocation(problemId)
    if (!location) return
    openProblem(location.subject, location.problem)
  }

  function handleCodeKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    const editor = event.currentTarget
    const next = applyEditorKey(
      {
        end: editor.selectionEnd,
        start: editor.selectionStart,
        value: editor.value,
      },
      event.key,
    )
    if (!next) return
    event.preventDefault()
    updateCode(activeProblem.id, next.value)
    requestAnimationFrame(() => editor.setSelectionRange(next.start, next.end))
  }

  function syncCodeEditorScroll(event: UIEvent<HTMLTextAreaElement>) {
    if (!codeHighlightRef.current) return
    codeHighlightRef.current.scrollTop = event.currentTarget.scrollTop
    codeHighlightRef.current.scrollLeft = event.currentTarget.scrollLeft
  }

  function renderLessonListItem(item: string) {
    const idiomMatch = item.match(/^(.*?idiom(?: belongs in your answer or code)?(?: is)?):\s*([\s\S]+)$/i)
    const exampleMatch = item.match(/^(.*?worked example):\s*([\s\S]+)$/i)
    const match = idiomMatch ?? exampleMatch
    if (!match) return item

    const [, label, code] = match
    return (
      <>
        <span>{renderGlossaryText(`${label}:`)}</span>
        <pre
          className="lesson-code"
          aria-label="Key code idiom"
          dangerouslySetInnerHTML={{ __html: highlight(code, activeCodeLanguage) }}
        />
      </>
    )
  }

  // The long-form write-up for a lesson. Interactive modules tuck this
  // behind a Go Deeper details so the Learn page fits without scrolling;
  // legacy lessons still show it inline as their main content.
  const learnDeepBlocks = (
    <>
            {activeProblem.explanation && (
              <section className="explanation-block">
                <h3>Explanation</h3>
                {renderProse(activeProblem.explanation)}
              </section>
            )}

            {activeProblem.production && (
              <section className="production-block production-callout">
                <h3>Why This Matters In Production</h3>
                {renderProse(activeProblem.production)}
              </section>
            )}

            {activeProblem.walkthrough && (
              <section className="walkthrough-block">
                <h3>Guided Walkthrough</h3>
                <ol>
                  {activeProblem.walkthrough.map((step) => (
                    <li key={step}>{renderGlossaryText(step)}</li>
                  ))}
                </ol>
              </section>
            )}

            {activeProblem.example && (
              <section className="example-block">
                <h3>Example</h3>
                {parseProse(activeProblem.example).some((block) => block.kind === 'flow') ? (
                  renderProse(activeProblem.example)
                ) : (
                  <pre>{activeProblem.example}</pre>
                )}
              </section>
            )}

    </>
  )

  return (
    <main
      className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      data-theme={theme}
    >
      <ScrollProgress />
      {celebrating && (
        <div className="celebrate-pop" role="status" aria-live="polite">
          <span className="celebrate-emoji">
            {activeSubject.problems.every((problem) => completedSet.has(problem.id)) ? '🏆' : '🎉'}
          </span>
          <strong>
            {activeSubject.problems.every((problem) => completedSet.has(problem.id))
              ? `${activeSubject.title} complete!`
              : 'Lesson complete!'}
          </strong>
          <em>
            {activeSubject.problems.filter((problem) => completedSet.has(problem.id)).length} of{' '}
            {activeSubject.problems.length} in this course
          </em>
        </div>
      )}
      <button
        className="nav-collapse-tab"
        onClick={() => setSidebarCollapsed((current) => !current)}
        aria-label={sidebarCollapsed ? 'Show navigation' : 'Hide navigation'}
        type="button"
      >
        {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
      <aside className="sidebar">
        <button className="brand brand-button" onClick={openHome} type="button">
          <div className="brand-mark">
            <Flame size={22} />
          </div>
          <div>
            <p className="eyebrow">0 → 1 Backend</p>
            <h1>Backend Omniscience</h1>
          </div>
        </button>

        <button className={`home-button ${isHome ? 'active' : ''}`} onClick={openHome} type="button">
          <Home size={17} />
          <span>Home</span>
        </button>


        <label className="search-box">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search subjects"
          />
          {query && (
            <button type="button" className="enc-search-clear" onClick={() => setQuery('')} aria-label="Clear search">
              <X size={15} />
            </button>
          )}
        </label>


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
            const track = subjectTracks.find((candidate) =>
              candidate.subjectIds.includes(subject.id),
            )
            const firstOfTrack =
              track &&
              filteredSubjects.find((candidate) => track.subjectIds.includes(candidate.id)) ===
                subject
            const subjectDone = subject.problems.filter((problem) =>
              completedSet.has(problem.id),
            ).length
            const subjectPercent = Math.round((subjectDone / subject.problems.length) * 100)
            const SubjectIcon = subject.icon

            return (
              <section key={subject.id} className="subject-group">
                {firstOfTrack && (
                  <div className="track-divider">
                    <span>{track.label}</span>
                  </div>
                )}
                <button
                  className={`subject-button ${
                    subject.id === expandedSubjectId ? 'active' : ''
                  }`}
                  onClick={() => toggleSubject(subject)}
                  aria-expanded={subject.id === expandedSubjectId}
                  type="button"
                  style={subject.id === expandedSubjectId
                    ? { borderColor: `${subject.color}50`, background: `${subject.color}12` }
                    : undefined}
                >
                  <span className="subject-icon" style={{ color: subject.color, background: `${subject.color}18` }}>
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

                {expandedSubjectId === subject.id && (
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
                          style={problem.id === activeProblem.id
                            ? { color: subject.color, borderLeftColor: subject.color, background: `${subject.color}10` }
                            : undefined}
                        >
                          {done ? <Check size={15} /> : <Circle size={15} />}
                          <span>{problem.title}</span>
                          {problem.type === 'coding' && <Code2 size={14} />}
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
            disabled={isHome || activeIndex <= 0}
            aria-label="Previous problem"
            type="button"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="topbar-title">
            <span>{isHome ? 'Dashboard' : activeSubject.title}</span>
            <strong>
              {isHome
                ? 'Choose your course'
                : `Lesson ${activeSubject.problems.findIndex((problem) => problem.id === activeProblem.id) + 1} of ${activeSubject.problems.length} · ${activeSubject.problems.filter((problem) => completedSet.has(problem.id)).length} done`}
            </strong>
          </div>
          <div className="topbar-actions">
            <button
              className="icon-button"
              onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
              type="button"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
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
              disabled={isHome || activeIndex >= allProblems.length - 1}
              aria-label="Next problem"
              type="button"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </header>

        {isHome ? (
          <article className="home-panel">
            <section className="home-hero">
              <div>
                <p className="eyebrow">Backend Omniscience</p>
                <h2>0 → 1 Backend.</h2>
                <p>
                  From your first line of code to production systems. Work subject by
                  subject, jump into coding drills, or continue where you left off.
                </p>
              </div>
              <button
                className="continue-button"
                onClick={() => openFirstProblemFor(nextUnsolved.id)}
                type="button"
              >
                Continue
                <ArrowRight size={18} />
              </button>
            </section>

            <section className="home-stats" aria-label="Course stats">
              <div>
                <span>{allProblems.length}</span>
                <strong>Total problems</strong>
              </div>
              <div>
                <span>{gradableCount}</span>
                <strong>Coding drills</strong>
              </div>
              <div>
                <span>{Math.round(totalMinutes / 60)}h</span>
                <strong>Curriculum</strong>
              </div>
              <div>
                <span>{completionPercent}%</span>
                <strong>Complete</strong>
              </div>
            </section>

            <section className="home-section" aria-label="Courses by track">
              {subjectTracks.map((track) => (
                <div key={track.label} className="home-track">
                  <div className="home-track-heading">
                    <h3>{track.label}</h3>
                    <span>{track.subjectIds.length} courses</span>
                  </div>
                  <div className="subject-grid">
                    {subjectSummaries
                      .filter((subject) => track.subjectIds.includes(subject.id))
                      .map((subject) => {
                        const SubjectIcon = subject.icon
                        return (
                          <button
                            key={subject.id}
                            className="subject-card"
                            onClick={() => openProblem(subject, subject.problems[0])}
                            type="button"
                            style={{ '--card-color': subject.color } as React.CSSProperties}
                          >
                            <span className="subject-card-icon" style={{ color: subject.color, background: `${subject.color}18` }}>
                              <SubjectIcon size={22} />
                            </span>
                            <span className="subject-card-copy">
                              <strong>{subject.title}</strong>
                              <small>{renderGlossaryText(subject.subtitle)}</small>
                            </span>
                            <span className="subject-card-progress">
                              <span style={{ width: `${subject.percent}%`, background: subject.color }} />
                            </span>
                            <span className="subject-card-footer">
                              <span>
                                {subject.done}/{subject.problems.length} done · {subject.codingCount} drills
                              </span>
                              <ArrowRight size={16} />
                            </span>
                          </button>
                        )
                      })}
                  </div>
                </div>
              ))}
            </section>

            <section className="request-lifecycle-view" aria-label="Follow the request">
              <div className="home-section-heading">
                <div>
                  <h3>Follow The Request</h3>
                  <p>One request, every backend layer, and the failure mode to watch.</p>
                </div>
              </div>
              <div className="lifecycle-track">
                {lifecycleHops.map((hop, index) => (
                  <button
                    key={hop.id}
                    className="lifecycle-hop"
                    onClick={() => openSubjectById(hop.subjectId)}
                    type="button"
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{hop.label}</strong>
                    <p>{renderGlossaryText(hop.blurb)}</p>
                    <small>{renderGlossaryText(hop.failureMode)}</small>
                    {hop.subject && <em>{hop.subject.title}</em>}
                  </button>
                ))}
              </div>
            </section>

            <section className="home-search-section" aria-label="Search the course">
              <label className="home-search-box">
                <Search size={18} />
                <input
                  value={homeQuery}
                  onChange={(event) => setHomeQuery(event.target.value)}
                  placeholder="Search problems, subjects, drills, concepts..."
                />
                {homeQuery && (
                  <button type="button" className="enc-search-clear" onClick={() => setHomeQuery('')} aria-label="Clear search">
                    <X size={16} />
                  </button>
                )}
              </label>

              {homeQuery.trim() && (
                <div className="home-search-results">
                  <div className="home-search-summary">
                    <strong>{homeSearchResults.length} results</strong>
                    <span>Top matches for "{homeQuery.trim()}"</span>
                  </div>
                  {homeSearchResults.length > 0 ? (
                    homeSearchResults.map(({ problem, subject }) => (
                      <button
                        key={problem.id}
                        className="home-result"
                        onClick={() => subject && openProblem(subject, problem)}
                        type="button"
                      >
                        <span className="home-result-main">
                          <strong>{problem.title}</strong>
                          <small>{subject?.title}</small>
                        </span>
                        <span className="home-result-meta">
                          <span>{problem.type}</span>
                          <span>{problem.difficulty}</span>
                          {problem.type === 'coding' && <Code2 size={14} />}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="home-empty-search">No matches yet. Try a subject, framework, or backend concept.</p>
                  )}
                </div>
              )}
            </section>

            <section className="projects-view" aria-label="Backend projects">
              <div className="home-section-heading">
                <div>
                  <h3>Projects</h3>
                  <p>Buildable services that connect concepts, drills, and production tradeoffs.</p>
                </div>
              </div>
              <div className="project-grid">
                {projects.map((project) => (
                  <section key={project.id} className="project-card">
                    <div className="project-card-heading">
                      <h4>{project.title}</h4>
                      <span>{project.steps.length} steps</span>
                    </div>
                    <p>{renderGlossaryText(project.pitch)}</p>
                    <div className="project-concepts">
                      {project.concepts.slice(0, 5).map((concept) => (
                        <span key={concept}>{renderGlossaryText(concept)}</span>
                      ))}
                    </div>
                    <ol className="project-steps">
                      {project.steps.map((step) => {
                        const drill = step.drillId ? findProblemLocation(step.drillId) : undefined
                        return (
                          <li key={`${project.id}:${step.text}`}>
                            {drill ? (
                              <button
                                type="button"
                                onClick={() => openProblem(drill.subject, drill.problem)}
                              >
                                {renderGlossaryText(step.text)}
                              </button>
                            ) : (
                              <span>{renderGlossaryText(step.text)}</span>
                            )}
                          </li>
                        )
                      })}
                    </ol>
                    <details className="project-stretch">
                      <summary>Stretch goals</summary>
                      <ul>
                        {project.stretch.map((item) => (
                          <li key={item}>{renderGlossaryText(item)}</li>
                        ))}
                      </ul>
                    </details>
                  </section>
                ))}
              </div>
            </section>


          </article>
        ) : awsCardById.has(activeProblem.id) ? (
          (() => {
            const c = awsCardById.get(activeProblem.id)!
            return (
              <article className="problem-panel aws-flashcard">
                <span className="aws-card-cat">{c.category}</span>
                <div className="aws-card-front">
                  <h2>{c.service}</h2>
                  <p className="aws-card-full">{c.full}</p>
                </div>
                <details className="aws-card-flip">
                  <summary>Flip card</summary>
                  <div className="aws-card-back">
                    <p className="aws-card-what">{renderGlossaryText(c.what)}</p>
                    <div className="aws-card-section">
                      <h4>When to use</h4>
                      <ul>{c.when.map((w) => <li key={w}>{renderGlossaryText(w)}</li>)}</ul>
                    </div>
                    <div className="aws-card-section">
                      <h4>Remember</h4>
                      <ul>{c.remember.map((r) => <li key={r}>{renderGlossaryText(r)}</li>)}</ul>
                    </div>
                  </div>
                </details>
                <section className="learning-path" aria-label="Flashcards">
                  <button type="button" onClick={() => previousProblem && openProblemById(previousProblem.id)} disabled={!previousProblem}>
                    <span>Previous</span>
                    <strong>{previousProblem?.title ?? 'Start'}</strong>
                  </button>
                  <button type="button" onClick={() => nextProblem && openProblemById(nextProblem.id)} disabled={!nextProblem}>
                    <span>Next card</span>
                    <strong>{nextProblem?.title ?? 'End'}</strong>
                  </button>
                </section>
              </article>
            )
          })()
        ) : activeProblem.id === 'appendix-index' ? (
          (() => {
            const q = encQuery.trim().toLowerCase()
            const filtered = glossaryEntries.filter((entry) => {
              if (q) {
                return (
                  entry.term.toLowerCase().includes(q) ||
                  entry.short.toLowerCase().includes(q) ||
                  (entry.aka ?? []).some((a) => a.toLowerCase().includes(q))
                )
              }
              if (encLetter) return entry.term[0].toUpperCase() === encLetter
              return true
            })
            const letters = [...new Set(glossaryEntries.map((e) => e.term[0].toUpperCase()))].sort()
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
            return (
              <article className="problem-panel encyclopedia-index">
                <p className="eyebrow">Encyclopedia</p>
                <h2>Every backend term, explained.</h2>
                <p className="enc-lede">
                  {glossaryEntries.length} terms, each with a full explanation, diagrams, and worked examples.
                </p>
                <label className="enc-search">
                  <Search size={18} />
                  <input
                    value={encQuery}
                    onChange={(event) => {
                      setEncQuery(event.target.value)
                      setEncLetter('')
                    }}
                    placeholder="Search terms..."
                  />
                  {encQuery && (
                    <button
                      type="button"
                      className="enc-search-clear"
                      onClick={() => setEncQuery('')}
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </label>
                <div className="enc-alphabet" role="tablist" aria-label="Jump to letter">
                  <button
                    type="button"
                    className={!encLetter && !q ? 'active' : ''}
                    onClick={() => {
                      setEncLetter('')
                      setEncQuery('')
                    }}
                  >
                    All
                  </button>
                  {alphabet.map((letter) => (
                    <button
                      key={letter}
                      type="button"
                      className={encLetter === letter ? 'active' : ''}
                      disabled={!letters.includes(letter)}
                      onClick={() => {
                        setEncLetter(encLetter === letter ? '' : letter)
                        setEncQuery('')
                      }}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
                <div className="enc-list">
                  {filtered.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      className="enc-list-item"
                      onClick={() => openProblemById(entry.id)}
                    >
                      <span className="enc-list-term">{entry.term}</span>
                      <span className="enc-list-cat">{entry.category}</span>
                      <span className="enc-list-short">{entry.short}</span>
                    </button>
                  ))}
                  {filtered.length === 0 && <p className="enc-empty">No terms match "{encQuery}".</p>}
                </div>
              </article>
            )
          })()
        ) : glossaryEntryById.has(activeProblem.id) ? (
          (() => {
            const entry = glossaryEntryById.get(activeProblem.id)!
            return (
              <article className="problem-panel encyclopedia-entry">
                <button type="button" className="enc-back" onClick={() => openProblemById('appendix-index')}>
                  ← Encyclopedia
                </button>
                <span className="enc-category">{entry.category}</span>
                <h2>{entry.term}</h2>
                {entry.aka && entry.aka.length > 0 && (
                  <p className="enc-aka">Also called: {entry.aka.join(', ')}</p>
                )}
                <p className="enc-short">{renderGlossaryText(entry.short)}</p>
                {entry.body && <div className="enc-body">{renderProse(entry.body.join('\n\n'))}</div>}
                {entry.diagrams && entry.diagrams.length > 0 && (
                  <div className="enc-diagrams">
                    {entry.diagrams.map((spec, i) => (
                      <Diagram key={i} spec={spec} />
                    ))}
                  </div>
                )}
                {entry.examples && entry.examples.length > 0 && (
                  <section className="enc-examples">
                    <h3>Examples</h3>
                    <ul>
                      {entry.examples.map((ex) => (
                        <li key={ex}>{renderGlossaryText(ex)}</li>
                      ))}
                    </ul>
                  </section>
                )}
                {!entry.body && (
                  <p className="enc-stub">
                    A fuller write-up with diagrams and examples is on the way for this term.
                  </p>
                )}
                {entry.related && entry.related.length > 0 && (
                  <section className="enc-related">
                    <h3>Related</h3>
                    <div className="enc-related-tags">
                      {entry.related.map((name) => {
                        const targetId = glossaryId(name)
                        if (!glossaryEntryById.has(targetId)) return null
                        return (
                          <button key={name} type="button" onClick={() => openProblemById(targetId)}>
                            {name}
                          </button>
                        )
                      })}
                    </div>
                  </section>
                )}
                <section className="learning-path" aria-label="Encyclopedia pages">
                  <button
                    type="button"
                    onClick={() => previousProblem && openProblemById(previousProblem.id)}
                    disabled={!previousProblem || previousProblem.id === 'appendix-index'}
                  >
                    <span>Previous</span>
                    <strong>{previousProblem && previousProblem.id !== 'appendix-index' ? previousProblem.title : 'Index'}</strong>
                  </button>
                  <button type="button" className="enc-index-link" onClick={() => openProblemById('appendix-index')}>
                    <span>Browse</span>
                    <strong>All terms</strong>
                  </button>
                  <button
                    type="button"
                    onClick={() => nextProblem && openProblemById(nextProblem.id)}
                    disabled={!nextProblem}
                  >
                    <span>Next</span>
                    <strong>{nextProblem?.title ?? 'End'}</strong>
                  </button>
                </section>
              </article>
            )
          })()
        ) : (
        <article className="problem-panel">
          <div className="problem-heading">
            <div
              className="problem-type"
              style={{ color: TYPE_COLOR[activeProblem.type], background: `${TYPE_COLOR[activeProblem.type]}18`, borderColor: `${TYPE_COLOR[activeProblem.type]}40` }}
            >
              <ProblemTypeIcon type={activeProblem.type} />
              <span>{activeProblem.type}</span>
            </div>
            <div className="problem-meta">
              <span style={{ color: DIFFICULTY_COLOR[activeProblem.difficulty], background: `${DIFFICULTY_COLOR[activeProblem.difficulty]}18`, borderColor: `${DIFFICULTY_COLOR[activeProblem.difficulty]}40` }}>
                {activeProblem.difficulty}
              </span>
              <span>{activeProblem.minutes} min</span>
            </div>
          </div>

          <h2>{activeProblem.title}</h2>
          <p className="subject-subtitle">{renderGlossaryText(activeSubject.subtitle)}</p>

          <section className="mastery-panel" aria-label="Problem mastery progress">
            <div className="mastery-copy">
              <span>Confidence ladder</span>
              <strong>{activeConfidence}</strong>
              <p>
                {nextMasteryStep
                  ? `Next up: ${nextMasteryStep.label.toLowerCase()}. ${nextMasteryStep.help}`
                  : 'All steps done. Hit Complete this problem to lock it in.'}
              </p>
            </div>
            <div className="mastery-meter" aria-label={`${masteryPercent}% mastered`}>
              <div style={{ width: `${masteryPercent}%` }} />
            </div>
            <div className="confidence-ladder">
              {confidenceLevels.map((level) => {
                const levelIdx = confidenceLevels.indexOf(level)
                const activeIdx = confidenceLevels.indexOf(activeConfidence)
                const state = levelIdx < activeIdx ? 'past' : levelIdx === activeIdx ? 'current' : 'future'
                return (
                  <span key={level} className={state}>
                    {level}
                  </span>
                )
              })}
            </div>
            <div className="mastery-steps">
              {masterySteps.map((step) => (
                <span key={step.label} className={step.done ? 'done' : ''}>
                  {step.done ? <Check size={14} /> : <Circle size={14} />}
                  <strong>{step.label}</strong>
                  <small>{step.detail}</small>
                  <em>{step.help}</em>
                </span>
              ))}
            </div>
          </section>

          <section className="prompt-block task-block">
            <h3>Your Task</h3>
            {renderProse(activeProblem.prompt)}
          </section>

          <nav className="lesson-pager" aria-label="Lesson pages">
            {lessonPages.map((page, index) => (
              <button
                key={page.id}
                type="button"
                className={`lesson-pager-step ${index === pageIndex ? 'current' : ''} ${page.done ? 'done' : ''}`}
                onClick={() => setLessonStep(index)}
              >
                <span className="lesson-pager-dot">
                  {page.done ? <Check size={13} /> : index + 1}
                </span>
                <span className="lesson-pager-label">
                  <strong>{page.label}</strong>
                  <small>{page.hint}</small>
                </span>
              </button>
            ))}
          </nav>

          {activePage === 'learn' && (interactive?.mental || interactive?.diagram) && (
            <section className="mental-model-block" aria-label="Mental model">
              {interactive.mental && (
                <div className="mental-model-card">
                  <span className="interactive-badge">Mental model</span>
                  <p>{renderGlossaryText(interactive.mental)}</p>
                </div>
              )}
              {interactive.diagram && (
                <InteractiveDiagram
                  nodes={interactive.diagram.nodes}
                  explanations={interactive.diagram.explanations}
                />
              )}
            </section>
          )}

          {activePage === 'learn' && interactive && (
            <section className="interactive-lesson" aria-label="Hands-on example">
              {interactive.intro && (
                <p className="interactive-intro">{renderGlossaryText(interactive.intro)}</p>
              )}
              <div className="interactive-step">
                <span className="interactive-badge">See it run</span>
                <pre className="interactive-code"><code>{interactive.example.code}</code></pre>
                <details className="interactive-run">
                  <summary>Run ▶</summary>
                  <pre className="interactive-output"><code>{interactive.example.output}</code></pre>
                  {interactive.example.explain && (
                    <p>{renderGlossaryText(interactive.example.explain)}</p>
                  )}
                </details>
              </div>
              {interactive.tweak && (
                <div className="interactive-step">
                  <span className="interactive-badge">Now you try</span>
                  <p>{renderGlossaryText(interactive.tweak.instruction)}</p>
                  <details className="interactive-run">
                    <summary>Show what happens</summary>
                    <p>{renderGlossaryText(interactive.tweak.reveal)}</p>
                  </details>
                </div>
              )}
            </section>
          )}

          {activePage === 'learn' && !interactive && (
          <section className="learn-first-block" aria-label="Learn first">
            <div className="learn-first-heading">
              <div>
                <h3>Learn First</h3>
                <p>{renderGlossaryText(teachingModel.problemIntro)}</p>
              </div>
              <span>{activeSubject.title}</span>
            </div>

            {teachingModel.problemLesson ? (
              <>
                <div className="lesson-focus">
                  <section className="lesson-focus-card lesson-focus-card-primary">
                    <span>Concept</span>
                    {renderProse(teachingModel.problemLesson.concept)}
                  </section>

                  <section className="lesson-focus-card">
                    <span>Idiom</span>
                    <pre><code>{teachingModel.problemLesson.idiom}</code></pre>
                  </section>

                  {teachingModel.problemLesson.example && (
                    <section className="lesson-focus-card">
                      <span>Worked Example</span>
                      <pre><code>{teachingModel.problemLesson.example}</code></pre>
                    </section>
                  )}

                  {teachingModel.problemLesson.mistake && (
                    <section className="lesson-focus-card lesson-focus-card-warning">
                      <span>Avoid</span>
                      <p>{renderGlossaryText(teachingModel.problemLesson.mistake)}</p>
                    </section>
                  )}
                </div>

                <div className="lesson-detail-row">
                  <details>
                    <summary>Practice Path</summary>
                    <InteractiveDiagram
                      nodes={teachingModel.diagram}
                      explanations={teachingModel.diagramExplanations}
                    />
                  </details>
                  <details>
                    <summary>Go Deeper</summary>
                    <ul>
                      {teachingModel.advanced.map((item) => (
                        <li key={item}>{renderGlossaryText(item)}</li>
                      ))}
                    </ul>
                  </details>
                  <details>
                    <summary>Interview Tips</summary>
                    <ul>
                      {teachingModel.interview.map((item) => (
                        <li key={item}>{renderGlossaryText(item)}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              </>
            ) : activeProblem.walkthrough && activeProblem.walkthrough.length > 0 ? (
              <>
                <div className="lesson-focus">
                  <section className="lesson-focus-card lesson-focus-card-primary">
                    <span>Core Idea</span>
                    {renderProse(teachingModel.mentalModel)}
                  </section>
                </div>

                {!interactive && (
                  <section className="lesson-walkthrough">
                    <h4>Follow This Path</h4>
                    <ol>
                      {activeProblem.walkthrough.map((item) => (
                        <li key={item}>{renderLessonListItem(item)}</li>
                      ))}
                    </ol>
                  </section>
                )}

                <div className="lesson-detail-row">
                  <details>
                    <summary>Foundation Notes</summary>
                    <ul>
                      {teachingModel.fundamentals.map((item) => (
                        <li key={item}>{renderLessonListItem(item)}</li>
                      ))}
                    </ul>
                  </details>
                  <details>
                    <summary>Go Deeper</summary>
                    <ul>
                      {teachingModel.advanced.map((item) => (
                        <li key={item}>{renderGlossaryText(item)}</li>
                      ))}
                    </ul>
                  </details>
                  <details>
                    <summary>Interview Tips</summary>
                    <ul>
                      {teachingModel.interview.map((item) => (
                        <li key={item}>{renderGlossaryText(item)}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              </>
            ) : (
              <>
                <div className="lesson-focus">
                  <section className="lesson-focus-card lesson-focus-card-primary">
                    <span>Core Idea</span>
                    {renderProse(teachingModel.mentalModel)}
                  </section>
                </div>

                <section className="lesson-walkthrough">
                  <h4>Learn It In Order</h4>
                  <ol>
                    {teachingModel.tutorial.map((item) => (
                      <li key={item}>{renderLessonListItem(item)}</li>
                    ))}
                  </ol>
                </section>

                <div className="lesson-detail-row">
                  <details>
                    <summary>Foundation Notes</summary>
                    <ul>
                      {teachingModel.fundamentals.map((item) => (
                        <li key={item}>{renderLessonListItem(item)}</li>
                      ))}
                    </ul>
                  </details>
                  <details>
                    <summary>Advanced Knowledge</summary>
                    <ul>
                      {teachingModel.advanced.map((item) => (
                        <li key={item}>{renderGlossaryText(item)}</li>
                      ))}
                    </ul>
                  </details>
                  <details>
                    <summary>Interview Tips</summary>
                    <ul>
                      {teachingModel.interview.map((item) => (
                        <li key={item}>{renderGlossaryText(item)}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              </>
            )}
          </section>
          )}

          {activePage === 'prove' && recallPrompts.length > 0 && (
            <>
              <button type="button" className="deep-open" onClick={() => setOpenModal('quickwrite')}>
                <span>Quick Write</span>
                <small>Optional · say it in your own words →</small>
              </button>
              {openModal === 'quickwrite' && (
                <Modal title="Quick Write" onClose={() => setOpenModal(null)}>

              <div className="recall-grid">
                {recallPrompts.map((item, index) => {
                  const value = progress.recallAnswer[`${activeProblem.id}:${index}`] ?? ''

                  return (
                    <section key={`${item.prompt}:${index}`} className="recall-card">
                      <div className="recall-card-heading">
                        <span>{item.badge}</span>
                      </div>
                      <h4>{renderGlossaryText(item.prompt)}</h4>
                      <textarea
                        value={value}
                        onChange={(event) =>
                          updateRecallAnswer(activeProblem.id, index, event.target.value)
                        }
                        placeholder={item.placeholder}
                      />
                      <details>
                        <summary>Reveal model answer</summary>
                        <div className="quick-write-answer">
                          <strong>Expected answer should hit:</strong>
                          <ul>
                        {item.expected.map((point) => (
                              <li key={point}>{renderGlossaryText(point)}</li>
                            ))}
                          </ul>
                          <p>
                            <strong>Production/debug anchor:</strong>{' '}
                            {renderGlossaryText(item.productionAnchor)}
                          </p>
                        </div>
                      </details>
                    </section>
                  )
                })}
              </div>
            
                </Modal>
              )}
              </>
          )}

          {activePage === 'predict' && tutorialChecks.length > 0 && (
            <section className="guided-tutorial-checks" aria-label="Predict the output">
              <div className="guided-tutorial-heading">
                <h4>Predict The Output</h4>
                <p>Run the snippet from the Learn page in your head, then check your prediction.</p>
              </div>
              {interactive && (
                <details className="predict-snippet">
                  <summary>Peek at the snippet again</summary>
                  <pre className="interactive-code"><code>{interactive.example.code}</code></pre>
                </details>
              )}
              <div className="criterion-list">
                {tutorialChecks.slice(0, visibleTutorialCount).map((check, index) => {
                  const selected = progress.tutorialChoice[`${activeProblem.id}:${index}`]
                  const answered = selected !== undefined
                  const correct = selected === check.correctChoice

                  return (
                    <section key={check.question} className="criterion-card tutorial-card">
                      <h4>{check.question}</h4>
                      <div className="criterion-choices">
                        {check.options.map((option, optionIndex) => {
                          const isSelected = selected === optionIndex
                          const isCorrect = check.correctChoice === optionIndex
                          const reveal =
                            isSelected || (answered && isCorrect) || (solutionChecked && isCorrect)

                          return (
                            <button
                              key={option}
                              className={`criterion-choice ${isSelected ? 'selected' : ''} ${
                                reveal && isCorrect ? 'correct' : ''
                              } ${reveal && isSelected && !isCorrect ? 'wrong' : ''}`}
                              onClick={() =>
                                selectTutorialStep(activeProblem.id, index, optionIndex)
                              }
                              type="button"
                            >
                              <span>{String.fromCharCode(65 + optionIndex)}</span>
                              {option}
                            </button>
                          )
                        })}
                      </div>
                    {solutionChecked && !answered && (
                      <p className="criterion-feedback fail">
                        Pick an answer here. Correct answer: {check.options[check.correctChoice]}.
                      </p>
                    )}
                    {answered && (
                      <p className={`criterion-feedback ${correct ? 'pass' : 'fail'}`}>
                        {correct ? 'Correct.' : 'Not quite.'}{' '}
                        {renderGlossaryText(check.explanation)}
                      </p>
                    )}
                  </section>
                  )
                })}
              </div>
              {visibleTutorialCount < tutorialChecks.length && (
                <p className="unlock-note">
                  {tutorialChecks.length - visibleTutorialCount} more prediction
                  {tutorialChecks.length - visibleTutorialCount === 1 ? '' : 's'} waiting.
                </p>
              )}
            </section>
          )}

          {activePage === 'prove' && activeInterviewAnswers.length > 0 && (
            <>
              <button type="button" className="deep-open" onClick={() => setOpenModal('interview')}>
                <span>Explain It In An Interview</span>
                <small>Optional · junior, senior, system-design depth →</small>
              </button>
              {openModal === 'interview' && (
                <Modal title="Explain It In An Interview" onClose={() => setOpenModal(null)}>

              <div className="interview-answer-list">
                {activeInterviewAnswers.map((answer) => (
                  <details key={answer.key} className="interview-answer-card">
                    <summary>{answer.topic}</summary>
                    <div className="interview-answer-grid">
                      <section>
                        <span>Simple</span>
                        <p>{renderGlossaryText(answer.simple)}</p>
                      </section>
                      <section>
                        <span>Senior</span>
                        <p>{renderGlossaryText(answer.senior)}</p>
                      </section>
                      <section>
                        <span>System design</span>
                        <p>{renderGlossaryText(answer.systemDesign)}</p>
                      </section>
                    </div>
                  </details>
                ))}
              </div>
              <div className="defend-action">
                <div>
                  <strong>
                    {progress.defended[activeProblem.id]
                      ? 'Defend practice logged'
                      : 'Lock the top confidence rung'}
                  </strong>
                  <p>
                    Say one Simple, one Senior, and one System Design answer out loud for this
                    subject, then mark it practiced.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => markDefended(activeProblem.id)}
                  className={progress.defended[activeProblem.id] ? 'done' : ''}
                >
                  <Trophy size={16} />
                  {progress.defended[activeProblem.id] ? 'Can defend' : 'Mark defended'}
                </button>
              </div>
            
                </Modal>
              )}
              </>
          )}

          {activePage === 'learn' && interactive && (
            <>
              <button type="button" className="deep-open" onClick={() => setOpenModal('fullnotes')}>
                <span>Full Notes</span>
                <small>The complete write-up and production notes →</small>
              </button>
              {openModal === 'fullnotes' && (
                <Modal title="Full Notes" onClose={() => setOpenModal(null)}>

              {learnDeepBlocks}
            
                </Modal>
              )}
              </>
          )}

          {activePage === 'learn' && !interactive && learnDeepBlocks}

          {activePage === 'practice' && interactiveDrillIds.length > 0 && (
            <section className="practice-drills" aria-label="Write it yourself">
              <div className="guided-tutorial-heading">
                <h4>Write It Yourself</h4>
                <p>Edit the function, then click Run tests until everything passes.</p>
              </div>
              {interactiveDrillIds.map((drillId) => {
                const spec = specsByProblemId.get(drillId)
                if (!spec) {
                  return (
                    <p key={drillId} className="interactive-intro">
                      Loading runnable drill...
                    </p>
                  )
                }
                return (
                  <InlineDrill
                    key={drillId}
                    spec={spec}
                    code={progress.code[drillId] ?? spec.starter}
                    onChange={(value) => updateCode(drillId, value)}
                    onRun={() => void runCodingTests(drillId)}
                    running={runningProblemId === drillId}
                    result={gradeResults[drillId]}
                  />
                )
              })}
            </section>
          )}

          {activePage === 'practice' && activeProblem.choices && (
            <section className="quiz-block">
              <h3>Choose</h3>
              <div className="choices">
                {activeProblem.choices.map((choice, index) => {
                  const isSelected = selectedChoice === index
                  const isCorrect = activeProblem.correctChoice === index
                  const reveal =
                    isSelected ||
                    (selectedChoice !== undefined && isCorrect) ||
                    (solutionChecked && isCorrect)

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
              {solutionChecked && activeProblem.choices && selectedChoice === undefined && (
                <p className="quiz-result fail">
                  Choose an answer, then check solutions again. The explanation will appear here.
                </p>
              )}
              {quizAnswered && (
                <p className={`quiz-result ${quizCorrect ? 'pass' : 'fail'}`}>
                  {quizCorrect ? 'Correct.' : 'Not quite.'} Correct answer:{' '}
                  {activeProblem.correctChoice !== undefined &&
                    activeProblem.choices[activeProblem.correctChoice]}{' '}
                  {activeProblem.answer && renderGlossaryText(activeProblem.answer)}
                </p>
              )}
            </section>
          )}

          {activePage === 'practice' && isCodingProblem && !activeSpec && (
            <section className="coding-block">
              <div className="coding-heading">
                <div>
                  <h3>Coding Tests</h3>
                  <p>Loading runnable assessment...</p>
                </div>
              </div>
            </section>
          )}

          {activePage === 'practice' && activeSpec && (
            <section className="coding-block">
              <div className="coding-heading">
                <div>
                  <h3>Coding Tests</h3>
                  <p>
                    {activeSpec.title} ·{' '}
                    {activeSpec.language === 'py'
                      ? 'Python'
                      : activeSpec.language === 'ts'
                        ? 'TypeScript'
                        : 'JavaScript'}
                  </p>
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

              <div className="coding-instructions">
                <strong>Do this</strong>
                <ol>
                  <li>Edit the function in the editor. Keep the function/class name exactly as shown.</li>
                  <li>Use the prompt, example, and solution checks to decide the behavior.</li>
                  <li>Click Run tests. Passing tests plus correct solution checks completes this problem.</li>
                </ol>
              </div>

              <div className="test-preview">
                <strong>Tests you need to satisfy</strong>
                <ul>
                  {activeSpec.tests.map((test) => (
                    <li key={test.name}>
                      <Circle size={14} />
                      <span>{test.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="code-editor-shell">
                <pre
                  ref={codeHighlightRef}
                  className="code-highlight"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
                <textarea
                  className="code-editor"
                  value={activeCode}
                  onChange={(event) => updateCode(activeProblem.id, event.target.value)}
                  onKeyDown={handleCodeKeyDown}
                  onScroll={syncCodeEditorScroll}
                  spellCheck={false}
                  aria-label={`${activeSpec.title} code editor`}
                />
              </div>

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
                  {activeGradeResult.logs && activeGradeResult.logs.length > 0 && (
                    <div className="console-output">
                      <strong>Console output</strong>
                      <pre>{activeGradeResult.logs.join('\n')}</pre>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {activePage === 'prove' && interactive?.recap && interactive.recap.length > 0 && (
            <section className="interactive-step interactive-recap recap-block">
              <span className="interactive-badge">Lock it in</span>
              <ul>
                {interactive.recap.map((item) => (
                  <li key={item}>{renderGlossaryText(item)}</li>
                ))}
              </ul>
            </section>
          )}

          {activePage === 'prove' && activeProblem.questions && (
            <>
              <button type="button" className="deep-open" onClick={() => setOpenModal('review')}>
                <span>Review Questions</span>
                <small>Optional · test yourself →</small>
              </button>
              {openModal === 'review' && (
                <Modal title="Review Questions" onClose={() => setOpenModal(null)}>

              <div className="review-card-grid">
                {activeProblem.questions.map((question, index) => (
                  <details key={question} className="review-card">
                    <summary>
                      <span>{index + 1}</span>
                      {question}
                    </summary>
                    <div>
                      <strong>What a strong answer should include</strong>
                      <ul>
                        {activeProblem.answer && index === 0 && (
                          <li>{renderGlossaryText(activeProblem.answer)}</li>
                        )}
                        {(activeProblem.checklist.length > 0
                          ? activeProblem.checklist
                          : teachingModel.fundamentals
                        )
                          .slice(index, index + 3)
                          .map((item) => (
                            <li key={item}>{renderGlossaryText(item)}</li>
                          ))}
                      </ul>
                    </div>
                  </details>
                ))}
              </div>
            
                </Modal>
              )}
              </>
          )}

          {activePage === 'prove' && (
          <section className="solution-check-block">
            <div className="solution-heading">
              <div>
                <h3>Check Yourself</h3>
                <p>
                  Tick each skill once you can honestly do it. {acceptanceCorrectCount}/
                  {activeProblem.checklist.length} checked.
                </p>
              </div>
              {acceptanceCorrect && <strong className="pass">All checked. Nice.</strong>}
            </div>
            <div className="self-check-list">
              {activeProblem.checklist.map((item, index) => {
                const checked = checklistChecked[index]
                return (
                  <button
                    key={item}
                    type="button"
                    className={`self-check-item ${checked ? 'checked' : ''}`}
                    onClick={() => selectCriterion(activeProblem.id, index, checked ? 0 : 1)}
                    aria-pressed={checked}
                  >
                    {checked ? <Check size={16} /> : <Circle size={16} />}
                    <span>{renderGlossaryText(item)}</span>
                  </button>
                )
              })}
            </div>
          </section>

          )}

          {activePage === 'prove' && (
          <details className="notes-block">
            <summary>
              <h3>Notes</h3>
              <span>Optional scratchpad</span>
            </summary>
            <textarea
              value={progress.notes[activeProblem.id] ?? ''}
              onChange={(event) => updateNote(activeProblem.id, event.target.value)}
              placeholder="Jot down your own explanation, edge cases, or debugging path."
            />
          </details>

          )}

          {activePage === 'prove' && (
          <div className="actions">
            <button
              className={`check-button ${completedSet.has(activeProblem.id) ? 'done' : ''}`}
              onClick={checkSolutions}
              type="button"
            >
              <Check size={18} />
              {completedSet.has(activeProblem.id)
                ? 'Completed'
                : canComplete || canCompleteAfterCheck
                  ? 'Complete this problem'
                  : 'Check my progress'}
            </button>
            <button className="reset-button" onClick={resetProgress} type="button">
              <RotateCcw size={17} />
              Reset progress
            </button>
          </div>
          )}

          <div className="lesson-pager-nav">
            <button
              type="button"
              disabled={pageIndex === 0}
              onClick={() => setLessonStep(pageIndex - 1)}
            >
              ← Back
            </button>
            <span>
              {lessonPages[pageIndex].label} · page {pageIndex + 1} of {lessonPages.length}
            </span>
            <button
              type="button"
              className="pager-continue"
              disabled={pageIndex === lessonPages.length - 1}
              onClick={() => setLessonStep(pageIndex + 1)}
            >
              Continue →
            </button>
          </div>

          <section className="learning-path" aria-label="Learning path">
            <button
              type="button"
              onClick={() => previousProblem && openProblemById(previousProblem.id)}
              disabled={!previousProblem}
            >
              <span>Previous</span>
              <strong>{previousProblem?.title ?? 'Start of course'}</strong>
            </button>
            <div>
              <span>Now</span>
              <strong>{teachingModel.practiceMode}</strong>
              {isCodingProblem && <small>Runnable assessment attached</small>}
            </div>
            <button
              type="button"
              onClick={() => nextProblem && openProblemById(nextProblem.id)}
              disabled={!nextProblem}
            >
              <span>Next</span>
              <strong>{nextProblem?.title ?? 'End of course'}</strong>
            </button>
          </section>
        </article>
        )}
      </section>
    </main>
  )
}

export default App
