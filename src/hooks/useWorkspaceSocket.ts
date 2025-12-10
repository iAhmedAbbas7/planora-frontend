// <== IMPORTS ==>
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState, useCallback, useRef } from "react";

// <== SOCKET URL ==>
const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace("/api/v1", "") ||
  "http://localhost:7000";

// <== PRESENCE MEMBER TYPE ==>
export type PresenceMember = {
  // <== USER ID ==>
  userId: string;
  // <== SOCKET ID ==>
  socketId: string;
  // <== USER NAME ==>
  userName: string;
  // <== USER AVATAR ==>
  userAvatar?: string;
  // <== STATUS ==>
  status: "online" | "away" | "busy";
  // <== CURRENT TASK ==>
  currentTask?: string;
  // <== JOINED AT ==>
  joinedAt: string;
};
// <== ACTIVITY TYPE ==>
export type WorkspaceActivity = {
  // <== ID ==>
  id: string;
  // <== TYPE ==>
  type:
    | "member_joined"
    | "member_left"
    | "task_updated"
    | "repo_activity"
    | "message";
  // <== USER ID ==>
  userId: string;
  // <== USER NAME ==>
  userName: string;
  // <== USER AVATAR ==>
  userAvatar?: string;
  // <== DATA ==>
  data: Record<string, unknown>;
  // <== TIMESTAMP ==>
  timestamp: string;
};
// <== TASK UPDATE TYPE ==>
export type TaskUpdate = {
  // <== WORKSPACE ID ==>
  workspaceId: string;
  // <== TASK ID ==>
  taskId: string;
  // <== CHANGES ==>
  changes: Record<string, unknown>;
  // <== USER ID ==>
  userId: string;
  // <== USER NAME ==>
  userName: string;
  // <== USER AVATAR ==>
  userAvatar?: string;
};

// <== SOCKET SINGLETON ==>
let socketInstance: Socket | null = null;

// <== GET SOCKET INSTANCE ==>
const getSocket = (): Socket => {
  // IF SOCKET DOESN'T EXIST, CREATE IT
  if (!socketInstance) {
    // CREATE SOCKET INSTANCE
    socketInstance = io(SOCKET_URL, {
      // AUTO CONNECT FALSE (WE CONNECT MANUALLY)
      autoConnect: false,
      // RECONNECTION SETTINGS
      reconnection: true,
      // RECONNECTION ATTEMPTS
      reconnectionAttempts: 5,
      // RECONNECTION DELAY
      reconnectionDelay: 1000,
      // RECONNECTION DELAY MAX
      reconnectionDelayMax: 5000,
      // TRANSPORTS (WEBSOCKET AND POLLING)
      transports: ["websocket", "polling"],
    });
  }
  // RETURN SOCKET INSTANCE
  return socketInstance;
};

// <== USE SOCKET CONNECTION HOOK ==>
export const useSocketConnection = () => {
  // STATE
  const [isConnected, setIsConnected] = useState(false);
  // GET AUTH STATE
  const { user, isAuthenticated } = useAuthStore();
  // SOCKET REF
  const socket = getSocket();
  // EFFECT: CONNECT SOCKET
  useEffect(() => {
    // IF NOT AUTHENTICATED OR NO USER, RETURN
    if (!isAuthenticated || !user || !user.id) return;
    // ON CONNECT HANDLER
    const onConnect = () => {
      // SET CONNECTED
      setIsConnected(true);
      // JOIN USER ROOM FOR NOTIFICATIONS
      socket.emit("join-user-room", user.id);
      // LOG
      console.log("🟢 Socket Connected For User:", user.id);
    };
    // ON DISCONNECTION HANDLER
    const onDisconnect = () => {
      // SET DISCONNECTED
      setIsConnected(false);
      // LOG
      console.log("🔴 Socket Disconnected");
    };
    // ON ERROR HANDLER
    const onError = (error: Error) => {
      // LOG
      console.error("Socket Error:", error);
    };
    // CONNECT SOCKET EVENT LISTENER
    socket.on("connect", onConnect);
    // DISCONNECT SOCKET EVENT LISTENER
    socket.on("disconnect", onDisconnect);
    // CONNECT ERROR SOCKET EVENT LISTENER
    socket.on("connect_error", onError);
    // IF SOCKET IS NOT CONNECTED, CONNECT IT
    if (!socket.connected) {
      // CONNECT SOCKET
      socket.connect();
    } else {
      // IF SOCKET IS CONNECTED, SET CONNECTED STATE TO TRUE
      setIsConnected(true);
    }
    // CLEANUP: REMOVE EVENT LISTENERS
    return () => {
      // REMOVE CONNECT SOCKET EVENT LISTENER
      socket.off("connect", onConnect);
      // REMOVE DISCONNECT SOCKET EVENT LISTENER
      socket.off("disconnect", onDisconnect);
      // REMOVE CONNECT ERROR SOCKET EVENT LISTENER
      socket.off("connect_error", onError);
    };
  }, [isAuthenticated, user, socket]);
  // RETURN SOCKET AND CONNECTED STATE
  return { socket, isConnected };
};

