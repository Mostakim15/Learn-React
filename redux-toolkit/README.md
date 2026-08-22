# Redux Toolkit Todo

A small Todo application built with React and Vite to demonstrate state management with Redux Toolkit and React Redux.

## Features

- Add Todos from the input form
- Remove Todos
- Generate unique Todo IDs with Redux Toolkit's `nanoid`
- Keep Todo state in a centralized Redux store
- Define Todo actions with a Redux Toolkit slice

The slice also includes update and toggle actions for future UI controls.

## Tech Stack

- React 19
- Vite
- Redux Toolkit
- React Redux
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
├── app/
│   └── store.js             # Configures the Redux store
├── components/
│   ├── AddTodo.jsx          # Adds Todos by dispatching an action
│   └── Todos.jsx            # Reads and displays Todos from Redux
├── features/
│   └── todo/
│       └── todoSlice.js     # Todo state, reducers, and actions
├── App.jsx                 # Main application layout
└── main.jsx                # Redux Provider and application entry point
```

## Redux State

The Todo state is available at `state.todo.todos`. Each Todo has this shape:

```js
{
	id: string,
	text: string,
	completed: boolean
}
```
