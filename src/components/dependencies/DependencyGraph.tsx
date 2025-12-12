// <== IMPORTS ==>
import {
  Network,
  LayoutGrid,
  RefreshCw,
  GitBranch,
  AlertTriangle,
  Map,
} from "lucide-react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
  Panel,
  MiniMap,
  Node,
  NodeProps,
} from "@xyflow/react";
import TaskNode from "./TaskNode";
import "@xyflow/react/dist/style.css";
import { useDependencyGraph } from "../../hooks/useDependencies";
import React, { useCallback, useMemo, useState, useEffect } from "react";

// <== TASK NODE DATA INTERFACE ==>
interface TaskNodeData extends Record<string, unknown> {
  // <== LABEL ==>
  label: string;
  // <== TASK KEY ==>
  taskKey: string;
  // <== STATUS ==>
  status: string;
  // <== PRIORITY ==>
  priority: string;
  // <== IS BLOCKED ==>
  isBlocked: boolean;
  // <== HAS SUBTASKS ==>
  hasSubtasks: boolean;
  // <== IS SUBTASK ==>
  isSubtask: boolean;
}

// <== CUSTOM NODE TYPE ==>
type TaskNodeType = Node<TaskNodeData, "taskNode">;

// <== CUSTOM EDGE DATA ==>
interface EdgeData extends Record<string, unknown> {
  // <== TYPE ==>
  type?: "blocks" | "relates_to" | "subtask";
}

// <== CUSTOM EDGE TYPE ==>
type TaskEdgeType = Edge<EdgeData>;

// <== CUSTOM NODE TYPES ==>
const nodeTypes: Record<
  string,
  React.ComponentType<NodeProps<TaskNodeType>>
> = {
  // <== TASK NODE ==>
  taskNode: TaskNode as React.ComponentType<NodeProps<TaskNodeType>>,
};

// <== DEPENDENCY GRAPH PROPS ==>
interface DependencyGraphProps {
  // <== PROJECT ID ==>
  projectId?: string;
  // <== ON NODE CLICK ==>
  onNodeClick?: (taskId: string) => void;
}

