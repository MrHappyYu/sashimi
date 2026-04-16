// Converts 简历.md → 简历.pdf via Edge headless
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// ── 1. Read markdown ──────────────────────────────────────────────────────────
const md = fs.readFileSync('简历.md', 'utf8')

// ── 2. Minimal markdown → HTML (no deps) ─────────────────────────────────────
function mdToHtml(text) {
  let html = text
  // Escape HTML special chars first (only in non-code contexts is complex; keep simple)
  // Code blocks (``` ```)
  html = html.replace(/```[\w]*\n([\s\S]*?)```/gm, '<pre><code>$1</code></pre>')
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  // H1-H3
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr>')
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // Table rows: detect lines with |
  html = html.replace(/^\|(.+)\|$/gm, (line) => {
    const cells = line.split('|').slice(1, -1)
    // separator row
    if (cells.every(c => /^[-: ]+$/.test(c))) return '<tr class="sep"></tr>'
    return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>'
  })
  // Wrap consecutive <tr> blocks in <table>
  html = html.replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, match => {
    // Remove separator rows
    const cleaned = match.replace(/<tr class="sep"><\/tr>\n?/g, '')
    if (!cleaned.trim()) return ''
    // First row becomes thead
    const rows = cleaned.match(/<tr>[\s\S]*?<\/tr>/g) || []
    if (rows.length === 0) return ''
    const thead = rows[0].replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>')
    const tbody = rows.slice(1).join('\n')
    return `<table><thead>${thead}</thead><tbody>${tbody}</tbody></table>`
  })
  // Blockquote
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
  // Unordered list items
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, match => `<ul>${match}</ul>`)
  // Paragraphs: lines not already in HTML tags
  html = html.split('\n').map(line => {
    if (!line.trim()) return ''
    if (/^<[a-z]/.test(line.trim())) return line
    return `<p>${line}</p>`
  }).join('\n')
  return html
}

const body = mdToHtml(md)

// ── 3. Full HTML with print-ready CSS ────────────────────────────────────────
const htmlContent = `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", Arial, sans-serif;
    font-size: 13px;
    line-height: 1.7;
    color: #1a1a1a;
    padding: 32px 40px;
    max-width: 860px;
    margin: 0 auto;
  }
  h1 { font-size: 22px; color: #1d1d1d; margin-bottom: 4px; }
  h2 {
    font-size: 15px;
    color: #1a56db;
    border-bottom: 1.5px solid #1a56db;
    padding-bottom: 3px;
    margin: 18px 0 8px;
  }
  h3 { font-size: 13.5px; color: #333; margin: 14px 0 6px; }
  p { margin-bottom: 5px; }
  ul { padding-left: 18px; margin-bottom: 8px; }
  li { margin-bottom: 3px; }
  blockquote {
    border-left: 3px solid #1a56db;
    padding: 4px 10px;
    color: #555;
    background: #f4f8ff;
    margin: 8px 0;
    font-size: 12px;
  }
  hr { border: none; border-top: 1px solid #ddd; margin: 16px 0; }
  code {
    background: #f5f5f5;
    padding: 1px 4px;
    border-radius: 3px;
    font-family: Consolas, monospace;
    font-size: 12px;
  }
  pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; margin: 8px 0; }
  pre code { background: none; padding: 0; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 12px;
    font-size: 12px;
  }
  th {
    background: #1a56db;
    color: #fff;
    padding: 5px 8px;
    text-align: left;
    font-weight: 600;
  }
  td { padding: 4px 8px; border-bottom: 1px solid #e5e7eb; }
  tr:nth-child(even) td { background: #f9fafb; }
  strong { color: #1a1a1a; }
  @media print {
    body { padding: 0; }
    h2 { page-break-after: avoid; }
    table { page-break-inside: avoid; }
  }
</style>
</head>
<body>
${body}
</body>
</html>`

const htmlPath = path.resolve('简历_temp.html')
const pdfPath  = path.resolve('简历.pdf')

fs.writeFileSync(htmlPath, htmlContent, 'utf8')
console.log('HTML written:', htmlPath)

// ── 4. Edge headless → PDF ────────────────────────────────────────────────────
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const cmd = `"${edgePath}" --headless --disable-gpu --print-to-pdf="${pdfPath}" "file:///${htmlPath.replace(/\\/g,'/')}"`
console.log('Running Edge headless...')
execSync(cmd, { stdio: 'inherit' })

console.log('PDF created:', pdfPath)
fs.unlinkSync(htmlPath)
