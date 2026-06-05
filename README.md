# Backend Omniscience

https://backend-omniscience.vercel.app/

A repo-based backend training app for building backend omniscience through repeated drills, debugging prompts, design exercises, and capstone builds.

The course is inspired by roadmap-style backend progression and organized into subjects:

- Internet & HTTP
- Backend language core
- SQL & PostgreSQL
- API design
- Auth & security
- Architecture
- DevOps for backend
- Performance & scale
- System design
- Capstone gauntlet

## Run Locally

```bash
npm install
npm run dev
```

Progress and notes are stored in browser localStorage.

Run all local checks with:

```bash
npm run check
```

The in-browser coding test specs can be self-tested with:

```bash
npm run grader:selftest
```

## Expand The Course

Add or edit subjects and problems in `src/course.ts`. The GUI updates automatically from that data.

## Curriculum Authoring Rules

- Keep every subject `id` and problem `id` unique.
- Use stable IDs; progress is keyed by problem ID in localStorage.
- Give every problem a prompt, a positive minute estimate, and at least one checklist item.
- For quizzes, include at least two `choices` and a zero-based `correctChoice`.
- Prefer small, forceful exercises over long passive lessons.
