/* Shape matches the `projects` table in Supabase exactly, so remote rows can
   replace these without the section breaking. Copy is Filip's own, from CV. */
export const projects = [
  {
    id: 'forever',
    name: 'FOREVER',
    description:
      'Full-stack web application showcasing end-to-end development skills including front-end design, back-end logic, and database integration.',
    tags: ['Full Stack', 'React', 'Node.js'],
    image_url: null,
    link: null,
    sort_order: 1,
  },
  {
    id: 'portfolio',
    name: 'Portfolio Website',
    description:
      'Personal developer portfolio deployed on Vercel at filipgalach.dev, showcasing projects and professional profile.',
    tags: ['React', 'Tailwind CSS', 'Vercel'],
    image_url: null,
    link: 'https://filipgalach.dev',
    sort_order: 2,
  },
]
