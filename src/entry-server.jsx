import { renderToString } from 'react-dom/server'
import App from './App.jsx'

/**
 * Server entry used only by scripts/prerender.mjs at build time.
 *
 * The home page needs no router context — Navigation uses plain anchor links —
 * so App renders directly. Effects never run during renderToString, which is
 * what keeps the GSAP and window-dependent code out of the way here.
 */
export const render = () => renderToString(<App />)
