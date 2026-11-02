
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content", "timeline");
const OUTPUT_DIR = path.join(ROOT, "timeline");

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function imageUrl(value = "") {
  const src = String(value).trim();

  if (!src) return "";

  // Support image paths saved by the editor and existing site paths.
  if (/^(https?:\/\/|\/|data:)/i.test(src)) {
    return src;
  }

  return "/" + src.replace(/^\.?\//, "");
}

function renderDescription(value = "") {
  if (!value) return "";

  return String(value)
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

function renderItem(item = {}) {
  const src = imageUrl(item.image);
  const image = src
    ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(item.alt || "")}" loading="lazy">`
    : `<p class="missing-image">No photo selected yet.</p>`;

  return `
    <article class="photo">
      ${image}
      ${item.description ? `<div class="caption">${renderDescription(item.description)}</div>` : ""}
    </article>
  `;
}

function renderSection(section = {}) {
  const items = Array.isArray(section.items) ? section.items : [];
  const layout = section.layout === "single" ? "single" : "two";

  return `
    <section class="timeline-section">
      ${section.heading ? `<h2>${escapeHtml(section.heading)}</h2>` : ""}
      <div class="photo-grid ${layout}">
        ${items.map(renderItem).join("\n")}
      </div>
    </section>
  `;
}

function renderPage(page) {
  const title = escapeHtml(page.title || "Sights & Scenes");
  const date = escapeHtml(page.date || "");
  const intro = renderDescription(page.intro || "");
  const sections = Array.isArray(page.sections) ? page.sections : [];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}${date ? " | " + date : ""}</title>
  <link rel="stylesheet" href="/style.css">
  <style>
    .timeline-content { max-width: 1100px; margin: 30px auto; padding: 0 20px; }
    .timeline-content h1 { margin-bottom: 8px; }
    .timeline-date { margin-bottom: 24px; }
    .timeline-section { margin: 30px 0; }
    .photo-grid { display: grid; gap: 24px; align-items: start; }
    .photo-grid.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .photo-grid.single { grid-template-columns: minmax(0, 1fr); }
    .photo { min-width: 0; }
    .photo img { display: block; width: 100%; height: auto; }
    .caption p { margin: 10px 0; }
    .missing-image { padding: 24px; background: #f2f2f2; }
    @media (max-width: 650px) {
      .photo-grid.two { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <main class="timeline-content">
    <h1>${title}</h1>
    ${date ? `<p class="timeline-date">${date}</p>` : ""}
    ${intro ? `<div class="timeline-intro">${intro}</div>` : ""}
    ${sections.map(renderSection).join("\n")}
    <p><a href="/timeline.html">Back to Timeline</a></p>
  </main>
</body>
</html>`;
}

function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error("Timeline content folder not found:", CONTENT_DIR);
    process.exitCode = 1;
    return;
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = fs.readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".json"));

  if (files.length === 0) {
    console.log("No timeline JSON files found.");
    return;
  }

  let failed = false;

  for (const file of files) {
    try {
      const filePath = path.join(CONTENT_DIR, file);
      const page = JSON.parse(fs.readFileSync(filePath, "utf8"));

      if (!page.slug || !/^[a-z0-9-]+$/.test(page.slug)) {
        throw new Error("Slug must contain only lowercase letters, numbers, and hyphens.");
      }

      if (!page.title) {
        throw new Error("Page title is required.");
      }

      if (!Array.isArray(page.sections)) {
        throw new Error("The sections field must be a list.");
      }

      const outputPath = path.join(OUTPUT_DIR, `${page.slug}.html`);
      fs.writeFileSync(outputPath, renderPage(page), "utf8");

      console.log(`Generated: timeline/${page.slug}.html`);
    } catch (error) {
      failed = true;
      console.error(`Error processing ${file}: ${error.message}`);
    }
  }

  if (failed) process.exitCode = 1;
}

main();


