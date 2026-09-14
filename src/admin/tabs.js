/* Table configs for CrudTab. Field types: text | textarea | tags | lines |
   select | toggle | date. See CrudTab.jsx for what each one stores. */

export const projects = {
  table: 'projects',
  singular: 'project',
  reorder: true,
  summary: (p) => ({ title: p.name, sub: [p.year, (p.tags || []).join(', ')].filter(Boolean).join(' · '), muted: p.featured === false }),
  fields: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'kind', label: 'One-line kind', type: 'text', placeholder: 'Enterprise forecasting application', nullable: true },
    { key: 'description', label: 'Description', type: 'textarea', rows: 5 },
    { key: 'tags', label: 'Technology', type: 'tags', placeholder: 'SAPUI5, Fiori, CAP, BTP' },
    { key: 'year', label: 'Year', type: 'text', placeholder: '2026 or Ongoing', nullable: true },
    { key: 'visual', label: 'Visual (when there is no image)', type: 'select', default: 'mark',
      options: [['forecast', 'Forecast — step line'], ['ledger', 'Ledger — rows'], ['grid', 'Grid — tiles'], ['mark', 'Mark — letterform']] },
    { key: 'image_url', label: 'Image URL', type: 'text', placeholder: 'https://…', nullable: true, hint: 'Optional. Replaces the visual.' },
    { key: 'link', label: 'Link', type: 'text', placeholder: 'https://…', default: '#', hint: 'Use # for no link.' },
    { key: 'featured', label: 'Show on site', type: 'toggle', default: true },
  ],
}

export const experience = {
  table: 'experience',
  singular: 'role',
  reorder: true,
  summary: (r) => ({ title: `${r.role} — ${r.company}`, sub: r.period }),
  fields: [
    { key: 'role', label: 'Role', type: 'text', required: true },
    { key: 'company', label: 'Company', type: 'text', required: true },
    { key: 'period', label: 'Period', type: 'text', placeholder: 'Dec 2024 — Present', required: true },
    { key: 'location', label: 'Location', type: 'text', placeholder: 'Dublin, Ireland' },
    { key: 'bullets', label: 'What you did', type: 'lines', rows: 8 },
  ],
}

export const education = {
  table: 'education',
  singular: 'entry',
  reorder: true,
  summary: (e) => ({ title: e.title, sub: `${e.type} · ${e.subtitle} · ${e.period}` }),
  fields: [
    { key: 'type', label: 'Type', type: 'select', default: 'education',
      options: [['education', 'Education'], ['certification', 'Certification']] },
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'subtitle', label: 'Institution / issuer', type: 'text', required: true },
    { key: 'period', label: 'Period', type: 'text', placeholder: 'Oct 2024 — Oct 2026', required: true },
    { key: 'verify_url', label: 'Verify URL', type: 'text', placeholder: 'https://…', nullable: true },
  ],
}

export const skills = {
  table: 'skills',
  singular: 'skill',
  reorder: true,
  summary: (s) => ({ title: s.name, sub: s.group || 'Other' }),
  fields: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'group', label: 'Group', type: 'text', placeholder: 'Languages', nullable: true,
      hint: 'Rows with the same group are listed together, in the order they appear here.' },
    { key: 'accent', label: 'Emphasise', type: 'toggle', default: false, hint: 'Shown in medium weight.' },
  ],
}

export const now = {
  table: 'now_items',
  singular: 'item',
  reorder: true,
  summary: (n) => ({ title: n.item, sub: n.category }),
  fields: [
    { key: 'category', label: 'Column', type: 'select', default: 'working',
      options: [['working', 'Working on'], ['learning', 'Learning'], ['exploring', 'Exploring']] },
    { key: 'item', label: 'Item', type: 'text', required: true },
  ],
}

export const notes = {
  table: 'notes',
  singular: 'note',
  order: { column: 'date', ascending: false },
  summary: (n) => ({ title: n.title, sub: [n.date, n.url ? 'link' : 'draft'].join(' · ') }),
  fields: [
    { key: 'date', label: 'Date', type: 'date', required: true },
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'summary', label: 'Summary', type: 'textarea', rows: 3, hint: 'Shown when a draft row is expanded.' },
    { key: 'url', label: 'URL', type: 'text', placeholder: 'https://…', nullable: true,
      hint: 'Leave empty for a draft. Add a link once it’s published.' },
  ],
}
