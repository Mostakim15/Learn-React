# Todo Context

A simple Todo application built with React and Vite. It demonstrates how to share Todo state and actions across components with the React Context API.

## Features

- Add new Todos
- Mark Todos as complete or incomplete
- Edit incomplete Todos
- Delete Todos
- Persist Todos in the browser with `localStorage`
- Responsive styling with Tailwind CSS

## Tech Stack

- React 19
- Vite
- React Context API
- Tailwind CSS 4
- Oxlint

## Getting Started

From this project directory, install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually `http://localhost:5173`.

## Available Scripts

| Command           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Start the Vite development server with hot reload |
| `npm run build`   | Create a production build                         |
| `npm run preview` | Preview the production build locally              |
| `npm run lint`    | Run Oxlint                                        |

## Project Structure

```text
src/
├── components/
│   ├── TodoForm.jsx       # Form for adding Todos
│   └── TodoItem.jsx       # Todo display, edit, toggle, and delete actions
├── context/
│   └── TodoContext.js     # Todo Context and useTodo hook
├── App.jsx                # Application state, persistence, and layout
└── main.jsx               # React application entry point
```

Todos are stored under the `todos` key in the browser's `localStorage`. Clearing that key resets the list in the current browser.
