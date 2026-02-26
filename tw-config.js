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
            },
            boxShadow: {
                'neon-cyan': '0 0 20px rgba(0,242,255,0.4), 0 0 60px rgba(0,242,255,0.1)',
                'neon-pink': '0 0 20px rgba(255,0,229,0.4), 0 0 60px rgba(255,0,229,0.1)',
                'neon-green': '0 0 20px rgba(57,255,20,0.4),  0 0 60px rgba(57,255,20,0.1)',
            },
        }
    }
};
