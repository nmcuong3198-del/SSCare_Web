const ALIGN_OPEN_RE = /^:::align-(left|center|right|justify)$/;
const IMAGE_RE = /^:::sscare-image\s+(\{.*})$/;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
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
    .replace(/\[([^\]\n]+)]\{#([0-9a-fA-F]{6})}/g, (_, text, color) =>
      protect(`<span style="color:#${color.toUpperCase()}">${text}</span>`),
    )
    .replace(/\+\+([^+\n]+?)\+\+/g, (_, text) => protect(`<u>${text}</u>`))
    .replace(/\[([^\]\n]+)]\((https?:\/\/[^\s)]+)\)/g, (_, text, href) =>
      protect(`<a href="${escapeAttribute(href)}" target="_blank" rel="noreferrer">${text}</a>`),
    )
    .replace(/\*\*([^*\n]+?)\*\*/g, (_, text) => protect(`<strong>${text}</strong>`))
    .replace(/__([^_\n]+?)__/g, (_, text) => protect(`<strong>${text}</strong>`))
    .replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, (_, prefix, text) => `${prefix}${protect(`<em>${text}</em>`)}`)
    .replace(/(^|[^_])_([^_\n]+?)_(?!_)/g, (_, prefix, text) => `${prefix}${protect(`<em>${text}</em>`)}`);

  tokens.forEach((html, index) => {
    result = result.replace(`§§SSCARETOKEN${index}§§`, html);
  });
  return result;
}

function isUnorderedList(line) { return /^\s*[-+*]\s+/.test(line); }
function isOrderedList(line) { return /^\s*\d+[.)]\s+/.test(line); }
function isBlockStart(line) {
  const trimmed = line.trim();
  return /^#{1,3}\s+/.test(trimmed) || /^>\s?/.test(trimmed) || isUnorderedList(line) || isOrderedList(line) || ALIGN_OPEN_RE.test(trimmed) || IMAGE_RE.test(trimmed);
}

function parseImageDirective(line) {
  const match = IMAGE_RE.exec(line.trim());
  if (!match) return null;
  try {
    const image = JSON.parse(match[1]);
    if (!image?.url || !Number(image?.width) || !Number(image?.height)) return null;
    return image;
  } catch {
    return null;
  }
}

