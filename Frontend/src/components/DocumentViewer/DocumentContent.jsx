import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createHeadingIdGenerator, flattenText } from "../../util/headingUtil";

function DocumentContent({ content, searchTerm }) {
  const headingIdGen = useMemo(() => createHeadingIdGenerator(), [content]);

  if (searchTerm) {
    return (
      <div className="doc-content doc-content-plain">
        {renderHighlighted(content, searchTerm)}
      </div>
    );
  }

  const hasMarkdownSyntax = /^#{1,3}\s|```/m.test(content);

  if (hasMarkdownSyntax) {
    return (
      <div className="doc-content markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children, ...props }) => (
              <h1 className="md-h1" id={headingIdGen(flattenText(children))} {...props}>
                {children}
              </h1>
            ),
            h2: ({ children, ...props }) => (
              <h2 className="md-h2" id={headingIdGen(flattenText(children))} {...props}>
                {children}
              </h2>
            ),
            h3: ({ children, ...props }) => (
              <h3 className="md-h3" id={headingIdGen(flattenText(children))} {...props}>
                {children}
              </h3>
            ),
            p: (props) => <p className="md-p" {...props} />,
            ul: (props) => <ul className="md-ul" {...props} />,
            ol: (props) => <ol className="md-ol" {...props} />,
            li: (props) => <li className="md-li" {...props} />,
            blockquote: (props) => <blockquote className="md-blockquote" {...props} />,
            a: (props) => <a className="md-link" target="_blank" rel="noreferrer" {...props} />,
            code({ inline, className, children, ...props }) {
              return inline ? (
                <code className="md-inline-code" {...props}>
                  {children}
                </code>
              ) : (
                <pre className="md-code-block">
                  <code {...props}>{children}</code>
                </pre>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  return <div className="doc-content markdown-body">{renderPlainStructured(content)}</div>;
}

function renderPlainStructured(content) {
  const rawLines = content.split("\n");
  const blocks = [];
  let currentPara = [];

  const flushPara = () => {
    if (currentPara.length > 0) {
      blocks.push({ type: "p", text: currentPara.join(" ") });
      currentPara = [];
    }
  };

  const bulletChar = /[•‣◦▪●○]/;

  for (const rawLine of rawLines) {
    const line = rawLine.trim();
    if (line === "") {
      flushPara();
      continue;
    }

    if (bulletChar.test(line)) {
      flushPara();
      const segments = line.split(bulletChar).map((s) => s.trim()).filter(Boolean);
      const firstBulletIndex = line.search(bulletChar);
      const intro = line.slice(0, firstBulletIndex).trim();
      const items = segments.slice(intro ? 1 : 0);

      if (intro) blocks.push({ type: "p", text: intro });
      if (items.length > 0) blocks.push({ type: "list", ordered: false, items });
      continue;
    }

    const numberedMatch = line.match(/^\d+[.)]\s+(.*)/);
    if (numberedMatch) {
      flushPara();
      blocks.push({ type: "list", ordered: true, items: [numberedMatch[1]] });
      continue;
    }

    currentPara.push(line);
  }
  flushPara();

  const merged = [];
  for (const block of blocks) {
    const last = merged[merged.length - 1];
    if (block.type === "list" && last?.type === "list" && last.ordered === block.ordered) {
      last.items.push(...block.items);
    } else {
      merged.push({ ...block, items: block.items ? [...block.items] : undefined });
    }
  }

  return merged.map((block, i) => {
    if (block.type === "p") {
      return (
        <p key={i} className="md-p">
          {block.text}
        </p>
      );
    }
    const Tag = block.ordered ? "ol" : "ul";
    return (
      <Tag key={i} className={block.ordered ? "md-ol" : "md-ul"}>
        {block.items.map((item, j) => (
          <li key={j} className="md-li">
            {item}
          </li>
        ))}
      </Tag>
    );
  });
}

function renderHighlighted(content, searchTerm) {
  const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");

  return paragraphs.map((para, i) => (
    <p key={i} className="md-p">
      {para.split(regex).map((part, j) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark key={j} className="search-highlight">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </p>
  ));
}

export default DocumentContent;