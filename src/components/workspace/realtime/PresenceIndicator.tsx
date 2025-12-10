// <== IMPORTS ==>
import { JSX } from "react";
import { Users, Circle, Clock, Coffee } from "lucide-react";
import { PresenceMember } from "../../../hooks/useWorkspaceSocket";

// <== PRESENCE INDICATOR PROPS ==>
interface PresenceIndicatorProps {
  // <== PRESENCE MEMBERS ==>
  presence: PresenceMember[];
  // <== IS CONNECTED ==>
  isConnected: boolean;
  // <== COMPACT MODE ==>
  compact?: boolean;
  // <== MAX VISIBLE ==>
  maxVisible?: number;
}

// <== STATUS ICON COMPONENT ==>
const StatusIcon = ({
  status,
}: {
  status: "online" | "away" | "busy";
}): JSX.Element => {
  // GET STATUS COLOR
  const statusColors = {
    online: "text-green-500",
    away: "text-yellow-500",
    busy: "text-red-500",
  };
  // GET STATUS ICON
  const statusIcons = {
    online: Circle,
    away: Clock,
    busy: Coffee,
  };
  // GET ICON COMPONENT
  const Icon = statusIcons[status];
  // RETURN STATUS ICON
  return <Icon size={8} className={`${statusColors[status]} fill-current`} />;
};

// <== MEMBER AVATAR COMPONENT ==>
const MemberAvatar = ({
  member,
  showStatus = true,
}: {
  member: PresenceMember;
  showStatus?: boolean;
}): JSX.Element => {
  // RETURN MEMBER AVATAR
  return (
    <div className="relative group">
      {/* AVATAR */}
      {member.userAvatar ? (
        <img
          src={member.userAvatar}
          alt={member.userName}
          className="w-8 h-8 rounded-full border-2 border-[var(--bg)] object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full border-2 border-[var(--bg)] bg-[var(--accent-color)]/10 flex items-center justify-center">
          <span className="text-xs font-semibold text-[var(--accent-color)]">
            {member.userName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      {/* STATUS INDICATOR */}
      {showStatus && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--bg)] flex items-center justify-center">
          <StatusIcon status={member.status} />
        </div>
      )}
      {/* TOOLTIP */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        <p className="text-xs font-medium text-[var(--primary-text)]">
          {member.userName}
        </p>
        {member.currentTask && (
          <p className="text-[10px] text-[var(--light-text)] mt-0.5">
            Working on: {member.currentTask}
          </p>
        )}
        <p className="text-[10px] text-[var(--light-text)] capitalize mt-0.5">
          {member.status}
        </p>
      </div>
    </div>
  );
};

// <== PRESENCE INDICATOR COMPONENT ==>
const PresenceIndicator = ({
  presence,
  isConnected,
  compact = false,
  maxVisible = 5,
}: PresenceIndicatorProps): JSX.Element => {
  // GET VISIBLE AND EXTRA COUNT
  const visibleMembers = presence.slice(0, maxVisible);
  // GET EXTRA COUNT
  const extraCount = Math.max(0, presence.length - maxVisible);
  // GET ONLINE COUNT
  const onlineCount = presence.filter((m) => m.status === "online").length;
  // COMPACT VIEW
  if (compact) {
    // RETURN COMPACT VIEW
    return (
      <div className="flex items-center gap-2">
        {/* CONNECTION STATUS */}
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        {/* ONLINE COUNT */}
        <span className="text-xs text-[var(--light-text)]">
          {onlineCount} online
        </span>
        {/* AVATAR STACK */}
        {presence.length > 0 && (
          <div className="flex -space-x-2">
            {visibleMembers.map((member) => (
              <MemberAvatar
                key={member.userId}
                member={member}
                showStatus={false}
              />
            ))}
            {extraCount > 0 && (
              <div className="w-8 h-8 rounded-full border-2 border-[var(--bg)] bg-[var(--hover-bg)] flex items-center justify-center">
                <span className="text-xs font-medium text-[var(--light-text)]">
                  +{extraCount}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  // FULL VIEW
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-[var(--accent-color)]" />
          <h3 className="text-sm font-semibold text-[var(--primary-text)]">
            Team Presence
          </h3>
        </div>
        {/* CONNECTION STATUS */}
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-[var(--light-text)]">
            {isConnected ? "Live" : "Offline"}
          </span>
        </div>
      </div>
      {/* NO MEMBERS */}
      {presence.length === 0 ? (
        <p className="text-sm text-[var(--light-text)] text-center py-4">
          {isConnected ? "No team members online" : "Connecting..."}
        </p>
      ) : (
        <>
          {/* STATS */}
          <div className="flex items-center gap-4 mb-3 pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-1.5">
              <Circle size={10} className="text-green-500 fill-green-500" />
              <span className="text-xs text-[var(--light-text)]">
                {presence.filter((m) => m.status === "online").length} online
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={10} className="text-yellow-500" />
              <span className="text-xs text-[var(--light-text)]">
                {presence.filter((m) => m.status === "away").length} away
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Coffee size={10} className="text-red-500" />
              <span className="text-xs text-[var(--light-text)]">
                {presence.filter((m) => m.status === "busy").length} busy
              </span>
            </div>
          </div>
          {/* MEMBER LIST */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {presence.map((member) => (
              <div
                key={member.userId}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
              >
                {/* AVATAR */}
                <div className="relative">
                  {member.userAvatar ? (
                    <img
                      src={member.userAvatar}
                      alt={member.userName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-[var(--accent-color)]">
                        {member.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {/* STATUS DOT */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--cards-bg)] flex items-center justify-center">
                    <StatusIcon status={member.status} />
                  </div>
                </div>
                {/* INFO */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--primary-text)] truncate">
                    {member.userName}
                  </p>
                  {member.currentTask ? (
                    <p className="text-xs text-[var(--light-text)] truncate">
                      {member.currentTask}
                    </p>
                  ) : (
                    <p className="text-xs text-[var(--light-text)] capitalize">
                      {member.status}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PresenceIndicator;
