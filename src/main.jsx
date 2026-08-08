import { StrictMode, lazy, Suspense } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// The admin panel and its Supabase auth flow are useless to visitors, so they
// load on demand instead of riding along in the main bundle.
const Admin = lazy(() => import('./admin/Admin.jsx'))

// Inline rather than a named component: this file is the app entry, and a
// second component export here breaks Fast Refresh.
const adminFallback = (
    <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-ember border-t-transparent rounded-full animate-spin" />
    </div>
)

const tree = (
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route
                    path="/admin"
                    element={
                        <Suspense fallback={adminFallback}>
                            <Admin />
                        </Suspense>
                    }
                />
            </Routes>
        </BrowserRouter>
    </StrictMode>
)

const container = document.getElementById('root')

// The home page ships prerendered, so adopt that markup instead of throwing it
// away. Any other route (or a stale shell) renders from scratch.
if (container.hasChildNodes() && window.location.pathname === '/') {
    hydrateRoot(container, tree)
} else {
    createRoot(container).render(tree)
}
