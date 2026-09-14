/* Shape matches the `projects` table. `visual` picks the CSS treatment in
   ProjectVisual when there is no `image_url`; `featured` controls whether a
   row appears on the site. Local fallback only — Supabase is the editor. */
export const projects = [
  {
    id: 'forecasting',
    name: 'Forecasting',
    kind: 'Enterprise forecasting application',
    description:
      'Forecasting app for SAP’s Software Asset Management team, built in SAP UI5 on OData. Notification strips that know whether a period is open or frozen, a rolling four-period fiscal history filter, and a 79-case UAT plan covering role-based access and edge cases.',
    tags: ['SAPUI5', 'Fiori', 'CAP', 'BTP'],
    year: '2025',
    image_url: null,
    link: null,
    featured: true,
    visual: 'forecast',
  },
  {
    id: 'finance',
    name: 'Personal Finance',
    kind: 'Personal finance tracker',
    description:
      'A tracker for my own money: income, spending and where it actually goes each month. React on the front, a Node API behind it, Cosmos DB on Azure. The project I’m using to learn Azure properly.',
    tags: ['React', 'Node', 'Azure', 'Cosmos DB'],
    year: '2026',
    image_url: null,
    link: null,
    featured: true,
    visual: 'ledger',
  },
  {
    id: 'b-social',
    name: 'B-Social',
    kind: 'Social media management for creators',
    description:
      'A social media management platform for creators — planning, drafting and scheduling posts in one place. Full-stack React, and the first project where the product decisions mattered as much as the code.',
    tags: ['React', 'Full Stack', 'Product'],
    year: '2026',
    image_url: null,
    link: null,
    featured: true,
    visual: 'grid',
  },
  {
    id: 'arctive',
    name: 'Arctive',
    kind: 'Creative technology / brand experiment',
    description:
      'A creative technology and brand experiment. No client and no brief — a place to try the design, motion and 3D ideas that have no home in an enterprise app.',
    tags: ['Design', 'Creative Tech'],
    year: 'Ongoing',
    image_url: null,
    link: null,
    featured: true,
    visual: 'mark',
  },
]
