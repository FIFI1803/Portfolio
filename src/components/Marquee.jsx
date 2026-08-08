const items = [
    'SAP UI5', 'JavaScript', 'TypeScript', 'React',
    'SAP Fiori', 'OData', 'ABAP', 'Node.js',
    'Tailwind CSS', 'Git', 'Docker', 'Cloud Foundry',
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