// <== USE WORKSPACE SOCKET HOOK ==>
export const useWorkspaceSocket = (workspaceId: string | null) => {
  // WORKSPACE PRESENCE STATE
  const [presence, setPresence] = useState<PresenceMember[]>([]);
  // WORKSPACE ACTIVITIES STATE
  const [activities, setActivities] = useState<WorkspaceActivity[]>([]);
  // IS JOINED WORKSPACE STATE
  const [isJoined, setIsJoined] = useState(false);
  // GET USER AND AUTHENTICATED STATE
  const { user, isAuthenticated } = useAuthStore();
  // GET SOCKET AND CONNECTED STATE
  const { socket, isConnected } = useSocketConnection();
  // JOINED WORKSPACE REF (TO AVOID DUPLICATE JOIN EVENTS)
  const joinedWorkspaceRef = useRef<string | null>(null);
  // JOIN WORKSPACE
  const joinWorkspace = useCallback(() => {
    // IF NO WORKSPACE ID, USER, OR NOT CONNECTED, RETURN
    if (!workspaceId || !user || !user.id || !isConnected) return;
    // IF ALREADY JOINED THIS WORKSPACE, DON'T JOIN AGAIN
    if (joinedWorkspaceRef.current === workspaceId) return;
    // EMIT JOIN WORKSPACE EVENT
    socket.emit("workspace:join", {
      workspaceId,
      userId: user.id,
      userName: user.name || "Team Member",
      userAvatar: undefined,
    });
    // SET JOINED WORKSPACE REF
    joinedWorkspaceRef.current = workspaceId;
    // SET JOINED STATE
    setIsJoined(true);
    // GET CURRENT WORKSPACE STATE
    socket.emit(
      "workspace:getState",
      { workspaceId },
      (response: {
        presence: PresenceMember[];
        activities: WorkspaceActivity[];
      }) => {
        // SET WORKSPACE PRESENCE
        setPresence(response.presence);
        // SET WORKSPACE ACTIVITIES
        setActivities(response.activities);
      }
    );
  }, [workspaceId, user, isConnected, socket]);
  // LEAVE WORKSPACE
  const leaveWorkspace = useCallback(() => {
    // IF NO JOINED WORKSPACE OR NO USER, RETURN
    if (!joinedWorkspaceRef.current || !user || !user.id) return;
    // EMIT LEAVE WORKSPACE EVENT
    socket.emit("workspace:leave", {
      workspaceId: joinedWorkspaceRef.current,
      userId: user.id,
    });
    // RESET JOINED WORKSPACE STATE
    setIsJoined(false);
    // RESET WORKSPACE PRESENCE
    setPresence([]);
    // RESET WORKSPACE ACTIVITIES
    setActivities([]);
    // RESET JOINED WORKSPACE REF
    joinedWorkspaceRef.current = null;
  }, [user, socket]);

  // UPDATE WORKSPACE STATUS
  const updateStatus = useCallback(
    (status: "online" | "away" | "busy", currentTask?: string) => {
      // IF NO WORKSPACE ID OR USER, RETURN
      if (!workspaceId || !user || !user.id) return;
      // EMIT WORKSPACE STATUS UPDATE
      socket.emit("presence:status", {
        workspaceId,
        userId: user.id,
        status,
        currentTask,
      });
    },
    [workspaceId, user, socket]
  );
  // SEND WORKSPACE MESSAGE
  const sendMessage = useCallback(
    (message: string) => {
      // IF NO WORKSPACE ID OR USER, RETURN
      if (!workspaceId || !user || !user.id) return;
      // EMIT WORKSPACE MESSAGE
      socket.emit("workspace:message", {
        workspaceId,
        userId: user.id,
        userName: user.name || "Team Member",
        userAvatar: undefined,
        message,
      });
    },
    [workspaceId, user, socket]
  );
  // EFFECT: JOIN WORKSPACE ON MOUNT
  useEffect(() => {
    // IF NOT AUTHENTICATED OR NO WORKSPACE ID, RETURN
    if (!isAuthenticated || !workspaceId || !isConnected) return;
    // JOIN WORKSPACE IF NOT ALREADY JOINED
    joinWorkspace();
    // CLEANUP: LEAVE WORKSPACE IF UNMOUNTED
    return () => {
      // LEAVE WORKSPACE IF UNMOUNTED
      leaveWorkspace();
    };
  }, [
    isAuthenticated,
    workspaceId,
    isConnected,
    joinWorkspace,
    leaveWorkspace,
  ]);
  // EFFECT: LISTEN FOR WORKSPACE EVENTS
  useEffect(() => {
    // IF NO WORKSPACE ID OR NOT CONNECTED, RETURN
    if (!workspaceId || !isConnected) return;
    // ON PRESENCE UPDATE HANDLER
    const onPresenceUpdate = (data: {
      workspaceId: string;
      members: PresenceMember[];
    }) => {
      // IF FOR THIS WORKSPACE, UPDATE PRESENCE
      if (data.workspaceId === workspaceId) {
        // UPDATE WORKSPACE PRESENCE
        setPresence(data.members);
      }
    };
    // ON ACTIVITY NEW HANDLER
    const onActivityNew = (data: {
      workspaceId: string;
      activity: WorkspaceActivity;
    }) => {
      // IF FOR THIS WORKSPACE, ADD ACTIVITY
      if (data.workspaceId === workspaceId) {
        // ADD ACTIVITY TO WORKSPACE ACTIVITIES
        setActivities((prev) => [data.activity, ...prev].slice(0, 50));
      }
    };
    // ON TASK UPDATE HANDLER
    const onTaskUpdated = (data: TaskUpdate) => {
      // IF FOR THIS WORKSPACE, LOG IT (CAN BE USED TO UPDATE LOCAL STATE)
      if (data.workspaceId === workspaceId) {
        // LOG TASK UPDATE (CAN BE USED TO UPDATE LOCAL STATE)
        console.log("Task Updated:", data);
      }
    };
    // ON PRESENCE UPDATE LISTENER
    socket.on("presence:update", onPresenceUpdate);
    // ON ACTIVITY NEW LISTENER
    socket.on("activity:new", onActivityNew);
    // ON TASK UPDATE LISTENER
    socket.on("task:updated", onTaskUpdated);
    // CLEANUP: REMOVE WORKSPACE EVENT LISTENERS
    return () => {
      // REMOVE PRESENCE UPDATE LISTENER
      socket.off("presence:update", onPresenceUpdate);
      // REMOVE ACTIVITY NEW LISTENER
      socket.off("activity:new", onActivityNew);
      // REMOVE TASK UPDATE LISTENER
      socket.off("task:updated", onTaskUpdated);
    };
  }, [workspaceId, isConnected, socket]);
  // RETURN WORKSPACE STATE AND METHODS
  return {
    presence,
    activities,
    isJoined,
    isConnected,
    updateStatus,
    sendMessage,
    joinWorkspace,
    leaveWorkspace,
  };
};

// <== USE NOTIFICATION SOCKET HOOK ==>
export const useNotificationSocket = () => {
  // STATE
  const [notifications, setNotifications] = useState<unknown[]>([]);
  // GET SOCKET
  const { socket, isConnected } = useSocketConnection();
  // EFFECT: LISTEN FOR NOTIFICATIONS
  useEffect(() => {
    // IF NOT CONNECTED, RETURN
    if (!isConnected) return;
    // ON NEW NOTIFICATION HANDLER
    const onNewNotification = (notification: unknown) => {
      // ADD NOTIFICATION
      setNotifications((prev) => [notification, ...prev]);
    };
    // ON NEW NOTIFICATION LISTENER
    socket.on("new-notification", onNewNotification);
    // CLEANUP
    return () => {
      // REMOVE NEW NOTIFICATION LISTENER
      socket.off("new-notification", onNewNotification);
    };
  }, [isConnected, socket]);
  // CLEAR NOTIFICATIONS
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  // RETURN NOTIFICATION STATE
  return {
    notifications,
    clearNotifications,
  };
};

export default useWorkspaceSocket;
