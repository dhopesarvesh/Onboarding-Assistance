import FolderItem from "./FolderItem";
import { sidebarData } from "./data";
import "./Sidebar.css";

function Sidebar() {
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
        {sidebarData.map((folder) => (
          <FolderItem key={folder.id} folder={folder} />
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;