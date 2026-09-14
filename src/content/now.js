/* Shape matches the `now_items` table. */
const rows = (category, items) =>
  items.map((item, i) => ({ id: `${category}-${i}`, category, item, sort_order: i + 1 }))

export const now = [
  ...rows('working', ['SAP Fiori applications', 'Personal finance tracker', 'B-Social']),
  ...rows('learning', ['Azure', 'Full-stack architecture', 'Product design']),
  ...rows('exploring', ['Music production', 'Blender / 3D', 'Automation', 'AI']),
]

export const NOW_COLUMNS = [
  ['working', 'Working on'],
  ['learning', 'Learning'],
  ['exploring', 'Exploring'],
]
