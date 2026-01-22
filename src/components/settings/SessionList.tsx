// <== IMPORTS ==>
import {
  useGetSessions,
  useRevokeSession,
  useRevokeAllOtherSessions,
  useTrustDevice,
  useUntrustDevice,
} from "../../hooks/useSessions";
import { useState } from "react";
import { JSX, useMemo } from "react";
import SessionCard from "./SessionCard";
import { Monitor, LogOut } from "lucide-react";
import ConfirmationModal from "../common/ConfirmationModal";

// <== HELPER TO GET SESSION ID FROM COOKIE ==>
const getSessionIdFromCookie = (): string | null => {
  // GET COOKIES
  const cookies = document.cookie.split(";");
  // LOOP THROUGH COOKIES
  for (const cookie of cookies) {
    // SPLIT COOKIE INTO NAME AND VALUE
    const [name, value] = cookie.trim().split("=");
    // IF NAME IS SESSION ID, RETURN VALUE
    if (name === "sessionId") {
      // DECODE VALUE
      return decodeURIComponent(value);
    }
  }
  // IF NO SESSION ID FOUND, RETURN NULL
  return null;
};

// <== SESSION LIST COMPONENT ==>
const SessionList = (): JSX.Element => {
  // GET SESSIONS
  const { data: sessions, isLoading, refetch } = useGetSessions();
  // GET CURRENT SESSION ID FROM COOKIE
  const currentSessionId = useMemo(() => getSessionIdFromCookie(), []);
  // REVOKE SESSION MUTATION
  const revokeSessionMutation = useRevokeSession();
  // REVOKE ALL OTHER SESSIONS MUTATION
  const revokeAllOtherSessionsMutation = useRevokeAllOtherSessions();
  // TRUST DEVICE MUTATION
  const trustDeviceMutation = useTrustDevice();
  // UNTRUST DEVICE MUTATION
  const untrustDeviceMutation = useUntrustDevice();
  // MODAL STATE
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "revoke-all" | "revoke-single";
    sessionId?: string;
  }>({
    isOpen: false,
    type: "revoke-all",
  });
  // HANDLE REVOKE SESSION
  const handleRevokeSession = (sessionId: string): void => {
    // SET MODAL STATE TO OPEN
    setModalState({
      isOpen: true,
      type: "revoke-single",
      sessionId,
    });
  };
  // HANDLE REVOKE ALL OTHER SESSIONS
  const handleRevokeAllOtherSessions = (): void => {
    // SET MODAL STATE TO OPEN
    setModalState({
      isOpen: true,
      type: "revoke-all",
    });
  };
  // HANDLE CONFIRM REVOKE
  const handleConfirmRevoke = (): void => {
    // IF REVOKE ALL OTHER SESSIONS
    if (modalState.type === "revoke-all") {
      revokeAllOtherSessionsMutation.mutate(
        {},
        {
          // ON SUCCESS, REFRESH SESSIONS
          onSuccess: () => {
            // CLOSE MODAL
            setModalState({ isOpen: false, type: "revoke-all" });
            // REFRESH SESSIONS
            refetch();
          },
        }
      );
    } else if (modalState.sessionId) {
      // CALL REVOKE SESSION MUTATION
      revokeSessionMutation.mutate(modalState.sessionId, {
        // ON SUCCESS, REFRESH SESSIONS
        onSuccess: () => {
          // CLOSE MODAL
          setModalState({ isOpen: false, type: "revoke-single" });
          // REFRESH SESSIONS
          refetch();
        },
      });
    }
  };
  // HANDLE TRUST DEVICE
  const handleTrustDevice = (sessionId: string): void => {
    // CALL TRUST DEVICE MUTATION
    trustDeviceMutation.mutate(sessionId, {
      // ON SUCCESS, REFRESH SESSIONS
      onSuccess: () => {
        // REFRESH SESSIONS
        refetch();
      },
    });
  };
  // HANDLE UNTRUST DEVICE
  const handleUntrustDevice = (sessionId: string): void => {
    // CALL UNTRUST DEVICE MUTATION
    untrustDeviceMutation.mutate(sessionId, {
      // ON SUCCESS, REFRESH SESSIONS
      onSuccess: () => {
        // REFRESH SESSIONS
        refetch();
      },
    });
  };
  // IF LOADING
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
        <div className="h-32 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
      </div>
    );
  }
  // IF NO SESSIONS
  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <Monitor className="mx-auto text-[var(--light-text)]" size={48} />
        <p className="mt-4 text-[var(--light-text)]">
          No active sessions found.
        </p>
      </div>
    );
  }
  // GET CURRENT SESSION (BASED ON SESSION ID COOKIE, NOT SERVER FLAG)
  const currentSession = sessions.find((s) => s.sessionId === currentSessionId);
  // GET OTHER SESSIONS
  const otherSessions = sessions.filter((s) => s.sessionId !== currentSessionId);
  // RETURN LIST
  return (
    <div className="space-y-6">
      {/* HEADER WITH ACTION BUTTON */}
      {otherSessions.length > 0 && (
        <div className="flex items-center justify-end mb-4">
          <button
            onClick={handleRevokeAllOtherSessions}
            disabled={revokeAllOtherSessionsMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-[var(--hover-bg)] rounded-lg transition disabled:opacity-50"
          >
            <LogOut size={16} />
            Revoke All Others
          </button>
        </div>
      )}
      {/* CURRENT SESSION (THIS DEVICE) */}
      {currentSession && (
        <div>
          <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
            This Device
          </h4>
          <SessionCard
            session={currentSession}
            isCurrentSession={true}
            onRevoke={handleRevokeSession}
            onTrust={handleTrustDevice}
            onUntrust={handleUntrustDevice}
            isRevoking={revokeSessionMutation.isPending}
            isTrusting={
              trustDeviceMutation.isPending || untrustDeviceMutation.isPending
            }
          />
        </div>
      )}
      {/* OTHER SESSIONS (OTHER DEVICES) */}
      {otherSessions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
            Other Devices ({otherSessions.length})
          </h4>
          <div className="space-y-3">
            {otherSessions.map((session) => (
              <SessionCard
                key={session.sessionId}
                session={session}
                isCurrentSession={false}
                onRevoke={handleRevokeSession}
                onTrust={handleTrustDevice}
                onUntrust={handleUntrustDevice}
                isRevoking={revokeSessionMutation.isPending}
                isTrusting={
                  trustDeviceMutation.isPending ||
                  untrustDeviceMutation.isPending
                }
              />
            ))}
          </div>
        </div>
      )}
      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: "revoke-all" })}
        onConfirm={handleConfirmRevoke}
        title={
          modalState.type === "revoke-all"
            ? "Revoke All Other Sessions?"
            : "Revoke Session?"
        }
        message={
          modalState.type === "revoke-all"
            ? "This will sign you out from all other devices. You will remain signed in on this device."
            : "This will sign you out from this device. Are you sure you want to continue?"
        }
        type="warning"
        confirmText="Revoke"
        cancelText="Cancel"
        showCancel={true}
      />
    </div>
  );
};

export default SessionList;
