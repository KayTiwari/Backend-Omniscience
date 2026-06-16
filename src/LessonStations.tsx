import { Fragment } from 'react'
import type { Station } from './course'

type LessonStationsProps = {
  stations: Station[]
  // The problem id currently open, used to mark the current station.
  activeProblemId: string
  // Problem ids the learner has completed, used to mark passed stations.
  completed: Set<string>
  onSelect: (problemId: string) => void
}

// Sticky station-path progress indicator for a module that defines a journey,
// e.g. [Browser] -> [DNS] -> [TCP] -> ... The learner feels they are traveling
// along the request path, which is more engaging than a flat lesson list.
export function LessonStations({ stations, activeProblemId, completed, onSelect }: LessonStationsProps) {
  const currentIndex = stations.findIndex((station) => station.problemId === activeProblemId)

  return (
    <nav className="lesson-stations" aria-label="Module journey">
      {stations.map((station, index) => {
        const isCurrent = index === currentIndex
        // A station counts as done when its problem is completed, or when the
        // learner has already traveled past it on the path.
        const isDone =
          completed.has(station.problemId) || (currentIndex > -1 && index < currentIndex)
        return (
          <Fragment key={station.problemId}>
            {index > 0 && <span className="lesson-station-arrow" aria-hidden="true">→</span>}
            <button
              type="button"
              className={`lesson-station ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => onSelect(station.problemId)}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className="lesson-station-dot" />
              {station.label}
            </button>
          </Fragment>
        )
      })}
    </nav>
  )
}
