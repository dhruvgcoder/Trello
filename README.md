# Trello Main

A full-stack task board application inspired by Trello. Users can sign up, sign in, create organizations, manage boards inside organizations, and track issues through status changes.

## Features

- User signup and signin with JWT authentication
- Organization creation and membership management
- Admin-only organization actions
- Board creation within organizations
- Issue creation and status updates
- React frontend with Tailwind CSS
- Express, TypeScript, MongoDB, and Mongoose backend

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- bcrypt password hashing
- Zod validation

## Project Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── db.ts
│   │   ├── env.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB, either local or hosted through a service such as MongoDB Atlas

## Getting Started

Clone the repository and install dependencies for both apps:

```bash
git clone <repository-url>
cd Trello-main

cd backend
npm install

cd ../frontend
npm install
```

## Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=3001
MONGODB_URL=mongodb://localhost:27017/trello-main
userSecret=replace_with_a_strong_jwt_secret
```

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Backend server port. Defaults to `3001`. |
| `MONGODB_URL` | Yes | MongoDB connection string. |
| `userSecret` | Yes | Secret used to sign JWT tokens. |

The frontend API client currently points to `http://localhost:3001` in `frontend/src/api.js`.

## Running Locally

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

By default:

- Backend: `http://localhost:3001`
- Frontend: Vite will print the local URL, usually `http://localhost:5173`

## Available Scripts

### Backend

```bash
npm run dev
```

Builds the TypeScript backend and starts `dist/index.js`.

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

- `dev`: start the Vite development server
- `build`: create a production build
- `preview`: preview the production build locally

## API Overview

Authentication uses a bearer token:

```http
Authorization: Bearer <token>
```

Main routes:

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/users/signup` | Create a user account |
| `POST` | `/users/signin` | Sign in and receive a JWT |
| `GET` | `/organization` | List organizations for the signed-in user |
| `POST` | `/organization/create` | Create an organization |
| `POST` | `/organization/:orgId/invite` | Invite a member to an organization |
| `GET` | `/organization/:orgId/members` | List organization members |
| `DELETE` | `/organization/:orgId/remove` | Remove a member |
| `GET` | `/boards/dashboard/:orgId` | List boards in an organization |
| `POST` | `/boards/:orgId` | Create a board |
| `GET` | `/issues/:boardId` | List issues for a board |
| `POST` | `/issues/:boardId` | Create an issue |
| `PUT` | `/issues/:issueId` | Update an issue status |

Issue statuses are:

- `inProgress`
- `pending`
- `done`
- `archived`

For more backend-specific details, see `backend/README.md`.

## Notes

- The backend must be running before the frontend can sign in or load task data.
- Some organization and board actions are protected by admin middleware.
- Passwords are hashed with bcrypt before being stored.

## License

ISC
