// <== IMPORTS ==>
import {
  MapPin,
  Clock,
  AlertTriangle,
  Trash2,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { JSX } from "react";
import { formatDistanceToNow } from "date-fns";
import { Session } from "../../hooks/useSessions";

// <== SESSION CARD PROPS ==>
type SessionCardProps = {
  // <== SESSION ==>
  session: Session;
  // <== ON REVOKE ==>
  onRevoke: (sessionId: string) => void;
  // <== ON TRUST ==>
  onTrust: (sessionId: string) => void;
  // <== ON UNTRUST ==>
  onUntrust: (sessionId: string) => void;
  // <== IS REVOKING ==>
  isRevoking?: boolean;
  // <== IS TRUSTING ==>
  isTrusting?: boolean;
};

// <== SESSION CARD COMPONENT ==>
const SessionCard = ({
  session,
  onRevoke,
  onTrust,
  onUntrust,
  isRevoking = false,
  isTrusting = false,
}: SessionCardProps): JSX.Element => {
  // FORMAT LAST ACTIVITY
  const lastActivity = formatDistanceToNow(new Date(session.lastActivity), {
    addSuffix: true,
  });
  // GET DEVICE ICON
  const getDeviceIcon = () => {
    switch (session.deviceType) {
      case "mobile":
        return "📱";
      case "tablet":
        return "📱";
      case "desktop":
        return "💻";
      default:
        return "🖥️";
    }
  };
  // RETURN CARD
  return (
    <div
      className={`p-4 rounded-lg border ${
        session.isCurrent
          ? "border-[var(--accent-color)] bg-[var(--inside-card-bg)]"
          : "border-[var(--border)] bg-[var(--inside-card-bg)]"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getDeviceIcon()}</div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[var(--text-primary)]">
                {session.deviceName || "Unknown Device"}
              </h3>
              {session.isCurrent && (
                <span
                  className="px-2 py-0.5 text-xs font-medium text-white rounded"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  Current
                </span>
              )}
              {session.isTrusted && (
                <span className="px-2 py-0.5 text-xs font-medium bg-green-500 text-white rounded flex items-center gap-1">
                  <ShieldCheck size={12} />
                  Trusted
                </span>
              )}
              {session.isSuspicious && (
                <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Suspicious
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--light-text)]">
              {session.browserName} {session.browserVersion} •{" "}
              {session.operatingSystem}
            </p>
          </div>
        </div>
        {!session.isCurrent && (
          <button
            onClick={() => onRevoke(session.sessionId)}
            disabled={isRevoking}
            className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-red-500 transition disabled:opacity-50"
            title="Revoke Session"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
      {/* DETAILS */}
      <div className="space-y-2 text-sm text-[var(--light-text)]">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-[var(--light-text)]" />
          <span>
            {session.locationCity}, {session.locationRegion},{" "}
            {session.locationCountry}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-[var(--light-text)]" />
          <span>Last active {lastActivity}</span>
        </div>
        {session.isSuspicious && session.suspiciousReason && (
          <div className="mt-2 p-2 bg-[var(--inside-card-bg)] border border-red-500/30 rounded text-xs text-red-500 dark:text-red-400">
            <strong>Warning:</strong> {session.suspiciousReason}
          </div>
        )}
      </div>
      {/* ACTIONS */}
      {!session.isCurrent && (
        <div className="mt-3 pt-3 border-t border-[var(--border)] flex gap-2">
          {session.isTrusted ? (
            <button
              onClick={() => onUntrust(session.sessionId)}
              disabled={isTrusting}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-orange-500 dark:text-orange-400 hover:bg-[var(--hover-bg)] rounded transition disabled:opacity-50"
            >
              <ShieldX size={16} />
              Remove Trust
            </button>
          ) : (
            <button
              onClick={() => onTrust(session.sessionId)}
              disabled={isTrusting}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-green-500 dark:text-green-400 hover:bg-[var(--hover-bg)] rounded transition disabled:opacity-50"
            >
              <ShieldCheck size={16} />
              Trust Device
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionCard;
