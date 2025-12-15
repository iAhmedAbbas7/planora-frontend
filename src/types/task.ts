// <== RECURRENCE PATTERN TYPE ==>
export type RecurrencePattern =
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";

// <== RECURRENCE TYPE INTERFACE ==>
export type Recurrence = {
  // <== IS RECURRING FLAG ==>
  isRecurring: boolean;
  // <== RECURRENCE PATTERN ==>
  pattern: RecurrencePattern | null;
  // <== INTERVAL (E.G., EVERY 2 DAYS) ==>
  interval: number;
  // <== DAYS OF WEEK (0-6, SUNDAY-SATURDAY) ==>
  daysOfWeek: number[];
  // <== DAY OF MONTH (1-31) ==>
  dayOfMonth: number | null;
  // <== END DATE ==>
  endDate: Date | null;
  // <== SKIP WEEKENDS FLAG ==>
  skipWeekends: boolean;
  // <== NEXT OCCURRENCE DATE ==>
  nextOccurrence: Date | null;
  // <== LAST GENERATED AT ==>
  lastGeneratedAt: Date | null;
  // <== ORIGINAL TASK ID ==>
  originalTaskId: string | null;
  // <== OCCURRENCE COUNT ==>
  occurrenceCount: number;
};

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
  // <== TASK RECURRENCE ==>
  recurrence?: Recurrence;
};
