// Mirrors SectionToBlocksConverter on the server so the preview shows the markdown the app
// will actually receive. Preview has to work before the article is saved, so it cannot ask
// the server for the conversion; keep the two in step.
const CONCLUSION_ID = "conclusion";

function sectionMarkdown(section) {
  let markdown = "";

  if (section?.title?.trim()) {
    markdown += `## ${section.title.trim()}\n\n`;
  }
  if (section?.content) {
    markdown += section.content.trim();
  }

  return markdown.trim();
}

export function buildContentBlocks(sections, conclusion) {
  const blocks = [];

  (Array.isArray(sections) ? sections : []).forEach((section, index) => {
    if (!section) return;

    const markdown = sectionMarkdown(section);
    if (markdown) {
      blocks.push({ id: `sec-${index}`, markdown });
    }
  });

  if (conclusion?.trim()) {
    blocks.push({ id: CONCLUSION_ID, markdown: conclusion.trim() });
  }

  return blocks;
}

// Mirrors ReadMinutesCalculator on the server: markdown punctuation is stripped before
// counting so syntax does not inflate the estimate.
export function estimateReadMinutes(blocks) {
  const words = blocks
    .map((block) => block.markdown.replace(/^:::sscare-image\s+.*$/gm, " ").replace(/^:::align-(?:left|center|right|justify)$|^:::$|[#*_>`~[\]()!+{}]/gm, " "))
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / 200));
}
