import type { Problem } from './course'
import { frameworkMasteryProblems } from './course.frameworkMastery'

const reviewIndexes = [0, 4, 9, 14, 19, 24, 29, 34, 39, 44, 49]

function makeRapidReviews(subjectId: string): Problem[] {
  const mastery = frameworkMasteryProblems[subjectId] ?? []

  return reviewIndexes.flatMap((sourceIndex, reviewIndex) => {
    const problem = mastery[sourceIndex]
    if (!problem) return []

    const order = String(reviewIndex + 1).padStart(2, '0')
    const title = problem.title.replace(/^\d+\.\s*/, '')

    return [
      {
        id: `${subjectId}-rapid-review-${order}-${problem.id}`,
        title: `Rapid Review ${order}: ${title}`,
        type: 'quiz',
        difficulty: reviewIndex < 4 ? 'Core' : reviewIndex < 8 ? 'Hard' : 'Boss',
        minutes: 12,
        prompt:
          `Fast recall check: you just studied "${title}". What answer best proves production-grade understanding?`,
        choices: [
          'I can define the term, but I have not connected it to code or failure modes yet.',
          'I can explain the contract, write or sketch the smallest implementation, test a failure path, and name the production signal.',
          'I can rely on the framework default and revisit the details only if production breaks.',
          'I can skip edge cases because this concept is mostly theoretical.',
        ],
        correctChoice: 1,
        answer:
          'Production-grade understanding means you can connect the concept to a contract, implementation, failure path, test, and observable signal.',
        explanation:
          `This rapid review exists to make the concept stick after the longer lesson. For "${title}", do not stop at recognition. Recall the shape of the implementation, the boundary it protects, and the failure mode it prevents.`,
        production:
          'Production rewards recall under pressure. During a bug, design review, or interview, you need to retrieve the right model quickly and then prove it with code, tests, logs, or metrics.',
        walkthrough: [
          'Answer the quiz without rereading the lesson.',
          'Write a one-sentence definition from memory.',
          'Name the smallest implementation or pseudocode example.',
          'Name one failure mode and one test.',
          'Name one log, metric, trace, or dashboard signal.',
        ],
        questions: [
          `What is the simplest example of ${title}?`,
          'What boundary does this concept protect or clarify?',
          'What breaks if a beginner misunderstands it?',
          'What test proves the important behavior?',
          'What production signal proves it is healthy?',
        ],
        checklist: [
          'Answered from memory.',
          'Defined the concept in one sentence.',
          'Connected it to code.',
          'Named a failure path.',
          'Named a production signal.',
        ],
      },
    ]
  })
}

export const frameworkRapidReviewProblems: Record<string, Problem[]> = {
  nodejs: makeRapidReviews('nodejs'),
  python: makeRapidReviews('python'),
  django: makeRapidReviews('django'),
}
