/* Shape matches the `skills` table (name, group, accent, icon_name). */
const g = (group, names) =>
  names.map(name => ({ id: `${group}-${name}`, name, group, accent: false, icon_name: null }))

export const skills = [
  ...g('Languages', ['JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML', 'CSS']),
  ...g('Frameworks & Libraries', ['SAP UI5', 'SAP Fiori', 'SAP CAP', 'React', 'Node.js', 'Tailwind CSS']),
  ...g('Tools & Platforms', ['SAP BTP', 'Cloud Foundry', 'OData', 'Git', 'GitHub', 'Docker', 'Linux', 'Vercel', 'Proxmox', 'Portainer']),
  ...g('Ways of working', ['Agile', 'Scrum', 'TDD', 'MVC']),
].map((s, i) => ({ ...s, sort_order: i + 1 }))
