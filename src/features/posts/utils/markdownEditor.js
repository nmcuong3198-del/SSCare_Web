const BLOCK_TAGS = new Set([
  "P",
  "DIV",
  "BLOCKQUOTE",
  "UL",
  "OL",
  "H1",
  "H2",
  "H3",
]);

function escapeHtml(value) {
  return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
}

function renderInline(value) {
  const escaped = escapeHtml(value);
  const tokens = [];

  const protect = (html) => {
    const token = `§§SSCARETOKEN${tokens.length}§§`;
    tokens.push(html);
    return token;
  };

  let result = escaped
      .replace(/\*\*([^*\n]+?)\*\*/g, (_, text) => protect(`<strong>${text}</strong>`))
      .replace(/__([^_\n]+?)__/g, (_, text) => protect(`<strong>${text}</strong>`))
      .replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, (_, prefix, text) => `${prefix}${protect(`<em>${text}</em>`)}`)
      .replace(/(^|[^_])_([^_\n]+?)_(?!_)/g, (_, prefix, text) => `${prefix}${protect(`<em>${text}</em>`)}`);

  tokens.forEach((html, index) => {
    result = result.replace(`§§SSCARETOKEN${index}§§`, html);
  });

  return result;
}

function isUnorderedList(line) {
  return /^\s*[-+*]\s+/.test(line);
}

function isOrderedList(line) {
  return /^\s*\d+[.)]\s+/.test(line);
}

function isBlockStart(line) {
  const trimmed = line.trim();
  return (
      /^#{1,3}\s+/.test(trimmed) ||
      /^>\s?/.test(trimmed) ||
      isUnorderedList(line) ||
      isOrderedList(line)
  );
}

/**
 * Convert the small Markdown subset supported by SSCare's article editor to safe HTML.
 * Raw HTML is always escaped, so the returned value is safe to use as editor/preview HTML.
 */
