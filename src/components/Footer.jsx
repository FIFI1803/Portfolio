import { profile } from '../content'

const Footer = () => (
  <footer className="on-noir border-t border-noir-rule bg-noir">
    <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10 lg:px-14">
      <p className="meta text-noir-ink-3">
        © {new Date().getFullYear()} {profile.name} · {profile.location}
      </p>
      <p className="meta text-noir-ink-3">Built with React, Tailwind and Vite</p>
    </div>
  </footer>
)

export default Footer
