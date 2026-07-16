import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

function FolderItem({ folder, onRefresh }) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { folderSlug, docSlug } = useParams();

  const handleFileSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `http://localhost:8080/api/folders/${folder.id}/documents/upload`,
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

    setIsOpen(true);
    onRefresh();
  };

  return (
    <div className="folder-item">
      <div className="folder-header-row">
        <button
          className="folder-header"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span className="folder-arrow">{isOpen ? "▼" : "▶"}</span>
          <span className="folder-name">{folder.name}</span>
        </button>
        <button
          className="folder-add-btn"
          title="Upload document"
          disabled={uploading}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          {uploading ? "⏳" : "📤"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.json,.js,.jsx,.ts,.tsx,.java,.py,.css,.html,.yml,.yaml,.xml,.csv"
          style={{ display: "none" }}
          onChange={handleFileSelected}
        />
      </div>

      {isOpen && (
        <div className="folder-documents">
          {(folder.documents || []).map((doc) => (
            <button
              key={doc.id}
              className={`document-item ${
                folderSlug === folder.slug && docSlug === doc.slug ? "active" : ""
              }`}
              onClick={() => navigate(`/${folder.slug}/${doc.slug}`)}
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