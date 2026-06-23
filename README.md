# CodeAlpha Project Management Tool

A complete project management application similar to Trello/Asana, built with React, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Project Management**: Create, edit, delete projects with custom colors
- **Team Collaboration**: Invite members with role-based permissions (Owner/Admin/Member)
- **Kanban Boards**: Drag-and-drop task management with customizable columns
- **Task Management**: Create, edit, delete tasks with priorities, due dates, labels, and assignees
- **Comments**: Real-time commenting on tasks with activity history
- **Notifications**: In-app notifications for task assignments, comments, and invites
- **Responsive UI**: Modern, mobile-friendly interface with Tailwind CSS

## Tech Stack

### Frontend
- React 18 + TypeScript
- React Router DOM
- Tailwind CSS
- Axios
- date-fns
- @hello-pangea/dnd (drag and drop)
- Lucide React icons

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing
- express-validator for validation
- helmet + cors for security

## Project Structure

```
codealpha-pm/
├── server/                     # Backend
│   ├── controllers/            # Route controllers
│   │   ├── authController.js
│   │   ├── boardController.js
│   │   ├── commentController.js
│   │   ├── notificationController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/             # Express middleware
│   │   ├── asyncHandler.js
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   ├── protect.js
│   │   └── validate.js
│   ├── models/                 # Mongoose models
│   │   ├── Board.js
│   │   ├── Comment.js
│   │   ├── Notification.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   ├── User.js
│   │   └── index.js
│   ├── routes/                 # API routes
│   │   ├── authRoutes.js
│   │   ├── boardRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── utils/                  # Utilities
│   │   ├── generateToken.js
│   │   └── response.js
│   └── server.js               # Entry point
├── src/                        # Frontend
│   ├── components/             # React components
│   │   ├── CreateBoardModal.tsx
│   │   ├── CreateProjectModal.tsx
│   │   ├── CreateTaskModal.tsx
│   │   ├── InviteMemberModal.tsx
│   │   ├── KanbanBoard.tsx
│   │   ├── Layout.tsx
│   │   ├── PrivateRoute.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── TaskCard.tsx
│   │   └── TaskModal.tsx
│   ├── context/                # React context
│   │   └── AuthContext.tsx
│   ├── hooks/                  # Custom hooks
│   │   ├── useBoards.ts
│   │   ├── useNotifications.ts
│   │   ├── useProjects.ts
│   │   └── useTasks.ts
│   ├── pages/                  # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ProjectDetailPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   └── RegisterPage.tsx
│   ├── services/               # API services
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── boardService.ts
│   │   ├── commentService.ts
│   │   ├── notificationService.ts
│   │   ├── projectService.ts
│   │   ├── taskService.ts
│   │   └── userService.ts
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/codealpha_pm
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
```

3. Start the backend server:
```bash
npm run server
# or with nodemon
npm run server:dev
```

4. Start the frontend development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Projects
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/invite` - Invite member
- `DELETE /api/projects/:id/members/:userId` - Remove member
- `PUT /api/projects/:id/members/:userId/role` - Update member role

### Boards
- `GET /api/boards/project/:projectId` - Get project boards
- `POST /api/boards` - Create board
- `GET /api/boards/:id` - Get single board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Tasks
- `GET /api/tasks/board/:boardId` - Get board tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PUT /api/tasks/:id/move` - Move task to column

### Comments
- `GET /api/comments/task/:taskId` - Get task comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/read-all` - Mark all as read
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

### Users
- `GET /api/users` - Get all users
- `GET /api/users/search?q=query` - Search users
- `GET /api/users/:id` - Get user by ID

## Response Format

All API responses follow this structure:
```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run server` | Start Express server |
| `npm run server:dev` | Start Express with nodemon |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |

## Security

- JWT authentication with Bearer tokens
- bcryptjs password hashing
- Helmet for HTTP security headers
- CORS enabled
- Input validation with express-validator
- Route protection middleware

## License

MIT
