# ZenTodo

A minimalist, zen-like todo app built with Next.js 16. No distractions. Just you and your tasks.

![ZenTodo Screenshot](https://via.placeholder.com/800x400?text=ZenTodo+Screenshot)

## Features

- **Task Management** - Create, complete, and delete tasks with smooth animations
- **Subtasks** - Break down tasks into smaller steps with progress tracking
- **Notes** - Add detailed descriptions to any task
- **Priorities** - Flag tasks as high, medium, or low priority
- **Tags** - Organize tasks with custom colored tags
- **Due Dates** - Set deadlines with recurring options (daily, weekly, monthly)
- **Filters** - Filter by status, priority, tags, and due dates
- **Search** - Quickly find tasks with debounced search
- **Sort** - Sort by created date, name, due date, or priority
- **Drag & Drop** - Reorder tasks with smooth drag and drop
- **Undo/Redo** - Full history support with keyboard shortcuts
- **Focus Mode** - Pomodoro timer with zen sounds for deep work
- **Dark/Light Theme** - Beautiful themes with smooth transitions
- **Keyboard Shortcuts** - Power user shortcuts for everything
- **Export/Import** - Backup and restore your data as JSON
- **PWA** - Install as app, works offline
- **Statistics** - Track your productivity with detailed stats

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: Bun
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Drag & Drop**: dnd-kit
- **Validation**: Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0+)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/zentodo.git
cd zentodo

# Install dependencies
bun install

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run type-check` | Run TypeScript check |
| `bun run test:e2e` | Run Playwright E2E tests |
| `bun run test:e2e:ui` | Run E2E tests with UI |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Focus input |
| `?` | Show shortcuts |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+D` | Toggle theme |
| `1` | Show all tasks |
| `2` | Show pending |
| `3` | Show completed |

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── manifest.ts      # PWA manifest
├── components/          # React components
│   ├── TodoApp.tsx      # Main app component
│   ├── TodoList.tsx     # Task list with DnD
│   ├── TodoInput.tsx    # Task input
│   ├── FocusMode.tsx    # Pomodoro timer
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useTodos.ts      # Todo state management
│   ├── useTags.ts       # Tags management
│   └── ...
├── types/               # TypeScript types
│   └── todo.ts          # Zod schemas
└── lib/                 # Utilities
    └── utils.ts         # Helper functions
```

## CI/CD

This project includes GitHub Actions workflows for:

- **CI Pipeline** (`ci.yml`)
  - TypeScript type checking
  - ESLint linting
  - Production build
  - Playwright E2E tests

- **Lighthouse CI** (`lighthouse.yml`)
  - Performance audits
  - Accessibility checks
  - Best practices validation

- **Dependabot** - Automated dependency updates

## License

MIT

## Author

Built with Claude Code and the Homer Donut methodology.
