/* Local fallback for the single `site` row in Supabase. Column names match
   the table exactly so the remote row can be merged straight over this. */
export const site = {
  id: 1,
  name: 'Filip Galach',
  tagline: 'I build software, experiment with technology, and turn ideas into things people can actually use.',
  role: 'Software Developer',
  company: 'SAP',
  focus: 'UI / Full Stack',
  location: 'Dublin, Ireland',
  location_short: 'Dublin / IE',
  availability: 'Open to roles and freelance work',
  email: 'filipgalach@gmail.com',
  github: 'https://github.com/FIFI1803',
  linkedin: 'https://linkedin.com/in/filip-galach',
  cv_url: '/filip-galach-cv.pdf',
  about_statement: 'I didn’t take the traditional route into software. I found it, committed to it, and started building.',
  about_body: [
    'I moved to Ireland as a kid, went through school in Dublin, and came out the other side with no plan that involved code. The first real job was running shifts as a duty manager — a team of ten, stock, cash, complaints, the lot. Useful, but not where I wanted to end up.',
    'So I made a hard pivot. Evenings of self-study, a stack of IBM SkillsBuild courses, then a software development apprenticeship that put me in front of real problems fast. That led to SAP, where I work on the Software Asset Management team building internal Fiori applications with UI5, CAP and OData — forecasting tools, analytics dashboards, the kind of software that has to be right because finance teams depend on it.',
    'Outside work I build my own things: a finance tracker, a tool for creators, a homelab that mostly behaves. That’s where I get to make the product decisions myself and try ideas that would never make it past an enterprise backlog.',
  ].join('\n\n'),
  now_updated: 'Sep 2026',
}
