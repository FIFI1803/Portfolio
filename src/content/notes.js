/* Shape matches the `notes` table. `url` null = draft (expands in place);
   set = the row becomes a link. Dates are ISO; rendered as DD.MM.YY. */
export const notes = [
  { id: 'n1', date: '2026-09-09', title: 'Why I’m rebuilding my portfolio',
    summary: 'The last version looked like every other developer portfolio. Notes on what I kept, what I cut, and why the type does most of the work now.', url: null },
  { id: 'n2', date: '2026-09-03', title: 'What I learned building my finance tracker',
    summary: 'Cosmos DB, Azure, and the gap between passing AZ-900 and actually deploying something.', url: null },
  { id: 'n3', date: '2026-08-28', title: 'Things I wish I knew before working with SAPUI5',
    summary: 'MVC, OData, async calls and the parts of Fiori nobody explains until you’ve shipped one.', url: null },
  { id: 'n4', date: '2026-08-21', title: 'Building a homelab from scratch',
    summary: 'Proxmox, Portainer, and what I’d do differently if I started again.', url: null },
]
