function DocumentHeader({ title, searchTerm, onSearchChange, matchCount }) {
  return (
    <div className="doc-header">
      <div className="doc-header-top">
        <h1 className="doc-title">{title}</h1>

        <div className="doc-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search in this document..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <span className="search-count">
              {matchCount} {matchCount === 1 ? "match" : "matches"}
            </span>
          )}
        </div>
      </div>
      <div className="doc-divider" />
    </div>
  );
}

export default DocumentHeader;