export function markdownToHtml(markdown = "") {
  const normalized = String(markdown ?? "").replace(/\r\n?/g, "\n");
  if (!normalized.trim()) return "";

  const lines = normalized.split("\n");
  const html = [];

  for (let index = 0; index < lines.length; ) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(trimmed);
    if (heading) {
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, ""));
        index += 1;
      }
      html.push(
          `<blockquote>${quoteLines
              .map((quoteLine) => renderInline(quoteLine))
              .join("<br>")}</blockquote>`,
      );
      continue;
    }

    if (isUnorderedList(line)) {
      const items = [];
      while (index < lines.length && isUnorderedList(lines[index])) {
        items.push(lines[index].replace(/^\s*[-+*]\s+/, ""));
        index += 1;
      }
      html.push(`<ul>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
      continue;
    }

    if (isOrderedList(line)) {
      const items = [];
      while (index < lines.length && isOrderedList(lines[index])) {
        items.push(lines[index].replace(/^\s*\d+[.)]\s+/, ""));
        index += 1;
      }
      html.push(`<ol>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ol>`);
      continue;
    }

    const paragraphLines = [trimmed];
    index += 1;
    while (
        index < lines.length &&
        lines[index].trim() &&
        !isBlockStart(lines[index])
        ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    html.push(`<p>${paragraphLines.map(renderInline).join("<br>")}</p>`);
  }

  return html.join("");
}

/**
 * Sanitize rich HTML from the clipboard to the small formatting subset SSCare supports.
 * This keeps semantic formatting (bold/italic/headings/quotes/lists) while dropping
 * Word/Google Docs classes, colors, fonts and other inline CSS that should not leak into the CMS.
 */
export function clipboardHtmlToEditorHtml(html = "") {
  if (typeof DOMParser === "undefined" || !String(html).trim()) return "";

  const documentNode = new DOMParser().parseFromString(String(html), "text/html");

  const parseFontWeight = (value) => {
    const weight = String(value ?? "").trim().toLowerCase();
    if (!weight) return null;
    if (weight === "bold" || weight === "bolder") return true;
    if (weight === "normal" || weight === "lighter") return false;

    const numericWeight = Number.parseInt(weight, 10);
    if (!Number.isFinite(numericWeight)) return null;
    return numericWeight >= 600;
  };

  const parseFontStyle = (value) => {
    const fontStyle = String(value ?? "").trim().toLowerCase();
    if (!fontStyle) return null;
    if (fontStyle === "italic" || fontStyle === "oblique") return true;
    if (fontStyle === "normal") return false;
    return null;
  };

  const resolveInlineFormat = (node, inheritedFormat) => {
    const tag = node?.tagName?.toUpperCase();
    let bold = inheritedFormat.bold;
    let italic = inheritedFormat.italic;

    if (tag === "B" || tag === "STRONG") bold = true;
    if (tag === "I" || tag === "EM") italic = true;

    const style = node?.style;
    const explicitBold = parseFontWeight(style?.fontWeight);
    const explicitItalic = parseFontStyle(style?.fontStyle);

    // Inline CSS has higher priority than inherited/semantic formatting.
    // This is important for Word/Google Docs clipboard HTML where an outer
    // bold wrapper may contain child spans that explicitly reset to normal.
    if (explicitBold !== null) bold = explicitBold;
    if (explicitItalic !== null) italic = explicitItalic;

    return { bold, italic };
  };

  const wrapInlineText = (text, format) => {
    if (!text) return "";
    let result = escapeHtml(text);
    if (format.italic) result = `<em>${result}</em>`;
    if (format.bold) result = `<strong>${result}</strong>`;
    return result;
  };

  const renderChildren = (node, inheritedFormat) =>
      Array.from(node?.childNodes ?? [])
          .map((child) => renderNode(child, inheritedFormat))
          .join("");

  const renderNode = (node, inheritedFormat = { bold: false, italic: false }) => {
    if (!node) return "";
    if (node.nodeType === 3) {
      return wrapInlineText(node.nodeValue ?? "", inheritedFormat);
    }
    if (node.nodeType !== 1) return "";

    const tag = node.tagName?.toUpperCase();
    const format = resolveInlineFormat(node, inheritedFormat);
    const children = renderChildren(node, format);

    if (tag === "BR") return "<br>";
    if (tag === "P") return `<p>${children}</p>`;
    if (tag === "DIV") return `<div>${children}</div>`;
    if (tag === "BLOCKQUOTE") return `<blockquote>${children}</blockquote>`;
    if (tag === "UL") return `<ul>${children}</ul>`;
    if (tag === "OL") return `<ol>${children}</ol>`;
    if (tag === "LI") return `<li>${children}</li>`;
    if (tag === "H1" || tag === "H2" || tag === "H3") {
      return `<${tag.toLowerCase()}>${children}</${tag.toLowerCase()}>`;
    }

    // Formatting tags and unsupported wrappers are represented through the
    // effective format passed to their text descendants. This prevents an
    // outer <strong>/<span font-weight:bold> from swallowing child resets.
    return children;
  };

  return renderChildren(documentNode.body, { bold: false, italic: false });
}

function normalizeInlineText(value) {
  return value.replace(/\u00a0/g, " ");
}

function serializeChildren(node) {
  return Array.from(node.childNodes ?? []).map(serializeNode).join("");
}

function prefixQuoteLines(value) {
  return value
      .trim()
      .split("\n")
      .map((line) => (line.trim() ? `> ${line.trim()}` : ">"))
      .join("\n");
}

function serializeList(node, ordered) {
  const items = Array.from(node.children ?? []).filter(
      (child) => child.tagName === "LI",
  );

  return items
      .map((item, index) => {
        const content = serializeChildren(item)
            .replace(/\n{2,}/g, "\n")
            .trim();
        return `${ordered ? `${index + 1}.` : "-"} ${content}`;
      })
      .join("\n");
}

function serializeNode(node) {
  if (!node) return "";

  if (node.nodeType === 3) {
    return normalizeInlineText(node.nodeValue ?? "");
  }

  if (node.nodeType !== 1) return "";

  const tag = node.tagName;
  const content = () => serializeChildren(node);

  switch (tag) {
    case "BR":
      return "\n";
    case "B":
    case "STRONG": {
      const text = content();
      return text.trim() ? `**${text}**` : text;
    }
    case "I":
    case "EM": {
      const text = content();
      return text.trim() ? `*${text}*` : text;
    }
    case "H1":
      return `# ${content().trim()}\n\n`;
    case "H2":
      return `## ${content().trim()}\n\n`;
    case "H3":
      return `### ${content().trim()}\n\n`;
    case "BLOCKQUOTE":
      return `${prefixQuoteLines(content())}\n\n`;
    case "UL":
      return `${serializeList(node, false)}\n\n`;
    case "OL":
      return `${serializeList(node, true)}\n\n`;
    case "P":
    case "DIV":
      return `${content().trimEnd()}\n\n`;
    default:
      return content();
  }
}

/** Convert contentEditable DOM back to the Markdown persisted by the existing API. */
export function editorElementToMarkdown(element) {
  if (!element) return "";

  return serializeChildren(element)
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
}

/** Visible character count, useful for limits/counters that should ignore Markdown syntax. */
export function markdownPlainTextLength(markdown = "") {
  return String(markdown ?? "")
      .replace(/^#{1,3}\s+/gm, "")
      .replace(/^>\s?/gm, "")
      .replace(/^\s*[-+*]\s+/gm, "")
      .replace(/^\s*\d+[.)]\s+/gm, "")
      .replace(/\*\*/g, "")
      .replace(/__/g, "")
      .replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, "$1$2")
      .replace(/(^|[^_])_([^_\n]+?)_(?!_)/g, "$1$2")
      .length;
}

export function isSelectionInsideTag(root, tagName) {
  if (typeof window === "undefined") return false;
  const selection = window.getSelection?.();
  if (!selection || selection.rangeCount === 0) return false;

  let node = selection.anchorNode;
  if (!node) return false;
  if (node.nodeType === 3) node = node.parentElement;

  const expected = String(tagName).toUpperCase();
  while (node && node !== root) {
    if (node.tagName === expected) return true;
    node = node.parentElement;
  }
  return false;
}

export function closestEditableBlock(root) {
  if (typeof window === "undefined") return null;
  const selection = window.getSelection?.();
  if (!selection || selection.rangeCount === 0) return null;

  let node = selection.anchorNode;
  if (node?.nodeType === 3) node = node.parentElement;

  while (node && node !== root) {
    if (BLOCK_TAGS.has(node.tagName)) return node;
    node = node.parentElement;
  }
  return null;
}
