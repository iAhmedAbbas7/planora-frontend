// <== IMPORTS ==>
import type {
  DashboardData,
  TaskStats,
  ProjectStats,
  MonthlySummary,
  WeeklySummary,
  Project,
  Task,
} from "../hooks/useDashboard";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// <== DASHBOARD STORE INTERFACE ==>
type DashboardState = {
  // <== DASHBOARD DATA ==>
  dashboardData: DashboardData | null;
  // <== SET DASHBOARD DATA ACTION ==>
  setDashboardData: (data: DashboardData) => void;
  // <== CLEAR DASHBOARD DATA ACTION ==>
  clearDashboardData: () => void;
  // <== GET TASK STATS ==>
  getTaskStats: () => TaskStats | null;
  // <== GET PROJECT STATS ==>
  getProjectStats: () => ProjectStats | null;
  // <== GET MONTHLY SUMMARY ==>
  getMonthlySummary: () => MonthlySummary[] | null;
  // <== GET WEEKLY SUMMARY ==>
  getWeeklySummary: () => WeeklySummary | null;
  // <== GET RECENT PROJECTS ==>
  getRecentProjects: () => Project[] | null;
  // <== GET RECENT TASKS ==>
  getRecentTasks: () => Task[] | null;
};

// <== DASHBOARD STORE ==>
export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      // <== INITIAL STATE ==>
      dashboardData: null,
      // <== SET DASHBOARD DATA ACTION ==>
      setDashboardData: (data) =>
        set({
          dashboardData: data,
        }),
      // <== CLEAR DASHBOARD DATA ACTION ==>
      clearDashboardData: () =>
        set({
          dashboardData: null,
        }),
      // <== GET TASK STATS ==>
      getTaskStats: () => {
        const state = get();
        return state.dashboardData?.taskStats || null;
      },
      // <== GET PROJECT STATS ==>
      getProjectStats: () => {
        const state = get();
        return state.dashboardData?.projectStats || null;
      },
      // <== GET MONTHLY SUMMARY ==>
      getMonthlySummary: () => {
        const state = get();
        return state.dashboardData?.monthlySummary || null;
      },
      // <== GET WEEKLY SUMMARY ==>
      getWeeklySummary: () => {
        const state = get();
        return state.dashboardData?.weeklySummary || null;
      },
      // <== GET RECENT PROJECTS ==>
      getRecentProjects: () => {
        const state = get();
        return state.dashboardData?.recentProjects || null;
      },
      // <== GET RECENT TASKS ==>
      getRecentTasks: () => {
        const state = get();
        return state.dashboardData?.recentTasks || null;
      },
    }),
    {
      // <== PERSISTENCE CONFIG ==>
      name: "dashboard-storage",
      // <== PARTIALIZE STATE ==>
      partialize: (state) => ({
        // <== DASHBOARD DATA ==>
        dashboardData: state.dashboardData,
      }),
    }
  )
);