// <== GRAPH SKELETON COMPONENT ==>
const GraphSkeleton = () => (
  <div className="h-[500px] p-4 sm:p-6 flex flex-col">
    {/* FULL HEIGHT GRID OF SKELETON NODES */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 flex-1 content-start auto-rows-min">
      {/* GENERATE 16 SKELETON NODES */}
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className={`${i >= 8 ? "hidden sm:block" : ""} ${
            i >= 12 ? "hidden md:block" : ""
          }`}
        >
          <div className="bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)] p-3 animate-pulse">
            {/* TOP ROW - TASK KEY AND INDICATOR */}
            <div className="flex items-center justify-between mb-2">
              <div className="h-3 w-14 bg-[var(--hover-bg)] rounded" />
              <div className="h-3 w-3 bg-[var(--hover-bg)] rounded" />
            </div>
            {/* TITLE */}
            <div className="h-3 w-full bg-[var(--hover-bg)] rounded mb-2" />
            {/* BOTTOM ROW - STATUS AND PRIORITY */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 bg-[var(--hover-bg)] rounded-full" />
                <div className="h-2 w-10 bg-[var(--hover-bg)] rounded" />
              </div>
              <div className="h-4 w-10 bg-[var(--hover-bg)] rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// <== DEPENDENCY GRAPH COMPONENT ==>
const DependencyGraph = ({ projectId, onNodeClick }: DependencyGraphProps) => {
  // NODES STATE
  const [nodes, setNodes, onNodesChange] = useNodesState<TaskNodeType>([]);
  // EDGES STATE
  const [edges, setEdges, onEdgesChange] = useEdgesState<TaskEdgeType>([]);
  // SHOW MINIMAP STATE
  const [showMinimap, setShowMinimap] = useState(false);
  // FETCH DEPENDENCY GRAPH DATA
  const { data, isLoading, isError, refetch, isFetching } =
    useDependencyGraph(projectId);
  // UPDATE NODES AND EDGES WHEN DATA CHANGES
  useEffect(() => {
    // IF DATA IS LOADED, UPDATE NODES AND EDGES
    if (data?.nodes && data?.edges) {
      // AUTO-LAYOUT NODES IN A GRID PATTERN
      const layoutedNodes: TaskNodeType[] = data.nodes.map((node, index) => ({
        ...node,
        type: "taskNode" as const,
        position: {
          x: (index % 4) * 250 + 50,
          y: Math.floor(index / 4) * 150 + 50,
        },
        data: node.data as TaskNodeData,
      }));
      // UPDATE NODES
      setNodes(layoutedNodes);
      // UPDATE EDGES
      setEdges(data.edges as TaskEdgeType[]);
    }
  }, [data, setNodes, setEdges]);
  // HANDLE CONNECTION
  const onConnect = useCallback(
    // SET EDGES
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  // HANDLE NODE CLICK
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: TaskNodeType) => {
      // IF ON NODE CLICK FUNCTION IS PROVIDED, CALL IT
      if (onNodeClick) {
        // CALL ON NODE CLICK FUNCTION
        onNodeClick(node.id);
      }
    },
    [onNodeClick]
  );
  // AUTO LAYOUT FUNCTION
  const autoLayout = useCallback(() => {
    // LAYOUT NODES IN A GRID PATTERN
    const layoutedNodes: TaskNodeType[] = nodes.map((node, index) => ({
      ...node,
      position: {
        x: (index % 4) * 250 + 50,
        y: Math.floor(index / 4) * 150 + 50,
      },
    }));
    // UPDATE NODES
    setNodes(layoutedNodes);
  }, [nodes, setNodes]);
  // STATS
  const stats = useMemo(() => {
    // BLOCKED COUNT
    const blockedCount = nodes.filter((n) => n.data?.isBlocked).length;
    // BLOCKING EDGES
    const blockingEdges = edges.filter((e) => e.data?.type === "blocks").length;
    // RELATED EDGES
    const relatedEdges = edges.filter(
      (e) => e.data?.type === "relates_to"
    ).length;
    // SUBTASK EDGES
    const subtaskEdges = edges.filter((e) => e.data?.type === "subtask").length;
    // RETURN STATS
    return { blockedCount, blockingEdges, relatedEdges, subtaskEdges };
  }, [nodes, edges]);
  // ERROR STATE
  if (isError) {
    // RETURN ERROR STATE
    return (
      <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="flex flex-col items-center justify-center h-[500px]">
          <AlertTriangle className="w-8 h-8 text-red-500 mb-3" />
          <p className="text-[var(--text-primary)] font-medium mb-1">
            Failed to load dependency graph
          </p>
          <p className="text-[var(--light-text)] text-sm mb-4">
            Please try refreshing the page
          </p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:opacity-90 transition"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }
  // EMPTY STATE
  if (!isLoading && !isFetching && !data?.nodes?.length) {
    // RETURN EMPTY STATE
    return (
      <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="flex flex-col items-center justify-center h-[500px]">
          <Network className="w-12 h-12 text-[var(--light-text)] mb-4" />
          <p className="text-[var(--text-primary)] font-medium mb-1">
            No dependencies found
          </p>
          <p className="text-[var(--light-text)] text-sm text-center max-w-[300px]">
            Add dependencies between tasks to visualize their relationships in
            this graph
          </p>
        </div>
      </div>
    );
  }
  // RETURN DEPENDENCY GRAPH
  return (
    <div className="bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
      {/* HEADER BAR */}
      <div className="flex flex-col gap-2 p-3 border-b border-[var(--border)]">
        {/* TOP ROW - TITLE */}
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-[var(--accent-color)]" />
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Dependency Graph
          </span>
          <span className="text-xs text-[var(--light-text)]">
            ({data?.taskCount || 0} tasks)
          </span>
        </div>
        {/* BOTTOM ROW - STATS (SCROLLABLE ON MOBILE) */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <div className="w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
            <span className="text-[var(--light-text)]">
              Blocked: {stats.blockedCount}
            </span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <div className="w-3 h-0.5 bg-red-500 shrink-0"></div>
            <span className="text-[var(--light-text)]">
              Blocks: {stats.blockingEdges}
            </span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <div className="w-3 h-0.5 bg-gray-500 border-t border-dashed border-gray-500 shrink-0"></div>
            <span className="text-[var(--light-text)]">
              Related: {stats.relatedEdges}
            </span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <div className="w-3 h-0.5 bg-blue-500 shrink-0"></div>
            <span className="text-[var(--light-text)]">
              Subtasks: {stats.subtaskEdges}
            </span>
          </div>
        </div>
      </div>
      {/* GRAPH AREA */}
      {isLoading || isFetching ? (
        <GraphSkeleton />
      ) : (
        <div className="h-[500px]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.5, maxZoom: 0.8 }}
            minZoom={0.1}
            maxZoom={2}
            defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
            defaultEdgeOptions={{
              type: "smoothstep",
              animated: false,
            }}
            proOptions={{ hideAttribution: true }}
          >
            {/* BACKGROUND */}
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="var(--border)"
            />

            {/* ACTION BUTTONS - BOTTOM LEFT */}
            <Panel position="bottom-left" className="flex gap-2 !mb-2 !ml-2">
              <button
                onClick={autoLayout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition shadow-sm"
                title="Auto Layout"
              >
                <LayoutGrid size={14} />
                <span className="hidden sm:inline">Auto Layout</span>
              </button>
              <button
                onClick={() => refetch()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition shadow-sm"
                title="Refresh"
              >
                <RefreshCw size={14} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={() => setShowMinimap(!showMinimap)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs transition shadow-sm ${
                  showMinimap
                    ? "bg-[var(--accent-color)] border-[var(--accent-color)] text-white"
                    : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                }`}
                title={showMinimap ? "Hide Minimap" : "Show Minimap"}
              >
                <Map size={14} />
                <span className="hidden sm:inline">Minimap</span>
              </button>
            </Panel>

            {/* CONTROLS - BOTTOM RIGHT */}
            <Controls
              showZoom={true}
              showFitView={true}
              showInteractive={false}
              position="bottom-right"
              className="!bg-[var(--bg)] !border-[var(--border)] !rounded-lg !shadow-sm [&>button]:!bg-[var(--bg)] [&>button]:!border-[var(--border)] [&>button]:!text-[var(--text-primary)] [&>button:hover]:!bg-[var(--hover-bg)] !mb-2 !mr-2"
            />
            {/* MINIMAP - TOGGLED BY USER (TOP RIGHT) */}
            {showMinimap && (
              <MiniMap
                nodeStrokeColor={(n) => {
                  const nodeData = n.data as TaskNodeData | undefined;
                  if (nodeData?.isBlocked) return "#ef4444";
                  return "var(--border)";
                }}
                nodeColor={(n) => {
                  const nodeData = n.data as TaskNodeData | undefined;
                  if (nodeData?.isBlocked) return "#ef4444";
                  if (nodeData?.status === "completed") return "#22c55e";
                  if (nodeData?.status === "in progress")
                    return "var(--accent-color)";
                  return "var(--card-bg)";
                }}
                maskColor="rgba(0, 0, 0, 0.1)"
                position="top-right"
                className="!bg-[var(--bg)] !border-[var(--border)] !rounded-lg !top-2 !right-2"
              />
            )}
          </ReactFlow>
        </div>
      )}
    </div>
  );
};

export default DependencyGraph;