export function markdownToHtml(markdown = "") {
  const normalized = String(markdown ?? "").replace(/\r\n?/g, "\n");
  if (!normalized.trim()) return "";
  const lines = normalized.split("\n");
  const html = [];

  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    const trimmed = line.trim();
    if (!trimmed) { index += 1; continue; }

    const image = parseImageDirective(trimmed);
    if (image) {
      html.push(`<figure class="sscare-inline-image" contenteditable="false" data-sscare-image="${escapeAttribute(JSON.stringify(image))}"><img src="${escapeAttribute(image.url)}" alt="${escapeAttribute(image.alt || "Ảnh bài viết")}" style="max-width:100%;height:auto"><figcaption>${escapeHtml(image.caption || image.alt || "")}</figcaption></figure>`);
      index += 1; continue;
    }

    const align = ALIGN_OPEN_RE.exec(trimmed);
    if (align) {
      const inner = [];
      index += 1;
      while (index < lines.length && lines[index].trim() !== ":::") { inner.push(lines[index]); index += 1; }
      if (index < lines.length) index += 1;
      html.push(`<div class="sscare-align-block" style="text-align:${align[1]}">${markdownToHtml(inner.join("\n"))}</div>`);
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(trimmed);
    if (heading) { const level = heading[1].length; html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`); index += 1; continue; }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) { quoteLines.push(lines[index].replace(/^\s*>\s?/, "")); index += 1; }
      html.push(`<blockquote>${quoteLines.map(renderInline).join("<br>")}</blockquote>`); continue;
    }

    if (isUnorderedList(line)) {
      const items = [];
      while (index < lines.length && isUnorderedList(lines[index])) { items.push(lines[index].replace(/^\s*[-+*]\s+/, "")); index += 1; }
      html.push(`<ul>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`); continue;
    }

    if (isOrderedList(line)) {
      const items = [];
      while (index < lines.length && isOrderedList(lines[index])) { items.push(lines[index].replace(/^\s*\d+[.)]\s+/, "")); index += 1; }
      html.push(`<ol>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ol>`); continue;
    }

    const paragraphLines = [trimmed]; index += 1;
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index])) { paragraphLines.push(lines[index].trim()); index += 1; }
    html.push(`<p>${paragraphLines.map(renderInline).join("<br>")}</p>`);
  }
  return html.join("");
}

export function clipboardHtmlToEditorHtml(html = "") {
  if (typeof DOMParser === "undefined" || !String(html).trim()) return "";
  const documentNode = new DOMParser().parseFromString(String(html), "text/html");
  const render = (node) => {
    if (!node) return "";
    if (node.nodeType === 3) return escapeHtml(node.nodeValue ?? "");
    if (node.nodeType !== 1) return "";
    const tag = node.tagName?.toUpperCase();
    const children = Array.from(node.childNodes ?? []).map(render).join("");
    const style = node.style;
    let wrapped = children;
    if (tag === "B" || tag === "STRONG" || /bold|[6-9]00/.test(style?.fontWeight || "")) wrapped = `<strong>${wrapped}</strong>`;
    if (tag === "I" || tag === "EM" || /italic|oblique/.test(style?.fontStyle || "")) wrapped = `<em>${wrapped}</em>`;
    if (tag === "U" || (style?.textDecorationLine || "").includes("underline")) wrapped = `<u>${wrapped}</u>`;
    const color = style?.color;
    if (color) wrapped = `<span style="color:${escapeAttribute(color)}">${wrapped}</span>`;
    if (tag === "A" && /^https?:\/\//i.test(node.getAttribute("href") || "")) wrapped = `<a href="${escapeAttribute(node.getAttribute("href"))}">${wrapped}</a>`;
    if (tag === "BR") return "<br>";
    if (["P", "DIV", "BLOCKQUOTE", "UL", "OL", "LI", "H1", "H2", "H3"].includes(tag)) {
      const align = style?.textAlign;
      return `<${tag.toLowerCase()}${align ? ` style="text-align:${escapeAttribute(align)}"` : ""}>${wrapped}</${tag.toLowerCase()}>`;
    }
    return wrapped;
  };
  return Array.from(documentNode.body.childNodes).map(render).join("");
}

function normalizeInlineText(value) { return value.replace(/\u00a0/g, " "); }
function serializeChildren(node) { return Array.from(node.childNodes ?? []).map(serializeNode).join(""); }
function escapeMarkdownText(value) { return value; }
function colorToHex(value) {
  const v = String(value || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(v)) return v.slice(1).toUpperCase();
  const rgb = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/i.exec(v);
  if (!rgb) return null;
  return [rgb[1], rgb[2], rgb[3]].map((n) => Math.max(0, Math.min(255, Number(n))).toString(16).padStart(2, "0")).join("").toUpperCase();
}
function wrapAlignment(markdown, node) {
  const align = node?.style?.textAlign;
  if (!align || align === "start" || align === "left") return markdown;
  return `:::align-${align}\n${markdown.trim()}\n:::\n\n`;
}
function serializeList(node, ordered) {
  const items = Array.from(node.children ?? []).filter((child) => child.tagName === "LI");
  return items.map((item, index) => `${ordered ? `${index + 1}.` : "-"} ${serializeChildren(item).replace(/\n{2,}/g, "\n").trim()}`).join("\n");
}
function serializeNode(node) {
  if (!node) return "";
  if (node.nodeType === 3) return normalizeInlineText(node.nodeValue ?? "");
  if (node.nodeType !== 1) return "";
  const tag = node.tagName;
  const content = () => serializeChildren(node);
  if (tag === "FIGURE" && node.dataset?.sscareImage) {
    try { const parsed = JSON.parse(node.dataset.sscareImage); return `:::sscare-image ${JSON.stringify(parsed)}\n\n`; } catch { return ""; }
  }
  switch (tag) {
    case "BR": return "\n";
    case "B": case "STRONG": { const text = content(); return text.trim() ? `**${text}**` : text; }
    case "I": case "EM": { const text = content(); return text.trim() ? `*${text}*` : text; }
    case "U": { const text = content(); return text.trim() ? `++${text}++` : text; }
    case "A": { const text = content(); const href = node.getAttribute("href") || ""; return /^https?:\/\//i.test(href) ? `[${text}](${href})` : text; }
    case "SPAN": case "FONT": {
      const text = content();
      const hex = colorToHex(node.style?.color || node.getAttribute("color"));
      return hex && text.trim() ? `[${escapeMarkdownText(text)}]{#${hex}}` : text;
    }
    case "H1": return wrapAlignment(`# ${content().trim()}\n\n`, node);
    case "H2": return wrapAlignment(`## ${content().trim()}\n\n`, node);
    case "H3": return wrapAlignment(`### ${content().trim()}\n\n`, node);
    case "BLOCKQUOTE": return wrapAlignment(`${content().trim().split("\n").map((line) => `> ${line.trim()}`).join("\n")}\n\n`, node);
    case "UL": return wrapAlignment(`${serializeList(node, false)}\n\n`, node);
    case "OL": return wrapAlignment(`${serializeList(node, true)}\n\n`, node);
    case "P": case "DIV": return wrapAlignment(`${content().trimEnd()}\n\n`, node);
    default: return content();
  }
}

export function editorElementToMarkdown(element) {
  if (!element) return "";
  return serializeChildren(element).replace(/[ \t]+\n/g, "\n").replace(/\n[ \t]+/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function markdownPlainTextLength(markdown = "") {
  return String(markdown ?? "")
    .replace(/^:::align-(?:left|center|right|justify)$/gm, "")
    .replace(/^:::$|^:::sscare-image\s+.*$/gm, "")
    .replace(/^#{1,3}\s+/gm, "").replace(/^>\s?/gm, "").replace(/^\s*[-+*]\s+/gm, "").replace(/^\s*\d+[.)]\s+/gm, "")
    .replace(/\*\*|__|\+\+/g, "").replace(/\[([^\]]+)]\{#[0-9A-Fa-f]{6}}/g, "$1").replace(/\[([^\]]+)]\(https?:\/\/[^)]+\)/g, "$1")
    .replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, "$1$2").replace(/(^|[^_])_([^_\n]+?)_(?!_)/g, "$1$2").length;
}

export function closestEditableBlock(editor) {
  if (!editor || typeof window === "undefined") return null;
  const selection = window.getSelection?.();
  if (!selection || selection.rangeCount === 0) return null;
  let node = selection.anchorNode;
  if (node?.nodeType === 3) node = node.parentElement;
  while (node && node !== editor) {
    if (["P", "DIV", "BLOCKQUOTE", "LI", "H1", "H2", "H3"].includes(node.tagName)) return node;
    node = node.parentElement;
  }
  return null;
}
