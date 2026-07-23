export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function uniqueId(base, seen) {
  const count = seen.get(base) || 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

// Scans raw markdown text for #, ##, ### lines in document order.
export function extractHeadings(content) {
  const lines = content.split("\n");
  const seen = new Map();
  const headings = [];

  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.*)/);
    if (!match) continue;
    const level = match[1].length;
    const text = match[2].trim();
    const id = uniqueId(slugify(text), seen);
    headings.push({ level, text, id });
  }
  return headings;
}

// Used by the live markdown renderer to assign the SAME ids, in the same
// order, as extractHeadings — without the two needing to share state.
export function createHeadingIdGenerator() {
  const seen = new Map();
  return (text) => uniqueId(slugify(text), seen);
}

export function flattenText(children) {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(flattenText).join("");
  if (children?.props?.children) return flattenText(children.props.children);
  return "";
}