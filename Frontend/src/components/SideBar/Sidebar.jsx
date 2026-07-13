import { useState, useEffect } from "react";
import FolderItem from "./FolderItem";
import "./Sidebar.css";

function Sidebar({ selectedDocId, onSelectDocument }) {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/folders")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load folders");
        return res.json();
      })
      .then((data) => {
        setFolders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">📘</span>
        <span className="sidebar-title">OnboardAI</span>
      </div>

      <div className="sidebar-actions">
        <button className="action-btn">
          <span>➕</span> New Folder
        </button>
        <button className="action-btn">
          <span>➕</span> New Document
        </button>
      </div>

      <div className="sidebar-divider" />

      <nav className="sidebar-tree">
        {loading && <p className="sidebar-status">Loading...</p>}
        {error && <p className="sidebar-status error">{error}</p>}
        {!loading &&
          !error &&
          folders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={{
                id: folder.id,
                name: folder.name,
                isOpen: false,
                documents: folder.documents,
              }}
              selectedDocId={selectedDocId}
              onSelectDocument={onSelectDocument}
            />
          ))}
      </nav>
    </aside>
  );
}

export default Sidebar;