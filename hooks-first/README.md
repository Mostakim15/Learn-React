# Hooks First

A React and Vite practice project focused on learning and using React Hooks through an interactive password generator and background color picker.

## Features

- Generate a random password between 6 and 20 characters
- Include numbers and symbols in generated passwords
- Copy the generated password to the clipboard
- Show a confirmation message after copying
- Change the page background with preset color buttons

## Hooks Demonstrated

- `useState` manages the password options, generated password, copy status, and background color
- `useCallback` memoizes password generation and clipboard handlers
- `useEffect` regenerates the password when its options change
- `useRef` selects the generated password input after copying

## Tech Stack

- React 19
- Vite
- Tailwind CSS 4
- ESLint with React Hooks and React Refresh plugins

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
| `npm run lint`    | Run ESLint                                        |

## Project Structure

```text
src/
├── App.jsx       # Password generator and color picker logic
├── App.css       # Component styles
├── index.css     # Global styles and Tailwind import
└── main.jsx      # React application entry point
```

All application behavior is currently contained in `src/App.jsx` so the hook usage is easy to follow.
