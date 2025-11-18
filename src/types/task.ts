// <== TASK TYPE INTERFACE ==>
export type Task = {
  // <== TASK ID ==>
  _id: string;
  // <== TASK TITLE ==>
  title: string;
  // <== TASK DESCRIPTION ==>
  description?: string;
  // <== TASK DUE DATE ==>
  dueDate?: number;
  // <== TASK PRIORITY ==>
  priority?: string;
  // <== TASK IS TRASHED ==>
  isTrashed?: boolean;
  // <== TASK STATUS ==>
  status: "to do" | "in progress" | "completed";
  // <== TASK PROJECT ID ==>
  projectId?: string;
  // <== TASK USER ID ==>
  userId?: string;
  // <== TASK COMPLETED AT ==>
  completedAt?: Date;
};
