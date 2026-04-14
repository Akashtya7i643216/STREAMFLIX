// Generate a placeholder poster gradient based on title
export function posterPlaceholder(title = '') {
  const colors = [
    ['#1a1a2e', '#16213e'],
    ['#0f3460', '#533483'],
    ['#2d132c', '#ee4540'],
    ['#1b262c', '#0f4c75'],
    ['#2c003e', '#1a0533'],
  ]
  const idx = (title.charCodeAt(0) || 0) % colors.length
  return `linear-gradient(135deg, ${colors[idx][0]}, ${colors[idx][1]})`
}

export function truncate(str, n = 80) {
  if (!str) return ''
  return str.length > n ? str.slice(0, n) + '…' : str
}

export function formatYear(year) {
  if (!year) return ''
  return String(year).replace(/[()]/g, '')
}
