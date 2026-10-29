// Layout maths for the architecture thumbnails (FlowThumb.astro). Pure functions.

/**
 * Split a label into at most two lines of about `max` characters.
 * @param {string} label
 * @param {number} [max]
 * @returns {string[]}
 */
export const wrapLabel = (label, max = 13) => {
  if (label.length <= max) return [label];
  /** @type {string[]} */
  const lines = [''];
  for (const word of label.split(' ')) {
    const current = lines[lines.length - 1];
    if (`${current} ${word}`.trim().length <= max || lines.length === 2) lines[lines.length - 1] = `${current} ${word}`.trim();
    else lines.push(word);
  }
  return lines.slice(0, 2);
};

/**
 * Lay a list of steps out as a "snake": up to three per row, the second row flows right to left.
 * @param {string[]} labels
 * @param {{width?: number, height?: number}} [size]
 */
export const layoutFlow = (labels, { width = 360, height = 225 } = {}) => {
  const n = labels.length;
  const cols = Math.max(1, n <= 3 ? n : Math.ceil(n / 2));
  const rows = n <= 3 ? 1 : 2;
  const cell = width / cols;
  const bw = Math.min(100, cell - 22);
  const bh = 44;
  const rowY = rows === 1 ? [height / 2] : [height * 0.32, height * 0.7];
  const nodes = labels.map((label, i) => {
    const row = i < cols ? 0 : 1;
    const inRow = row === 0 ? i : i - cols;
    const col = row === 0 ? inRow : cols - 1 - inRow;
    return { i, x: cell * (col + 0.5), y: rowY[row], lines: wrapLabel(label) };
  });
  const edges = nodes.slice(0, -1).map((a, k) => {
    const b = nodes[k + 1];
    const sameRow = Math.abs(a.y - b.y) < 1;
    const dir = b.x > a.x ? 1 : -1;
    const d = sameRow
      ? `M${a.x + (dir * bw) / 2} ${a.y} L${b.x - (dir * bw) / 2 - dir * 3} ${b.y}`
      : `M${a.x} ${a.y + bh / 2} L${b.x} ${b.y - bh / 2 - 3}`;
    return { d };
  });
  return { nodes, edges, bw, bh, width, height };
};
