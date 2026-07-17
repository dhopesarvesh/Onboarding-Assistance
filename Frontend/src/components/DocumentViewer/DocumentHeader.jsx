function DocumentHeader({ title, folderName, searchTerm, onSearchChange, matchCount }) {
  return (
    <div className="doc-header">
      <div className="doc-breadcrumb">
        <span>Home</span>
        {folderName && (
          <>
            <span className="crumb-sep">›</span>
            <span>{folderName}</span>
          </>
        )}
        <span className="crumb-sep">›</span>
        <span className="crumb-current">{title}</span>
      </div>

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
  );
}

export default DocumentHeader;