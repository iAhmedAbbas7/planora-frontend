// <== IMPORTS ==>
import { useState, useEffect, useRef, JSX } from "react";
import { RotateCcw, XCircle, Trash2, Search } from "lucide-react";

// <== TRASH TASK TYPE INTERFACE ==>
type TrashTask = {
  // <== ID ==>
  _id: string;
  // <== TITLE ==>
  title: string;
  // <== DELETED ON ==>
  deletedOn: string;
  // <== ORIGINAL STATUS ==>
  originalStatus: string;
  // <== STATUS ==>
  status: string;
};
// <== TRASH PROJECT TYPE INTERFACE ==>
type TrashProject = {
  // <== ID ==>
  _id: string;
  // <== TITLE ==>
  title: string;
  // <== DELETED ON ==>
  deletedOn: string;
  // <== ORIGINAL STATUS ==>
  originalStatus: string;
  // <== STATUS ==>
  status: string;
};

// <== TRASH SECTION COMPONENT ==>
const TrashSection = (): JSX.Element => {
  // ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState<"tasks" | "projects">("tasks");
  // SELECTED ITEMS STATE
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  // SEARCH QUERY STATE
  const [searchQuery, setSearchQuery] = useState<string>("");
  // TRASH TASKS STATE
  const [trashTasks, setTrashTasks] = useState<TrashTask[]>([]);
  // TRASH PROJECTS STATE
  const [trashProjects, setTrashProjects] = useState<TrashProject[]>([]);
  // LOADING STATE
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // SELECT ALL REF
  const selectAllRef = useRef<HTMLInputElement | null>(null);
  // FETCH TRASHED ITEMS EFFECT (MOCK DATA - NO API)
  useEffect(() => {
    // SIMULATE API CALL
    setTimeout(() => {
      // SET EMPTY TRASH ITEMS
      setTrashTasks([]);
      setTrashProjects([]);
      // SET LOADING TO FALSE
      setIsLoading(false);
    }, 500);
  }, []);
  // GET CURRENT DATA
  const currentData = activeTab === "tasks" ? trashTasks : trashProjects;
  // UPDATE SELECT ALL CHECKBOX INDETERMINATE STATE EFFECT
  useEffect(() => {
    // CHECK IF SELECT ALL REF EXISTS
    if (selectAllRef.current) {
      // SET INDETERMINATE STATE
      selectAllRef.current.indeterminate =
        selectedItems.length > 0 && selectedItems.length < currentData.length;
    }
  }, [selectedItems, currentData.length]);
  // FILTER DATA BY SEARCH QUERY
  const filteredData = currentData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // HANDLE SELECT ALL FUNCTION
  const handleSelectAll = (checked: boolean): void => {
    // UPDATE SELECTED ITEMS
    if (checked) setSelectedItems(currentData.map((item) => item._id));
    else setSelectedItems([]);
  };
  // HANDLE SELECT ONE FUNCTION
  const handleSelectOne = (id: string): void => {
    // TOGGLE SELECTION
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  // HANDLE BULK RESTORE FUNCTION
  const handleBulkRestore = (): void => {
    // CHECK IF ITEMS SELECTED
    if (selectedItems.length === 0) return;
    // RESTORE ITEMS (UI ONLY - NO API)
    if (activeTab === "tasks") {
      setTrashTasks((prev) =>
        prev.filter((t) => !selectedItems.includes(t._id))
      );
    } else {
      setTrashProjects((prev) =>
        prev.filter((p) => !selectedItems.includes(p._id))
      );
    }
    // LOG RESTORE (UI ONLY)
    console.log("Items restored:", selectedItems);
    // CLEAR SELECTION
    setSelectedItems([]);
    // SHOW SUCCESS MESSAGE
    alert(`${activeTab} restored successfully`);
  };
  // HANDLE BULK DELETE FUNCTION
  const handleBulkDelete = (): void => {
    // CHECK IF ITEMS SELECTED
    if (selectedItems.length === 0) return;
    // CONFIRM DELETION
    if (
      window.confirm(
        `Are you sure you want to permanently delete ${selectedItems.length} ${activeTab}?`
      )
    ) {
      // DELETE ITEMS (UI ONLY - NO API)
      if (activeTab === "tasks") {
        setTrashTasks((prev) =>
          prev.filter((t) => !selectedItems.includes(t._id))
        );
      } else {
        setTrashProjects((prev) =>
          prev.filter((p) => !selectedItems.includes(p._id))
        );
      }
      // LOG DELETION (UI ONLY)
      console.log("Items permanently deleted:", selectedItems);
      // CLEAR SELECTION
      setSelectedItems([]);
      // SHOW SUCCESS MESSAGE
      alert(`${activeTab} permanently deleted`);
    }
  };
  // RESTORE ITEMS FUNCTION
  const restoreItems = (
    itemIds: string[],
    type: "tasks" | "projects"
  ): void => {
    // RESTORE ITEMS (UI ONLY - NO API)
    if (type === "tasks") {
      setTrashTasks((prev) => prev.filter((t) => !itemIds.includes(t._id)));
    } else {
      setTrashProjects((prev) => prev.filter((p) => !itemIds.includes(p._id)));
    }
    // LOG RESTORE (UI ONLY)
    console.log("Items restored:", itemIds);
    // SHOW SUCCESS MESSAGE
    alert(`${type} restored successfully`);
  };
  // PERMANENTLY DELETE ITEMS FUNCTION
  const permanentlyDeleteItems = (
    itemIds: string[],
    type: "tasks" | "projects"
  ): void => {
    // CONFIRM DELETION
    if (
      window.confirm(
        `Are you sure you want to permanently delete ${itemIds.length} ${type}?`
      )
    ) {
      // DELETE ITEMS (UI ONLY - NO API)
      if (type === "tasks") {
        setTrashTasks((prev) => prev.filter((t) => !itemIds.includes(t._id)));
      } else {
        setTrashProjects((prev) =>
          prev.filter((p) => !itemIds.includes(p._id))
        );
      }
      // LOG DELETION (UI ONLY)
      console.log("Items permanently deleted:", itemIds);
      // SHOW SUCCESS MESSAGE
      alert(`${type} permanently deleted`);
    }
  };
  // EMPTY TRASH FUNCTION
  const emptyTrash = (): void => {
    // CONFIRM EMPTY TRASH
    if (
      !window.confirm(
        "Are you sure you want to empty the trash? This action cannot be undone."
      )
    ) {
      return;
    }
    // EMPTY TRASH (UI ONLY - NO API)
    setTrashTasks([]);
    setTrashProjects([]);
    // LOG EMPTY TRASH (UI ONLY)
    console.log("Trash emptied");
    // SHOW SUCCESS MESSAGE
    alert("Trash emptied successfully");
  };
  // FORMAT DATE FUNCTION
  const formatDate = (dateString: string): string => {
    // FORMAT DATE
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };
  // RETURNING THE TRASH SECTION COMPONENT
  return (
    // TRASH SECTION MAIN CONTAINER
    <div className="p-4 rounded-2xl flex flex-col w-full bg-[var(--bg)] border border-[var(--border)]">
      {/* TOP CONTROLS HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        {/* SEARCH CONTAINER */}
        <div className="relative w-full sm:w-72">
          {/* SEARCH ICON */}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--light-text)] font-medium" />
          {/* SEARCH INPUT */}
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border font-medium border-[var(--border)] pl-10 pr-3 py-2 rounded-xl w-full focus:border-[var(--accent-color)] outline-none text-sm"
          />
        </div>
        {/* BULK ACTIONS CONTAINER */}
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
          {/* EMPTY TRASH BUTTON */}
          <button
            onClick={emptyTrash}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-red-500 cursor-pointer text-red-600 hover:bg-red-500 hover:text-white transition"
          >
            {/* TRASH ICON */}
            <Trash2 size={16} />
            {/* BUTTON TEXT */}
            Empty Trash
          </button>
          {/* DELETE PERMANENTLY BUTTON */}
          <button
            disabled={selectedItems.length === 0}
            onClick={handleBulkDelete}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl border transition cursor-pointer ${
              selectedItems.length > 0
                ? "border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                : "border-[var(--border)] text-[var(--light-text)] cursor-not-allowed"
            }`}
          >
            {/* X CIRCLE ICON */}
            <XCircle size={16} />
            {/* BUTTON TEXT */}
            Delete Permanently
          </button>
          {/* RESTORE BUTTON */}
          <button
            disabled={selectedItems.length === 0}
            onClick={handleBulkRestore}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl border transition cursor-pointer ${
              selectedItems.length > 0
                ? "border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)] hover:text-white"
                : "border-[var(--border)] text-[var(--light-text)] cursor-not-allowed"
            }`}
          >
            {/* ROTATE CCW ICON */}
            <RotateCcw size={16} />
            {/* BUTTON TEXT */}
            Restore
          </button>
        </div>
      </header>
      {/* TABS CONTAINER */}
      <div className="flex justify-between items-center border-b border-[var(--border)]">
        {/* TABS */}
        <div className="flex gap-6">
          {/* MAPPING THROUGH TABS */}
          {["tasks", "projects"].map((tab) => (
            // TAB BUTTON
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as "tasks" | "projects");
                setSelectedItems([]);
                setSearchQuery("");
              }}
              className={`pb-2 font-medium cursor-pointer ${
                activeTab === tab
                  ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
                  : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {/* TABLE CONTAINER */}
      <div className="overflow-x-auto bg-[var(--bg)] rounded-xl border border-[var(--border)] shadow-sm mt-4">
        {/* CHECK IF LOADING */}
        {isLoading ? (
          // LOADING STATE
          <div className="text-center py-10 text-[var(--light-text)]">
            Loading trashed items...
          </div>
        ) : filteredData.length === 0 ? (
          // EMPTY STATE
          <div className="text-center py-10 text-[var(--light-text)]">
            {/* TRASH ICON */}
            <Trash2
              size={40}
              className="mx-auto mb-3 text-[var(--light-text)]"
            />
            {/* EMPTY STATE TEXT */}
            No {activeTab} found in trash
          </div>
        ) : (
          // TABLE
          <table className="w-full text-sm border-collapse">
            {/* TABLE HEADER */}
            <thead>
              <tr className="bg-[var(--cards-bg)] text-[var(--light-text)]">
                {/* SELECT ALL CHECKBOX HEADER */}
                <th className="w-12 p-3 text-left">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    className="accent-[var(--accent-color)] cursor-pointer"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={
                      selectedItems.length === currentData.length &&
                      currentData.length > 0
                    }
                  />
                </th>
                {/* NAME HEADER */}
                <th className="p-2 text-left">
                  {activeTab === "tasks" ? "Task Name" : "Project Name"}
                </th>
                {/* DELETED ON HEADER */}
                <th className="p-2 text-left">Deleted On</th>
                {/* ORIGINAL STATUS HEADER */}
                <th className="p-2 text-left">Original Status</th>
                {/* ACTIONS HEADER */}
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            {/* TABLE BODY */}
            <tbody>
              {/* MAPPING THROUGH FILTERED DATA */}
              {filteredData.map((item, i) => (
                // TABLE ROW
                <tr
                  key={item._id}
                  className={`transition ${
                    i % 2 === 0 ? "bg-[var(--bg)]" : "bg-[var(--cards-bg)]"
                  }`}
                >
                  {/* SELECT CHECKBOX CELL */}
                  <td className="p-3 pt-2 pb-2">
                    <input
                      type="checkbox"
                      className="accent-[var(--accent-color)] cursor-pointer"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleSelectOne(item._id)}
                    />
                  </td>
                  {/* NAME CELL */}
                  <td className="p-2 font-medium text-[var(--text-primary)]">
                    {item.title}
                  </td>
                  {/* DELETED ON CELL */}
                  <td className="p-2 text-[var(--light-text)]">
                    {formatDate(item.deletedOn)}
                  </td>
                  {/* ORIGINAL STATUS CELL */}
                  <td className="p-2">
                    {/* STATUS BADGE */}
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.status === "completed" ||
                        item.status === "Completed" ||
                        item.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : item.status === "in progress" ||
                            item.status === "In Progress" ||
                            item.status === "On Hold"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  {/* ACTIONS CELL */}
                  <td className="p-2 flex gap-2">
                    {/* RESTORE BUTTON */}
                    <button
                      title="Restore"
                      onClick={() => restoreItems([item._id], activeTab)}
                      className="p-1.5 rounded-md hover:bg-[var(--accent-btn-hover-color)] text-[var(--accent-color)] cursor-pointer"
                    >
                      {/* ROTATE CCW ICON */}
                      <RotateCcw size={18} />
                    </button>
                    {/* DELETE PERMANENTLY BUTTON */}
                    <button
                      title="Delete Permanently"
                      onClick={() =>
                        permanentlyDeleteItems([item._id], activeTab)
                      }
                      className="p-1.5 rounded-md hover:bg-red-50 text-red-600 cursor-pointer"
                    >
                      {/* X CIRCLE ICON */}
                      <XCircle size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* FLOATING ACTION BAR */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[var(--bg)] border border-[var(--border)] shadow-lg px-4 sm:px-6 py-3 rounded-xl flex gap-3 sm:gap-4 items-center animate-fadeIn z-50">
          {/* SELECTED COUNT */}
          <p className="text-sm text-[var(--light-text)]">
            {selectedItems.length} selected
          </p>
          {/* RESTORE SELECTED BUTTON */}
          <button
            onClick={handleBulkRestore}
            className="px-3 py-1.5 text-sm bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-btn-hover-color)] hover:text-white cursor-pointer"
          >
            Restore Selected
          </button>
          {/* DELETE SELECTED BUTTON */}
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1.5 text-sm cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Selected
          </button>
        </div>
      )}
    </div>
  );
};

export default TrashSection;
