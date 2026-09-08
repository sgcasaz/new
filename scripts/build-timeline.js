const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content", "timeline");
const OUTPUT_DIR = path.join(ROOT, "timeline");

function esc(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function markdownToHtml(value = "") {
  // Intentionally simple: paragraphs and line breaks are enough for this legacy page.
  return String(value)
    .trim()
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map(p => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

function imageHtml(src, alt = "") {
  if (!src) return "";
  return `<img src="/${src.replace(/^\/+/, "")}" alt="${esc(alt)}">`;
}

function render(data) {
  const sections = (data.sections || []).map(section => {
    const left = `
      <div class="photo-column">
        ${imageHtml(section.leftImage, data.title)}
        ${section.leftCaption ? `<div class="caption">${markdownToHtml(section.leftCaption)}</div>` : ""}
      </div>`;

    const right = `
      <div class="photo-column">
        ${imageHtml(section.rightImage, data.title)}
        ${section.rightCaption ? `<div class="caption">${markdownToHtml(section.rightCaption)}</div>` : ""}
      </div>`;

    return `<section class="photo-grid">${left}${right}</section>`;
  }).join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(data.title)}${data.date ? ` | ${esc(data.date)}` : ""}</title>
  <link rel="stylesheet" href="/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet">
  <style>
    .timeline-page-content { max-width: 1120px; margin: 0 auto; padding: 30px 20px 60px; }
    .timeline-intro { font-size: 1.05rem; line-height: 1.8; margin-bottom: 35px; }
    .photo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; margin: 0 0 42px; align-items: start; }
    .photo-column { text-align: center; }
    .photo-column img { display: block; width: 100%; height: auto; max-width: 550px; margin: 0 auto; }
    .caption { line-height: 1.6; margin-top: 12px; }
    .caption p { margin: 0; }
    .back-section { padding: 25px 20px; text-align: center; }
    @media (max-width: 760px) {
      .photo-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div id="header"></div>

  <section class="inner-hero">
    <div class="container">
      <h1>${esc(data.title)}</h1>
      ${data.date ? `<p>${esc(data.date)}</p>` : ""}
    </div>
  </section>

  <main class="timeline-page-content">
    ${data.intro ? `<div class="timeline-intro">${markdownToHtml(data.intro)}</div>` : ""}
    ${sections}
  </main>

  <section class="back-section">
    <div class="container">
      <a href="/timeline.html" class="back-button">
        <i class="fa-solid fa-arrow-left"></i> Back to Our Timeline
      </a>
    </div>
  </section>

  <div id="footer"></div>

  <script src="/script.js"></script>
  <script src="/include.js"></script>
</body>
</html>`;
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

for (const filename of fs.readdirSync(CONTENT_DIR)) {
  if (!filename.endsWith(".json")) continue;

  const filePath = path.join(CONTENT_DIR, filename);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (!data.slug) {
    console.warn(`Skipping ${filename}: missing slug`);
    continue;
  }

  const outputPath = path.join(OUTPUT_DIR, `${data.slug}.html`);
  fs.writeFileSync(outputPath, render(data), "utf8");
  console.log(`Generated ${path.relative(ROOT, outputPath)}`);
}
