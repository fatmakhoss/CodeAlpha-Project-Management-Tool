export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'host' | 'admin';
  createdAt?: string;
}

export interface ProjectMember {
  user: User;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: User;
  members: ProjectMember[];
  boards: Board[] | string[];
  color: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BoardColumn {
  name: string;
  order: number;
  color: string;
}

export interface Board {
  _id: string;
  name: string;
  description?: string;
  project: string | Project;
  columns: BoardColumn[];
  tasks: Task[] | string[];
  order: number;
  createdAt: string;
}

export interface TaskLabel {
  name: string;
  color: string;
}

export interface ActivityLog {
  action: string;
  performedBy: User;
  details: string;
  timestamp: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  board: string;
  project: string;
  column: string;
  assignees: User[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'done';
  dueDate?: string;
  labels: TaskLabel[];
  order: number;
  createdBy: User;
  comments: Comment[] | string[];
  attachments: any[];
  activityLog: ActivityLog[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  task: string;
  author: User;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender: User;
  type: string;
  title: string;
  message: string;
  project?: Project;
  task?: Task;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
