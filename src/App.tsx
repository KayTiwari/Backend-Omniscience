import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Code2,
  Download,
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
  Upload,
} from 'lucide-react'
import './App.css'
import {
  allProblems,
  subjects,
  type Problem,
  type ProblemType,
  type Subject,
} from './course'
import { validateCourse } from './courseValidation'
import { applyEditorKey } from './editorKeys'
import { allSpecs, grade, type GradeResult } from './grader'
import { InteractiveDiagram } from './InteractiveDiagram'
import { ScrollProgress } from './ScrollProgress'
import { interviewAnswers } from './interviewAnswers'
import { renderMarkdown } from './miniMarkdown'
import { getTeachingModel } from './problemTeaching'
import { projects } from './projects'
import { quickWrites } from './quickWrite'
import { requestLifecycle } from './requestLifecycle'
import { tutorials } from './tutorials'

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
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const [importMessage, setImportMessage] = useState('')
  const [gradeResults, setGradeResults] = useState<Record<string, GradeResult>>({})
  const [runningProblemId, setRunningProblemId] = useState('')
  const [theme, setTheme] = useState<Theme>(() => loadTheme())
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const importInputRef = useRef<HTMLInputElement>(null)

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

  const activeSubject = subjects.find((subject) => subject.id === activeSubjectId) ?? subjects[0]
  const activeProblem =
    activeSubject.problems.find((problem) => problem.id === activeProblemId) ??
    activeSubject.problems[0]

  const problemIds = useMemo(() => new Set(allProblems.map((problem) => problem.id)), [])
  const specsByProblemId = useMemo(
    () => new Map(allSpecs.map((spec) => [spec.problemId, spec])),
    [],
  )
  const completedSet = useMemo(
    () => new Set(progress.completed.filter((problemId) => problemIds.has(problemId))),
    [problemIds, progress.completed],
  )
  function getProblemConfidence(problem: Problem): ConfidenceLevel {
    if (completedSet.has(problem.id) && progress.defended[problem.id]) return 'Can defend'
    if (completedSet.has(problem.id)) return 'Can build'

    const spec = specsByProblemId.get(problem.id)
    if (spec && gradeResults[problem.id]?.passed) return 'Can build'

    const hasQuizAnswer = progress.selectedChoice[problem.id] !== undefined
    const hasSolutionCheck = progress.checkedSolutions[problem.id] === true
    const hasCodeEdit = spec ? progress.code[problem.id] !== undefined : false
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
  const gradableCount = specsByProblemId.size
  const totalMinutes = allProblems.reduce((sum, problem) => sum + problem.minutes, 0)
  const completedMinutes = allProblems
    .filter((problem) => completedSet.has(problem.id))
    .reduce((sum, problem) => sum + problem.minutes, 0)
  const remainingMinutes = totalMinutes - completedMinutes
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
    const codingCount = subject.problems.filter((problem) => specsByProblemId.has(problem.id)).length
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
  const activeInterviewAnswers = useMemo(
    () => interviewAnswers.filter((answer) => answer.subjectId === activeSubject.id),
    [activeSubject.id],
  )
  const activeQuickWrites = useMemo(
    () => quickWrites.filter((item) => item.subjectId === activeSubject.id),
    [activeSubject.id],
  )

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
        recallAnswer: imported.recallAnswer ?? {},
        selectedChoice: imported.selectedChoice ?? {},
        criterionChoice: imported.criterionChoice ?? {},
        tutorialChoice: imported.tutorialChoice ?? {},
        checkedSolutions: imported.checkedSolutions ?? {},
        defended: imported.defended ?? {},
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
    const result = await grade(spec, code)
    setGradeResults((current) => ({ ...current, [activeProblem.id]: result }))
    setRunningProblemId('')

    if (
      result.passed &&
      solutionChecked &&
      recallComplete &&
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
  const teachingModel = useMemo(
    () => getTeachingModel(activeSubject, activeProblem),
    [activeSubject, activeProblem],
  )
  const activeGradeResult = gradeResults[activeProblem.id]
  const isRunningTests = runningProblemId === activeProblem.id
  const previousProblem = activeIndex > 0 ? allProblems[activeIndex - 1] : undefined
  const nextProblem = activeIndex < allProblems.length - 1 ? allProblems[activeIndex + 1] : undefined
  const acceptanceChecks = useMemo(
    () =>
      activeProblem.checklist.map((item, index) => {
        const distractors = [
          'Skip this for now and rely on manual testing later.',
          'Mention the concept by name without explaining how it behaves.',
          'Assume the framework handles this automatically in production.',
          'Only test the happy path and ignore failure behavior.',
          ...activeProblem.checklist.filter((_, itemIndex) => itemIndex !== index),
        ].filter((choice) => choice !== item)
        const options = [item, ...distractors.slice(0, 3)]
        const rotation = (activeProblem.id.length + index) % options.length
        const rotated = [...options.slice(rotation), ...options.slice(0, rotation)]

        return {
          correctChoice: rotated.indexOf(item),
          explanation: `Correct: ${item} This matters because it is one of the observable behaviors your solution must prove, not a passive checklist item.`,
          options: rotated,
          question: `Which answer best satisfies checkpoint ${index + 1}?`,
        }
      }),
    [activeProblem],
  )
  const tutorialChecks = useMemo(
    () =>
      teachingModel.tutorial.map((item, index) => {
        const distractors = [
          'Skip the model and jump straight to the final answer.',
          'Memorize the keyword only, without describing what it does.',
          'Assume the framework hides this detail from production engineers.',
          'Only handle the happy path and ignore how this can fail.',
          ...teachingModel.tutorial.filter((_, itemIndex) => itemIndex !== index),
        ].filter((choice) => choice !== item)
        const options = [item, ...distractors.slice(0, 3)]
        const rotation =
          (activeSubject.id.length + activeProblem.id.length + index) % options.length
        const rotated = [...options.slice(rotation), ...options.slice(0, rotation)]

        return {
          correctChoice: rotated.indexOf(item),
          explanation: `Correct: ${item} This is the next small move because ${activeSubject.title} should be learned one boundary, input, or behavior at a time before the main drill.`,
          options: rotated,
          question: `Guided step ${index + 1}: what should you do next?`,
        }
      }),
    [activeProblem.id, activeSubject.id, activeSubject.title, teachingModel.tutorial],
  )
  const recallPrompts = useMemo(
    () => {
      if (activeQuickWrites.length > 0) {
        return activeQuickWrites.map((item, index) => ({
          badge: index === 0 ? 'Interview recall' : 'Production recall',
          expected: item.expected,
          placeholder: 'Write the answer you would say out loud in an interview.',
          productionAnchor: item.productionAnchor,
          prompt: item.prompt,
        }))
      }

      const firstFundamental = teachingModel.fundamentals[0] ?? teachingModel.mentalModel
      const secondFundamental = teachingModel.fundamentals[1] ?? teachingModel.fundamentals[0]
      const firstTutorialStep = teachingModel.tutorial[0] ?? activeProblem.checklist[0]
      const firstChecklistItem = activeProblem.checklist[0] ?? activeProblem.prompt
      const productionRisk =
        activeProblem.production ??
        teachingModel.advanced[0] ??
        'In production, misunderstanding this creates bugs that are hard to debug because the symptom shows up far away from the root cause.'

      return [
        {
          badge: 'Define it',
          expected: [
            `A strong beginner answer for ${activeProblem.title}: ${firstFundamental}`,
            'Name the concept before using implementation details.',
            'Say what problem it solves.',
          ],
          placeholder: `Define ${activeProblem.title} in 2-4 plain-English sentences.`,
          productionAnchor:
            'In production, a clear definition helps you choose the right layer to inspect before changing code.',
          prompt: `For "${activeProblem.title}", what is the first concept a total beginner needs to understand?`,
        },
        {
          badge: 'Use it',
          expected: [
            `A strong answer should include: ${secondFundamental}`,
            `For this problem, your next move is: ${firstTutorialStep}`,
            'Mention one thing the concept does not do.',
          ],
          placeholder: `Name what it does, what it does not do, and the next step you would take.`,
          productionAnchor:
            'In production, knowing the boundary prevents you from blaming a framework or service for work it never promised to do.',
          prompt: `For "${activeProblem.title}", what does this concept do, what does it not do, and what should you do next?`,
        },
        {
          badge: 'Production',
          expected: [
            `Connect the concept to observable behavior: ${productionRisk}`,
            `Prove this checkpoint: ${firstChecklistItem}`,
            'Name the symptom you would look for first.',
          ],
          placeholder: `Write one realistic bug, the symptom you would see, and what you would check first.`,
          productionAnchor:
            'A production answer should move from symptom to likely layer to the evidence you would collect.',
          prompt: `For "${activeProblem.title}", what bug could happen in production if you misunderstand this?`,
        },
      ]
    },
    [activeProblem, activeQuickWrites, teachingModel],
  )
  const recallAnsweredCount = recallPrompts.filter(
    (_, index) => (progress.recallAnswer[`${activeProblem.id}:${index}`] ?? '').trim().length > 0,
  ).length
  const recallComplete = recallAnsweredCount === recallPrompts.length
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
  const acceptanceCorrect = acceptanceChecks.every(
    (check, index) =>
      progress.criterionChoice[`${activeProblem.id}:${index}`] === check.correctChoice,
  )
  const acceptanceCorrectCount = acceptanceChecks.filter(
    (check, index) =>
      progress.criterionChoice[`${activeProblem.id}:${index}`] === check.correctChoice,
  ).length
  const firstIncompleteAcceptanceIndex = acceptanceChecks.findIndex(
    (check, index) =>
      progress.criterionChoice[`${activeProblem.id}:${index}`] !== check.correctChoice,
  )
  const visibleAcceptanceCount =
    firstIncompleteAcceptanceIndex === -1
      ? acceptanceChecks.length
      : firstIncompleteAcceptanceIndex + 1
  const quizRequirementCorrect =
    !activeProblem.choices || activeProblem.correctChoice === undefined || quizCorrect
  const codeRequirementCorrect = !activeSpec || activeGradeResult?.passed === true
  const applyRequirementDone = activeSpec
    ? codeRequirementCorrect
    : activeProblem.choices
      ? quizRequirementCorrect
      : solutionChecked
  const canComplete =
    recallComplete &&
    tutorialCorrect &&
    acceptanceCorrect &&
    applyRequirementDone
  const canCompleteAfterCheck =
    recallComplete &&
    tutorialCorrect &&
    acceptanceCorrect &&
    (activeSpec ? codeRequirementCorrect : activeProblem.choices ? quizRequirementCorrect : true)
  const masterySteps = [
    {
      label: 'Recall',
      detail: `${recallAnsweredCount}/${recallPrompts.length}`,
      done: recallComplete,
    },
    {
      label: 'Guided',
      detail: `${tutorialCorrectCount}/${tutorialChecks.length}`,
      done: tutorialCorrect,
    },
    {
      label: activeSpec ? 'Code' : activeProblem.choices ? 'Quiz' : 'Apply',
      detail: activeSpec
        ? activeGradeResult?.passed
          ? 'passed'
          : 'run tests'
        : activeProblem.choices
          ? quizCorrect
            ? 'correct'
            : 'answer'
          : solutionChecked
            ? 'checked'
            : 'check prompt',
      done: applyRequirementDone,
    },
    {
      label: 'Checks',
      detail: `${acceptanceCorrectCount}/${acceptanceChecks.length}`,
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
    : codeRequirementCorrect
      ? 'Can build'
      : recallComplete && tutorialCorrect
        ? 'Can explain'
        : recallAnsweredCount > 0 || tutorialCorrectCount > 0 || solutionChecked
          ? 'Learned'
          : 'Not started'

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

  return (
    <main
      className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      data-theme={theme}
    >
      <ScrollProgress />
      <aside className="sidebar">
        <button className="brand brand-button" onClick={openHome} type="button">
          <div className="brand-mark">
            <Flame size={22} />
          </div>
          <div>
            <p className="eyebrow">Roadmap gauntlet</p>
            <h1>Backend Omniscience</h1>
          </div>
        </button>

        <button className={`home-button ${isHome ? 'active' : ''}`} onClick={openHome} type="button">
          <Home size={17} />
          <span>Home</span>
        </button>


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
            className="icon-button sidebar-toggle"
            onClick={() => setSidebarCollapsed((current) => !current)}
            aria-label={sidebarCollapsed ? 'Show navigation' : 'Hide navigation'}
            type="button"
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
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
              {isHome ? 'Choose your next gauntlet' : `Problem ${activeIndex + 1} of ${allProblems.length}`}
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
                <h2>Choose your next backend rep.</h2>
                <p>
                  Work subject by subject, jump into coding drills, or continue from the next
                  unsolved problem.
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
                    <p>{hop.blurb}</p>
                    <small>{hop.failureMode}</small>
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
                          {specsByProblemId.has(problem.id) && <Code2 size={14} />}
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
                    <p>{project.pitch}</p>
                    <div className="project-concepts">
                      {project.concepts.slice(0, 5).map((concept) => (
                        <span key={concept}>{concept}</span>
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
                                {step.text}
                              </button>
                            ) : (
                              <span>{step.text}</span>
                            )}
                          </li>
                        )
                      })}
                    </ol>
                    <details className="project-stretch">
                      <summary>Stretch goals</summary>
                      <ul>
                        {project.stretch.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </details>
                  </section>
                ))}
              </div>
            </section>

            <section className="home-section">
              <h3>Subjects</h3>
              <div className="subject-grid">
                {subjectSummaries.map((subject) => {
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
                        <small>{subject.subtitle}</small>
                      </span>
                      <span className="subject-card-meta">
                        {subject.confidenceCounts['Can defend']} defend
                      </span>
                      <span className="subject-card-progress">
                        <span style={{ width: `${subject.percent}%`, background: subject.color }} />
                      </span>
                      <span className="subject-card-footer">
                        <span>
                          {subject.confidenceCounts['Can build']} build · {subject.codingCount} drills
                        </span>
                        <ArrowRight size={16} />
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          </article>
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
          <p className="subject-subtitle">{activeSubject.subtitle}</p>

          <section className="mastery-panel" aria-label="Problem mastery progress">
            <div className="mastery-copy">
              <span>Confidence ladder</span>
              <strong>{activeConfidence}</strong>
              <p>
                {nextMasteryStep
                  ? `${nextMasteryStep.detail} complete. Finish this step to unlock the next hit of progress.`
                  : 'You can explain, build, and defend this problem. Check solutions to lock it in.'}
              </p>
            </div>
            <div className="mastery-meter" aria-label={`${masteryPercent}% mastered`}>
              <div style={{ width: `${masteryPercent}%` }} />
            </div>
            <div className="confidence-ladder">
              {confidenceLevels.map((level) => (
                <span
                  key={level}
                  className={
                    confidenceLevels.indexOf(level) <= confidenceLevels.indexOf(activeConfidence)
                      ? 'done'
                      : ''
                  }
                >
                  {level}
                </span>
              ))}
            </div>
            <div className="mastery-steps">
              {masterySteps.map((step) => (
                <span key={step.label} className={step.done ? 'done' : ''}>
                  {step.done ? <Check size={14} /> : <Circle size={14} />}
                  <strong>{step.label}</strong>
                  <small>{step.detail}</small>
                </span>
              ))}
            </div>
          </section>

          <section className="learn-first-block" aria-label="Learn first">
            <div className="learn-first-heading">
              <div>
                <h3>Learn First</h3>
                <p>{teachingModel.problemIntro}</p>
              </div>
              <span>{activeSubject.title}</span>
            </div>

            <div className="visual-lesson">
              <InteractiveDiagram
                nodes={teachingModel.diagram}
                explanations={teachingModel.diagramExplanations}
              />
              <p>{teachingModel.mentalModel}</p>
            </div>

            <div className="lesson-grid">
              <section>
                <h4>Plain-English Fundamentals</h4>
                <ul>
                  {teachingModel.fundamentals.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h4>Tutorial Steps</h4>
                <ol>
                  {teachingModel.tutorial.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </section>
              <section>
                <h4>Advanced Knowledge</h4>
                <ul>
                  {teachingModel.advanced.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h4>Interview Tips</h4>
                <ul>
                  {teachingModel.interview.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="recall-checks" aria-label="Quick write practice">
              <div className="guided-tutorial-heading">
                <h4>Quick Write</h4>
                <p>
                  Answer the targeted prompt first, then compare it with the model answer.
                </p>
              </div>
              <div className="recall-grid">
                {recallPrompts.map((item, index) => {
                  const value = progress.recallAnswer[`${activeProblem.id}:${index}`] ?? ''
                  const hasAnswer = value.trim().length > 0

                  return (
                    <section key={`${item.prompt}:${index}`} className="recall-card">
                      <div className="recall-card-heading">
                        <span>{item.badge}</span>
                        {hasAnswer && <strong>+5 XP</strong>}
                      </div>
                      <h4>{item.prompt}</h4>
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
                              <li key={point}>{point}</li>
                            ))}
                          </ul>
                          <p>
                            <strong>Production/debug anchor:</strong> {item.productionAnchor}
                          </p>
                        </div>
                      </details>
                    </section>
                  )
                })}
              </div>
            </section>

            <section className="guided-tutorial-checks" aria-label="Guided tutorial questions">
              <div className="guided-tutorial-heading">
                <h4>Guided Tutorial Questions</h4>
                <p>
                  {tutorialCorrectCount}/{tutorialChecks.length} locked. Correct answers unlock the next step.
                </p>
              </div>
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
                        {correct ? 'Correct. +10 XP.' : 'Not quite.'} {check.explanation}
                      </p>
                    )}
                  </section>
                  )
                })}
              </div>
              {visibleTutorialCount < tutorialChecks.length && (
                <p className="unlock-note">
                  {tutorialChecks.length - visibleTutorialCount} more guided question
                  {tutorialChecks.length - visibleTutorialCount === 1 ? '' : 's'} waiting.
                </p>
              )}
            </section>

            <div className="practice-mode">
              <strong>How to use this problem</strong>
              <p>{teachingModel.practiceMode}</p>
            </div>
          </section>

          {activeInterviewAnswers.length > 0 && (
            <section className="interview-panel" aria-label="Explain it in an interview">
              <div className="guided-tutorial-heading">
                <h3>Explain It In An Interview</h3>
                <p>Practice the same concept at junior, senior, and system-design depth.</p>
              </div>
              <div className="interview-answer-list">
                {activeInterviewAnswers.map((answer) => (
                  <details key={answer.key} className="interview-answer-card">
                    <summary>{answer.topic}</summary>
                    <div className="interview-answer-grid">
                      <section>
                        <span>Simple</span>
                        <p>{answer.simple}</p>
                      </section>
                      <section>
                        <span>Senior</span>
                        <p>{answer.senior}</p>
                      </section>
                      <section>
                        <span>System design</span>
                        <p>{answer.systemDesign}</p>
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
            </section>
          )}

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
              <strong>
                {activeProblem.type === 'coding'
                  ? 'Build it, run tests, then explain the failure modes'
                  : activeProblem.type === 'quiz'
                    ? 'Answer, justify, and connect it to production behavior'
                    : activeProblem.type === 'debug'
                      ? 'Diagnose, prove, fix, and add a regression test'
                      : activeProblem.type === 'design'
                        ? 'Design the contract, data path, failures, and rollout'
                        : 'Learn the mental model, then write the smallest example'}
              </strong>
              {activeSpec && <small>Runnable assessment attached</small>}
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

          {tutorials.some((tut) => tut.subjectId === activeSubject.id) && (
            <section className="prompt-block learn-block">
              <h3>Learn</h3>
              {tutorials
                .filter((tut) => tut.subjectId === activeSubject.id)
                .map((tut) => (
                  <details key={tut.id} className="learn-item">
                    <summary>
                      {tut.title} · {tut.minutes} min
                    </summary>
                    <div
                      className="learn-body"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(tut.body) }}
                    />
                  </details>
                ))}
            </section>
          )}

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
                  {activeProblem.answer}
                </p>
              )}
            </section>
          )}

          {activeSpec && (
            <section className="coding-block">
              <div className="coding-heading">
                <div>
                  <h3>Coding Tests</h3>
                  <p>{activeSpec.title} · {activeSpec.language === 'py' ? 'Python' : 'JavaScript'}</p>
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

              <textarea
                className="code-editor"
                value={activeCode}
                onChange={(event) => updateCode(activeProblem.id, event.target.value)}
                onKeyDown={handleCodeKeyDown}
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

          <section className="solution-check-block">
            <div className="solution-heading">
              <div>
                <h3>Solution Checks</h3>
                <p>
                  {acceptanceCorrectCount}/{acceptanceChecks.length} locked. Correct answers unlock the next checkpoint.
                </p>
              </div>
              {solutionChecked && (
                <strong className={canComplete ? 'pass' : 'fail'}>
                  {canComplete ? 'Ready to move on.' : 'Review the misses.'}
                </strong>
              )}
            </div>
            <div className="criterion-list">
              {acceptanceChecks.slice(0, visibleAcceptanceCount).map((check, index) => {
                const selected = progress.criterionChoice[`${activeProblem.id}:${index}`]
                const answered = selected !== undefined
                const correct = selected === check.correctChoice

                return (
                  <section key={check.question} className="criterion-card">
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
                            onClick={() => selectCriterion(activeProblem.id, index, optionIndex)}
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
                        {correct ? 'Correct. +10 XP.' : 'Not quite.'} {check.explanation}
                      </p>
                    )}
                  </section>
                )
              })}
            </div>
            {visibleAcceptanceCount < acceptanceChecks.length && (
              <p className="unlock-note">
                {acceptanceChecks.length - visibleAcceptanceCount} more solution check
                {acceptanceChecks.length - visibleAcceptanceCount === 1 ? '' : 's'} waiting.
              </p>
            )}
          </section>

          <section className="notes-block">
            <h3>Notes</h3>
            <textarea
              value={progress.notes[activeProblem.id] ?? ''}
              onChange={(event) => updateNote(activeProblem.id, event.target.value)}
              placeholder=""
            />
          </section>

          <div className="actions">
            <button
              className={`check-button ${completedSet.has(activeProblem.id) ? 'done' : ''}`}
              onClick={checkSolutions}
              type="button"
            >
              <Check size={18} />
              {completedSet.has(activeProblem.id) ? 'Solutions passed' : 'Check solutions'}
            </button>
            <button className="reset-button" onClick={resetProgress} type="button">
              <RotateCcw size={17} />
              Reset progress
            </button>
          </div>
        </article>
        )}
      </section>
    </main>
  )
}

export default App
