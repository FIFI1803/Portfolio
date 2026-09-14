import { useSite } from '../lib/useContent'
import { site as localSite } from '../content'

const Footer = () => {
  const site = useSite(localSite)
  return (
  <footer className="border-t border-rule px-gutter">
    <div className="meta mx-auto grid max-w-[1600px] grid-cols-12 gap-x-5 gap-y-3 py-8 text-ink-2">
      <p className="col-span-6 md:col-span-4">© {new Date().getFullYear()} {site.name}</p>
      <p className="col-span-6 md:col-span-4">{site.location_short}</p>
      <p className="col-span-12 md:col-span-4 md:text-right">React / Vite / Tailwind</p>
    </div>
  </footer>
  )
}

export default Footer
