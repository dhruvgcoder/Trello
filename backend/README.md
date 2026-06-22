# Project Management API

A RESTful API backend for a project management system built with Express.js, MongoDB, and TypeScript. This API enables users to manage organizations, boards, issues, and user accounts with role-based access control and JWT authentication.

## Features

- **User Management**: Create and manage user accounts with secure password hashing
- **Authentication**: JWT-based authentication and authorization
- **Organization Management**: Create and manage organizations
- **Board Management**: Create and manage project boards within organizations
- **Issue Tracking**: Create, update, and manage issues across boards
- **Role-Based Access Control**: Admin and user middleware for access control
- **Input Validation**: Zod-based schema validation for all API inputs

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Environment**: dotenv

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB (local or cloud instance, e.g., MongoDB Atlas)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/dhruvgcoder/Trello.git
cd Trello
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following environment variables:
```env
PORT=3001
MONGODB_URL=mongodb://localhost:27017/yourdb
userSecret=your_jwt_secret_key
```

## Getting Started

### Development

Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001` (or the port specified in `.env`).

### Build

To compile TypeScript to JavaScript:
```bash
npx tsc -b
```

The compiled files will be in the `dist` folder.

## API Routes

### Users (`/users`)
- Create, read, update, and delete user accounts
- User authentication and profile management

### Organizations (`/organization`)
- Manage organizations and their settings
- Organization-level operations

### Boards (`/boards`)
- Create and manage project boards
- Board-specific operations

### Issues (`/issues`)
- Create and manage issues/tasks
- Issue tracking and updates

## Project Structure

```
src/
├── controllers/        # Request handlers
│   ├── user.controller.ts
│   ├── organization.controller.ts
│   ├── board.controller.ts
│   └── issue.controller.ts
├── routes/            # API route definitions
│   ├── user.route.ts
│   ├── organization.route.ts
│   ├── board.route.ts
│   └── issue.route.ts
├── services/          # Business logic
│   └── organization.service.ts
├── middlewares/       # Express middlewares
│   ├── authMiddleware.ts
│   └── adminMiddleware.ts
├── validators/        # Input validation schemas
│   └── z.ts
├── db.ts             # Database connection setup
├── env.ts            # Environment variables schema
├── types.d.ts        # Type definitions
└── index.ts          # Application entry point
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3001) | No |
| `MONGODB_URL` | MongoDB connection string | Yes |
| `userSecret` | JWT secret key for token signing | Yes |

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the `token` header:

```
token: <your_jwt_token>
```

## Middleware

- **authMiddleware**: Verifies JWT tokens and authenticates requests
- **adminMiddleware**: Restricts access to admin-only endpoints

## Development Notes

- The project uses ES modules (`"type": "module"` in package.json)
- TypeScript is configured for strict type checking
- Input validation is enforced using Zod schemas
- Passwords are hashed using bcrypt before storage

## License

ISC

## Author

Dhruv Gupta
