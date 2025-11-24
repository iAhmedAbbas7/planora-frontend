// <== IMPORTS ==>
import { AxiosError } from "axios";
import { useTrash } from "../../hooks/useTrash";
import { useState, useEffect, useRef, JSX } from "react";
import { RotateCcw, XCircle, Trash2, Search } from "lucide-react";
import ConfirmationModal, { ModalType } from "../common/ConfirmationModal";

// <== TRASH SECTION COMPONENT ==>
const TrashSection = (): JSX.Element => {
  // GET TRASH DATA FROM HOOK
  const {
    trashTasks,
    trashProjects,
    isLoading,
    bulkRestore,
    bulkDelete,
    emptyTrash: emptyTrashMutation,
    isRestoring,
    isDeleting,
    isEmptying,
  } = useTrash();
  // ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState<"tasks" | "projects">("tasks");
  // SELECTED ITEMS STATE
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  // SEARCH QUERY STATE
  const [searchQuery, setSearchQuery] = useState<string>("");
  // SELECT ALL REF
  const selectAllRef = useRef<HTMLInputElement | null>(null);
  // CONFIRMATION MODAL STATE
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: ModalType;
    title: string;
    message: string;
    onConfirm?: () => void;
    confirmText?: string;
    showCancel?: boolean;
  }>({
    isOpen: false,
    type: "confirm",
    title: "",
    message: "",
    showCancel: true,
  });
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
    if (selectedItems.length === 0 || isRestoring) return;
    // PREPARE REQUEST DATA
    const requestData =
      activeTab === "tasks"
        ? { taskIds: selectedItems, projectIds: [] }
        : { projectIds: selectedItems, taskIds: [] };
    // CALL BULK RESTORE MUTATION
    bulkRestore(requestData, {
      onSuccess: () => {
        // CLEAR SELECTION
        setSelectedItems([]);
        // SHOW SUCCESS MESSAGE
        setModalState({
          isOpen: true,
          type: "success",
          title: "Restore Successful",
          message: `${selectedItems.length} ${activeTab} restored successfully.`,
          showCancel: false,
          confirmText: "OK",
        });
      },
      onError: (error: unknown) => {
        // GET AXIOS ERROR
        const axiosError = error as AxiosError<{ message?: string }>;
        // SHOW ERROR MESSAGE
        setModalState({
          isOpen: true,
          type: "error",
          title: "Restore Failed",
          message:
            axiosError?.response?.data?.message ||
            `Failed to restore ${activeTab}. Please try again.`,
          showCancel: false,
          confirmText: "OK",
        });
      },
    });
  };
  // HANDLE BULK DELETE FUNCTION
  const handleBulkDelete = (): void => {
    // CHECK IF ITEMS SELECTED
    if (selectedItems.length === 0 || isDeleting) return;
    // SHOW CONFIRMATION MODAL
    setModalState({
      isOpen: true,
      type: "warning",
      title: "Confirm Deletion",
      message: `Are you sure you want to permanently delete ${selectedItems.length} ${activeTab}? This action cannot be undone.`,
      confirmText: "Delete",
      showCancel: true,
      onConfirm: () => {
        // PREPARE REQUEST DATA
        const requestData =
          activeTab === "tasks"
            ? { taskIds: selectedItems, projectIds: [] }
            : { projectIds: selectedItems, taskIds: [] };
        // CALL BULK DELETE MUTATION
        bulkDelete(requestData, {
          onSuccess: () => {
            // CLEAR SELECTION
            setSelectedItems([]);
            // SHOW SUCCESS MESSAGE
            setModalState({
              isOpen: true,
              type: "success",
              title: "Delete Successful",
              message: `${selectedItems.length} ${activeTab} permanently deleted.`,
              showCancel: false,
              confirmText: "OK",
            });
          },
          onError: (error: unknown) => {
            // GET AXIOS ERROR
            const axiosError = error as AxiosError<{ message?: string }>;
            // SHOW ERROR MESSAGE
            setModalState({
              isOpen: true,
              type: "error",
              title: "Delete Failed",
              message:
                axiosError?.response?.data?.message ||
                `Failed to delete ${activeTab}. Please try again.`,
              showCancel: false,
              confirmText: "OK",
            });
          },
        });
      },
    });
  };
  // RESTORE ITEMS FUNCTION
  const restoreItems = (
    itemIds: string[],
    type: "tasks" | "projects"
  ): void => {
    // CHECK IF RESTORING
    if (isRestoring) return;
    // PREPARE REQUEST DATA
    const requestData =
      type === "tasks"
        ? { taskIds: itemIds, projectIds: [] }
        : { projectIds: itemIds, taskIds: [] };
    // CALL BULK RESTORE MUTATION
    bulkRestore(requestData, {
      onSuccess: () => {
        // SHOW SUCCESS MESSAGE
        setModalState({
          isOpen: true,
          type: "success",
          title: "Restore Successful",
          message: `${itemIds.length} ${type} restored successfully.`,
          showCancel: false,
          confirmText: "OK",
        });
      },
      onError: (error: unknown) => {
        // GET AXIOS ERROR
        const axiosError = error as AxiosError<{ message?: string }>;
        // SHOW ERROR MESSAGE
        setModalState({
          isOpen: true,
          type: "error",
          title: "Restore Failed",
          message:
            axiosError?.response?.data?.message ||
            `Failed to restore ${type}. Please try again.`,
          showCancel: false,
          confirmText: "OK",
        });
      },
    });
  };
  // PERMANENTLY DELETE ITEMS FUNCTION
  const permanentlyDeleteItems = (
    itemIds: string[],
    type: "tasks" | "projects"
  ): void => {
    // CHECK IF DELETING
    if (isDeleting) return;
    // SHOW CONFIRMATION MODAL
    setModalState({
      isOpen: true,
      type: "warning",
      title: "Confirm Deletion",
      message: `Are you sure you want to permanently delete ${itemIds.length} ${type}? This action cannot be undone.`,
      confirmText: "Delete",
      showCancel: true,
      onConfirm: () => {
        // PREPARE REQUEST DATA
        const requestData =
          type === "tasks"
            ? { taskIds: itemIds, projectIds: [] }
            : { projectIds: itemIds, taskIds: [] };
        // CALL BULK DELETE MUTATION
        bulkDelete(requestData, {
          onSuccess: () => {
            // SHOW SUCCESS MESSAGE
            setModalState({
              isOpen: true,
              type: "success",
              title: "Delete Successful",
              message: `${itemIds.length} ${type} permanently deleted.`,
              showCancel: false,
              confirmText: "OK",
            });
          },
          onError: (error: unknown) => {
            // GET AXIOS ERROR
            const axiosError = error as AxiosError<{ message?: string }>;
            // SHOW ERROR MESSAGE
            setModalState({
              isOpen: true,
              type: "error",
              title: "Delete Failed",
              message:
                axiosError?.response?.data?.message ||
                `Failed to delete ${type}. Please try again.`,
              showCancel: false,
              confirmText: "OK",
            });
          },
        });
      },
    });
  };
  // EMPTY TRASH FUNCTION
  const emptyTrash = (): void => {
    // CHECK IF EMPTYING
    if (isEmptying) return;
    // SHOW CONFIRMATION MODAL
    setModalState({
      isOpen: true,
      type: "warning",
      title: "Empty Trash",
      message:
        "Are you sure you want to empty the trash? This action cannot be undone.",
      confirmText: "Empty Trash",
      showCancel: true,
      onConfirm: () => {
        // CALL EMPTY TRASH MUTATION
        emptyTrashMutation(undefined, {
          onSuccess: () => {
            // SHOW SUCCESS MESSAGE
            setModalState({
              isOpen: true,
              type: "success",
              title: "Trash Emptied",
              message: "Trash emptied successfully.",
              showCancel: false,
              confirmText: "OK",
            });
          },
          onError: (error: unknown) => {
            // GET AXIOS ERROR
            const axiosError = error as AxiosError<{ message?: string }>;
            // SHOW ERROR MESSAGE
            setModalState({
              isOpen: true,
              type: "error",
              title: "Empty Trash Failed",
              message:
                axiosError?.response?.data?.message ||
                "Failed to empty trash. Please try again.",
              showCancel: false,
              confirmText: "OK",
            });
          },
        });
      },
    });
  };
  // FORMAT DATE FUNCTION
  const formatDate = (dateString: string | Date | null | undefined): string => {
    // CHECK IF DATE EXISTS
    if (!dateString) return "N/A";
    // FORMAT DATE
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };
  // FORMAT STATUS FUNCTION
  const formatStatus = (
    status: string | null | undefined | unknown
  ): string => {
    // CHECK IF STATUS EXISTS AND IS A STRING
    if (!status || typeof status !== "string") return "N/A";
    // RETURN STATUS (ALREADY FORMATTED FROM BACKEND)
    return status;
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
            disabled={isEmptying}
            onClick={emptyTrash}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-red-500 cursor-pointer text-red-600 hover:bg-red-500 hover:text-white transition ${
              isEmptying ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {/* TRASH ICON */}
            <Trash2 size={16} />
            {/* BUTTON TEXT */}
            {isEmptying ? "Emptying..." : "Empty Trash"}
          </button>
          {/* DELETE PERMANENTLY BUTTON */}
          <button
            disabled={selectedItems.length === 0 || isDeleting}
            onClick={handleBulkDelete}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl border transition cursor-pointer ${
              selectedItems.length > 0 && !isDeleting
                ? "border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                : "border-[var(--border)] text-[var(--light-text)] cursor-not-allowed"
            }`}
          >
            {/* X CIRCLE ICON */}
            <XCircle size={16} />
            {/* BUTTON TEXT */}
            {isDeleting ? "Deleting..." : "Delete Permanently"}
          </button>
          {/* RESTORE BUTTON */}
          <button
            disabled={selectedItems.length === 0 || isRestoring}
            onClick={handleBulkRestore}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl border transition cursor-pointer ${
              selectedItems.length > 0 && !isRestoring
                ? "border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)] hover:text-white"
                : "border-[var(--border)] text-[var(--light-text)] cursor-not-allowed"
            }`}
          >
            {/* ROTATE CCW ICON */}
            <RotateCcw size={16} />
            {/* BUTTON TEXT */}
            {isRestoring ? "Restoring..." : "Restore"}
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
                      {formatStatus(
                        item.status ||
                          ("originalStatus" in item
                            ? item.originalStatus
                            : null)
                      )}
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
            disabled={isRestoring}
            onClick={handleBulkRestore}
            className={`px-3 py-1.5 text-sm bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-btn-hover-color)] hover:text-white cursor-pointer ${
              isRestoring ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isRestoring ? "Restoring..." : "Restore Selected"}
          </button>
          {/* DELETE SELECTED BUTTON */}
          <button
            disabled={isDeleting}
            onClick={handleBulkDelete}
            className={`px-3 py-1.5 text-sm cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 ${
              isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isDeleting ? "Deleting..." : "Delete Selected"}
          </button>
        </div>
      )}
      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({
            isOpen: false,
            type: "confirm",
            title: "",
            message: "",
            showCancel: true,
          })
        }
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.confirmText}
        showCancel={modalState.showCancel}
      />
    </div>
  );
};

export default TrashSection;
