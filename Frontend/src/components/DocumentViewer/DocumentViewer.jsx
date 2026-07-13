import { useState, useMemo } from "react";
import DocumentContent from "./DocumentContent";
import DocumentHeader from "./DocumentHeader";
import "./DocumentViewer.css";

function DocumentViewer({ document }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Reset search whenever the user switches documents
  const matchCount = useMemo(() => {
    if (!searchTerm || !document) return 0;
    const regex = new RegExp(escapeRegExp(searchTerm), "gi");
    return (document.content.match(regex) || []).length;
  }, [searchTerm, document]);

  if (!document) {
    return (
      <div className="doc-viewer empty-state">
        <span className="empty-icon">📄</span>
        <h2>No document selected</h2>
        <p>Pick a document from the sidebar to view it here.</p>
      </div>
    );
  }

  return (
    <div className="doc-viewer">
      <DocumentHeader
        title={document.title}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        matchCount={matchCount}
      />
      <DocumentContent content={document.content} searchTerm={searchTerm} />
    </div>
  );
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default DocumentViewer;