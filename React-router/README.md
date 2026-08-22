# React Router Example

A React and Vite application for practicing client-side routing with React Router. It uses a shared layout with a navigation header and footer, nested routes, a dynamic user route, and a data loader for GitHub profile information.

## Features

- Client-side navigation with React Router
- Shared `Header` and `Footer` through a layout route
- Active navigation links with `NavLink`
- Dynamic user route at `/user/:id`
- GitHub profile data loaded with a route `loader` and `useLoaderData`
- Responsive styling with Tailwind CSS

## Routes

| Path        | Page    | Description                        |
| ----------- | ------- | ---------------------------------- |
| `/`         | Home    | Landing page content               |
| `/about`    | About   | About page                         |
| `/contact`  | Contact | Contact page                       |
| `/user/:id` | User    | Dynamic user page                  |
| `/Github`   | Github  | GitHub profile loaded from the API |

The GitHub route requests data from `https://api.github.com/users/mostakim15`, so it requires an internet connection when the page is opened.

## Tech Stack

- React 19
- Vite
- React Router DOM 7
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
│   ├── About/About.jsx       # About route
│   ├── Contact/Contact.jsx   # Contact route
│   ├── Footer/Footer.jsx     # Shared footer
│   ├── Github/Github.jsx     # GitHub route and loader
│   ├── Header/Header.jsx     # Shared navigation
│   ├── Home/Home.jsx         # Home route
│   └── User/User.jsx         # Dynamic user route
├── Layout.jsx                # Shared layout with Outlet
├── App.jsx                   # Root component
└── main.jsx                  # Router configuration and entry point
```
