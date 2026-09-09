const GROUNDS = {
  light: 'bg-paper text-ink-2',
  dark: 'bg-noir text-noir-ink-2 on-noir',
}

const Section = ({ id, ground = 'light', className = '', children }) => (
  <section id={id} className={`w-full ${GROUNDS[ground]} ${className}`}>
    <div className="mx-auto w-full max-w-[1240px] px-6 py-24 md:px-10 md:py-32 lg:px-14 lg:py-40">
      {children}
    </div>
  </section>
)

export default Section
