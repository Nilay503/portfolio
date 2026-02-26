/**
 * tw-config.js
 * Shared Tailwind CSS configuration for all pages.
 * Loaded AFTER the Tailwind CDN script on every HTML file.
 */
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'neon-cyan': '#00f2ff',
                'neon-pink': '#ff00e5',
                'neon-green': '#39ff14',
                'neon-purple': '#a855f7',
                'bg-dark': '#050508',
                'bg-card': '#0a0a14',
            },
            fontFamily: {
                mono: ['"JetBrains Mono"', 'monospace'],
                sans: ['Inter', 'sans-serif'],
            }
        }
    }
}