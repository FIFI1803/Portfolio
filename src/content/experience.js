/* Shape matches the `experience` table in Supabase exactly. Bullets are
   verbatim from Filip's CV. */
export const experience = [
  {
    id: 'sap',
    role: 'iXP Student — Software Developer',
    company: 'SAP — Software Asset Management (SAM) Team',
    period: 'Dec 2024 — Present',
    location: 'Dublin, Ireland',
    logo_url: null,
    sort_order: 1,
    bullets: [
      'Developed a Forecasting application using SAP UI5 with MVC architecture and OData services; implemented dynamic UI components including notification strips with conditional logic for open/frozen forecast periods',
      'Designed and executed a 79-case UAT plan covering edge cases, role-based access (SPM vs Finance), and UI validation; coordinated testing across multiple stakeholders',
      'Built Variable Management for the IO Analysis Report (MVP2), enabling users to save/reuse custom filter combinations — proposed this flexible solution over the originally requested static filters',
      'Implemented complex frontend logic including rolling 4-period fiscal history filters, asynchronous OData calls with Promise handling, and frontend data validation before backend submission',
      'Currently leading front-end development of the Publisher 360 Dashboard, a comprehensive analytics view for software publishers',
      'Collaborated in Agile/Scrum with bi-daily stand-ups, monthly sprint planning, and retrospectives; deployed apps on SAP BTP Cloud Foundry',
    ],
  },
  {
    id: 'ssp',
    role: 'Duty Manager',
    company: 'SSP Ireland & UK',
    period: 'May 2022 — Jul 2024',
    location: 'Dublin, Ireland',
    logo_url: null,
    sort_order: 2,
    bullets: [
      'Supervised and trained a team of 10 staff; managed daily operations including stock control, cash reconciliation, and health & safety compliance',
      'Resolved customer complaints promptly and maintained service standards across high-volume shifts',
    ],
  },
]
