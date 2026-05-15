/**
 * Tiny zero-dependency markdown renderer.
 * Supports headings, bold, italics, inline code, and bullet lists —
 * enough for a clean preview without pulling a heavy library.
 */
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

function toHtml(md) {
  const lines = (md || '').split('\n');
  const out = [];
  let inList = false;

  for (const line of lines) {
    const heading = line.match(/^(#{1,3})\s+(.*)/);
    const bullet = line.match(/^\s*[-*]\s+(.*)/);

    if (bullet) {
      if (!inList) {
        out.push('<ul>');
        inList = true;
      }
      out.push(`<li>${inline(bullet[1])}</li>`);
      continue;
    }
    if (inList) {
      out.push('</ul>');
      inList = false;
    }

    if (heading) {
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
    } else if (line.trim() === '') {
      out.push('<br/>');
    } else {
      out.push(`<p>${inline(line)}</p>`);
    }
  }
  if (inList) out.push('</ul>');
  return out.join('');
}

export default function Markdown({ source, className = '' }) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: toHtml(source) }}
    />
  );
}
