import { extractHeadings } from "../../util/headingUtil";

function TableOfContents({ content }) {
  const headings = extractHeadings(content);

  if (headings.length === 0) return null;

  const scrollToHeading = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="doc-toc">
      <p className="toc-label">Table of contents</p>
      <ul className="toc-list">
        {headings.map((h) => (
          <li key={h.id} className={`toc-item toc-level-${h.level}`}>
            <button className="toc-link" onClick={() => scrollToHeading(h.id)}>
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default TableOfContents;