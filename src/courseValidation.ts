import type { Subject } from './course'

export function validateCourse(subjects: Subject[]) {
  const warnings: string[] = []
  const subjectIds = new Set<string>()
  const problemIds = new Set<string>()

  subjects.forEach((subject) => {
    if (!subject.id.trim()) warnings.push('A subject is missing an id.')
    if (!subject.title.trim()) warnings.push(`Subject "${subject.id}" is missing a title.`)
    if (subjectIds.has(subject.id)) warnings.push(`Duplicate subject id: ${subject.id}`)
    subjectIds.add(subject.id)

    if (subject.problems.length === 0) {
      warnings.push(`Subject "${subject.title}" has no problems.`)
    }

    subject.problems.forEach((problem) => {
      if (!problem.id.trim()) warnings.push(`A problem in "${subject.title}" is missing an id.`)
      if (problemIds.has(problem.id)) warnings.push(`Duplicate problem id: ${problem.id}`)
      problemIds.add(problem.id)

      if (!problem.title.trim()) warnings.push(`Problem "${problem.id}" is missing a title.`)
      if (!problem.prompt.trim()) warnings.push(`Problem "${problem.id}" is missing a prompt.`)
      if (problem.minutes <= 0) warnings.push(`Problem "${problem.id}" needs positive minutes.`)
      if (problem.checklist.length === 0) {
        warnings.push(`Problem "${problem.id}" needs at least one checklist item.`)
      }
      if (problem.checklist.some((item) => !item.trim())) {
        warnings.push(`Problem "${problem.id}" has an empty checklist item.`)
      }

      if (problem.type === 'quiz') {
        if (!problem.choices || problem.choices.length < 2) {
          warnings.push(`Quiz "${problem.id}" needs at least two choices.`)
        }
        if (problem.correctChoice === undefined) {
          warnings.push(`Quiz "${problem.id}" needs a correctChoice index.`)
        }
        if (
          problem.choices &&
          problem.correctChoice !== undefined &&
          (problem.correctChoice < 0 || problem.correctChoice >= problem.choices.length)
        ) {
          warnings.push(`Quiz "${problem.id}" has a correctChoice outside its choices.`)
        }
      }
    })
  })

  return warnings
}
