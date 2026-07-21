import { useState, useMemo } from "react";
import DocumentHeader from "./DocumentHeader";
import DocumentContent from "./DocumentContent";
import "./DocumentViewer.css";

function DocumentViewer({ document, folderName }) {
  const [searchTerm, setSearchTerm] = useState("");

  const matchCount = useMemo(() => {
    if (!searchTerm || !document) return 0;
    const regex = new RegExp(escapeRegExp(searchTerm), "gi");
    return (document.content.match(regex) || []).length;
  }, [searchTerm, document]);

  if (!document) {
    return (
      <div className="doc-viewer">
        <div className="empty-state">
          <span className="empty-icon">📄</span>
          <h2>No document selected</h2>
          <p>Pick a document from the sidebar to view it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="doc-viewer">
      <DocumentHeader
        title={document.title}
        folderName={folderName}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        matchCount={matchCount}
      />
      <div className="doc-body">
        <DocumentContent content={document.content} searchTerm={searchTerm} />
      </div>
    </div>
  );
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default DocumentViewer;