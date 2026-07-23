import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FolderItem from "./FolderItem";
import "./Sidebar.css";

function Sidebar({ project, loading, error, onRefresh }) {
  const navigate = useNavigate();
  const folders = project?.folders || [];

  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderError, setFolderError] = useState(null);

  const [targetFolderId, setTargetFolderId] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (folders.length === 0) {
      setTargetFolderId("");
      return;
    }
    const stillExists = folders.some((f) => String(f.id) === String(targetFolderId));
    if (!stillExists) setTargetFolderId(folders[0].id);
  }, [folders]);

  const submitNewFolder = async () => {
    const name = newFolderName.trim();
    if (!name) {
      setCreatingFolder(false);
      return;
    }
    setFolderError(null);
    try {
      const res = await fetch(`http://localhost:8080/api/projects/${project.id}/folders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error (${res.status}): ${text || "no details"}`);
      }
      setNewFolderName("");
      setCreatingFolder(false);
      onRefresh();
    } catch (err) {
      console.error("Failed to create folder:", err);
      setFolderError(err.message);
    }
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

    try {
      const res = await fetch(
        `http://localhost:8080/api/folders/${targetFolderId}/documents/upload`,
        { method: "POST", body: formData }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload failed (${res.status}): ${text || "no details"}`);
      }
      onRefresh();
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button className="back-to-projects" onClick={() => navigate("/")} title="All projects">
          ←
        </button>
        <span className="sidebar-logo">📘</span>
        <span className="sidebar-title">{project?.name || "OnboardAI"}</span>
      </div>

      <div className="sidebar-actions">
        {creatingFolder ? (
          <div className="inline-folder-creator">
            <input
              autoFocus
              className="inline-input"
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitNewFolder()}
            />
            <div className="inline-btn-row">
              <button className="inline-confirm-btn" onClick={submitNewFolder}>
                Add
              </button>
              <button
                className="inline-cancel-btn"
                onClick={() => {
                  setCreatingFolder(false);
                  setNewFolderName("");
                  setFolderError(null);
                }}
              >
                Cancel
              </button>
            </div>
            {folderError && <p className="inline-error">{folderError}</p>}
          </div>
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