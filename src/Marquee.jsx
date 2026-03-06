const items = [
    'React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL',
    'Docker', 'GSAP', 'Tailwind CSS', 'REST APIs', 'Git', 'FastAPI', 'WebSockets',
]

const Marquee = ({ reverse = false }) => (
    <div className="relative z-[6] overflow-hidden py-3 border-y border-brand-border/40 select-none">
        <div
            className="flex whitespace-nowrap w-max"
            style={{
                animation: `marquee 28s linear infinite ${reverse ? 'reverse' : ''}`,
            }}
        >
            {[...items, ...items, ...items, ...items].map((item, i) => (
                <span
                    key={i}
                    className="inline-flex items-center gap-5 px-5 text-muted/50 font-syne text-[11px] tracking-[0.22em] uppercase"
                >
                    {item}
                    <span className="text-ember/50 text-base leading-none">·</span>
                </span>
            ))}
        </div>
    </div>
)

export default Marquee
