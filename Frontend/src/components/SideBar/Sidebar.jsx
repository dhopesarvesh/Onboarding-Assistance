import { useState, useRef, useEffect } from "react";
import FolderItem from "./FolderItem";
import "./Sidebar.css";

function Sidebar({ folders, loading, error, onRefresh }) {
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [targetFolderId, setTargetFolderId] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Keep the selected target folder valid as folders load/change
  useEffect(() => {
    if (folders.length === 0) {
      setTargetFolderId("");
      return;
    }
    const stillExists = folders.some((f) => String(f.id) === String(targetFolderId));
    if (!stillExists) {
      setTargetFolderId(folders[0].id);
    }
  }, [folders]);

  const submitNewFolder = async () => {
    const name = newFolderName.trim();
    if (!name) {
      setCreatingFolder(false);
      return;
    }
    await fetch("http://localhost:8080/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setNewFolderName("");
    setCreatingFolder(false);
    onRefresh();
  };

  const triggerFilePicker = () => {
    if (!targetFolderId) return;
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e) => {
    const file = e.target.files[0];
    if (!file || !targetFolderId) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `http://localhost:8080/api/folders/${targetFolderId}/documents/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    setUploading(false);
    e.target.value = "";

    if (!res.ok) {
      alert("Upload failed — unsupported file type or extraction error.");
      return;
    }

    onRefresh();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">📘</span>
        <span className="sidebar-title">OnboardAI</span>
      </div>

      <div className="sidebar-actions">
        {creatingFolder ? (
          <input
            autoFocus
            className="inline-input"
            placeholder="Folder name..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitNewFolder()}
            onBlur={submitNewFolder}
          />
        ) : (
          <button className="action-btn" onClick={() => setCreatingFolder(true)}>
            <span>➕</span> New Folder
          </button>
        )}

        <div className="upload-doc-row">
          <label className="upload-label">Upload to folder</label>
          <select
            className="inline-select"
            value={targetFolderId}
            onChange={(e) => setTargetFolderId(e.target.value)}
            disabled={folders.length === 0}
          >
            {folders.length === 0 && <option value="">No folders yet</option>}
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          <button
            className="action-btn"
            onClick={triggerFilePicker}
            disabled={folders.length === 0 || uploading}
            title={folders.length === 0 ? "Create a folder first" : ""}
          >
            <span>📤</span> {uploading ? "Uploading..." : "Upload Document"}
          </button>
        </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.json,.js,.jsx,.ts,.tsx,.java,.py,.css,.html,.yml,.yaml,.xml,.csv,.pdf,.docx"
            style={{ display: "none" }}
            onChange={handleFileSelected}
          />
      </div>

      <div className="sidebar-divider" />

      <nav className="sidebar-tree">
        {loading && <p className="sidebar-status">Loading...</p>}
        {error && <p className="sidebar-status error">{error}</p>}
        {!loading &&
          !error &&
          folders.map((folder) => (
            <FolderItem key={folder.id} folder={folder} onRefresh={onRefresh} />
          ))}
      </nav>
    </aside>
  );
}

export default Sidebar;