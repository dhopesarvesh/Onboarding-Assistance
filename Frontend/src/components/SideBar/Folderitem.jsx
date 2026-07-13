import { useState } from "react";

function FolderItem({ folder, selectedDocId, onSelectDocument }) {
  const [isOpen, setIsOpen] = useState(folder.isOpen);

  return (
    <div className="folder-item">
      <button
        className="folder-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="folder-arrow">{isOpen ? "▼" : "▶"}</span>
        <span className="folder-name">{folder.name}</span>
      </button>

      {isOpen && (
        <div className="folder-documents">
          {(folder.documents || []).map((doc) => (
            <button
              key={doc.id}
              className={`document-item ${doc.id === selectedDocId ? "active" : ""}`}
              onClick={() => onSelectDocument(doc)}
            >
              <span className="doc-icon">📄</span>
              <span>{doc.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FolderItem;