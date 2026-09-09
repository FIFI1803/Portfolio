/* Shape matches the `skills` table in Supabase (name, accent, icon_name).
   `group` is local-only: remote rows without it fall back to 'Technologies'. */
const g = (group, names) =>
  names.map(name => ({ id: `${group}-${name}`, name, group, accent: false, icon_name: null }))

export const skills = [
  ...g('Languages', ['JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML', 'CSS']),
  ...g('Frameworks & Libraries', ['SAP UI5', 'SAP Fiori', 'SAP CAP', 'React', 'Node.js']),
  ...g('Platforms & Services', ['SAP BTP', 'Cloud Foundry', 'OData', 'Git', 'GitHub', 'Docker', 'Linux', 'Vercel']),
  ...g('Developer Tools', ['SAP Business Application Studio', 'VS Code', 'Jira', 'Proxmox', 'Portainer']),
  ...g('Methodologies', ['Agile', 'Scrum', 'Test-Driven Development (TDD)', 'MVC Architecture']),
].map((s, i) => ({ ...s, sort_order: i + 1 }))
