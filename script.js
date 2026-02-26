/* =============================================
   SCRIPT.JS — Physics Sandbox Portfolio
   Using Matter.js + Bootstrap 5 + Tailwind
============================================= */

window.addEventListener('load', function () {
    try {

        const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

        // ── Engine Setup ──────────────────────────────
        const engine = Engine.create({ gravity: { y: 1.2 } });

        const render = Render.create({
            element: document.getElementById('canvas-container'),
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: 'transparent'
            }
        });

        // ── Project Data ──────────────────────────────
        const projects = [
            {
                name: "Neon Flip",
                color: "#00f2ff",
                desc: "A physics-based arcade game built with Matter.js. Flip neon tiles and beat the clock in an increasingly chaotic playground.",
                tags: ["Matter.js", "JavaScript", "Game Dev"],
                link: "#"
            },
            {
                name: "PharmaNet",
                color: "#ff00e5",
                desc: "A full-stack pharmaceutical delivery dashboard for managing inventory, orders, and real-time delivery tracking.",
                tags: ["Python", "React", "PostgreSQL"],
                link: "#"
            },
            {
                name: "CyberSec Bot",
                color: "#39ff14",
                desc: "Automation toolkit for security audits — performs vulnerability scanning, port analysis, and generates detailed PDF reports.",
                tags: ["Python", "Nmap", "Security"],
                link: "#"
            }
        ];

        // ── World Boundaries ──────────────────────────
        const W = window.innerWidth;
        const H = window.innerHeight;

        const walls = [
            Bodies.rectangle(W / 2, H + 25, W, 50, { isStatic: true, render: { visible: false } }),       // floor
            Bodies.rectangle(-25, H / 2, 50, H, { isStatic: true, render: { visible: false } }),       // left
            Bodies.rectangle(W + 25, H / 2, 50, H, { isStatic: true, render: { visible: false } })        // right
        ];
        Composite.add(engine.world, walls);

        // ── Create Project Blocks ─────────────────────
        const BLOCK_W = 210, BLOCK_H = 90;

        const blocks = projects.map((p, i) => {
            const b = Bodies.rectangle(180 + (i * 340), 220, BLOCK_W, BLOCK_H, {
                restitution: 0.55,
                friction: 0.2,
                chamfer: { radius: 4 },
                render: {
                    fillStyle: 'rgba(255,255,255,0.04)',
                    strokeStyle: p.color,
                    lineWidth: 1.5
                }
            });
            b.projectData = p;
            return b;
        });
        Composite.add(engine.world, blocks);

        // ── Label Overlay ─────────────────────────────
        const labelsContainer = document.getElementById('block-labels');
        const labelEls = blocks.map((b, i) => {
            const div = document.createElement('div');
            div.className = 'block-label';
            div.innerHTML = `
        <div style="
            font-family:'JetBrains Mono',monospace;
            font-size:.65rem; font-weight:700;
            letter-spacing:2px; text-transform:uppercase;
            color:${projects[i].color};
            text-shadow:0 0 12px ${projects[i].color}80;
            margin-bottom:2px;">
            ${projects[i].name}
        </div>
        <div style="
            font-size:.52rem; color:rgba(255,255,255,.4);
            letter-spacing:1px; text-transform:uppercase;">
            ${projects[i].tags[0]}
        </div>`;
            labelsContainer.appendChild(div);
            return div;
        });

        // ── Mouse Constraints ─────────────────────────
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse,
            constraint: { stiffness: 0.18, angularStiffness: 0.2, render: { visible: false } }
        });
        Composite.add(engine.world, mouseConstraint);

        // ── Click → Open Modal ────────────────────────
        Events.on(mouseConstraint, 'mousedown', function (event) {
            const body = event.source.body;
            if (body && body.projectData) {
                showModal(body.projectData);
            }
        });

        // ── Custom Cursor ─────────────────────────────
        const cursor = document.getElementById('cursor');
        const cursorRing = document.getElementById('cursor-ring');
        let mx = 0, my = 0, rx = 0, ry = 0;

        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            cursor.style.left = mx + 'px';
            cursor.style.top = my + 'px';
        });

        // Lazy ring movement via rAF
        (function moveCursorRing() {
            rx += (mx - rx) * 0.14;
            ry += (my - ry) * 0.14;
            cursorRing.style.left = rx + 'px';
            cursorRing.style.top = ry + 'px';
            requestAnimationFrame(moveCursorRing);
        })();

        document.querySelectorAll('button, a, .close').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '18px';
                cursor.style.height = '18px';
                cursor.style.background = 'var(--pink, #ff00e5)';
                cursorRing.style.transform = 'translate(-50%,-50%) scale(1.5)';
                cursorRing.style.borderColor = 'rgba(255,0,229,.4)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '10px';
                cursor.style.height = '10px';
                cursor.style.background = 'var(--cyan, #00f2ff)';
                cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
                cursorRing.style.borderColor = 'rgba(0,242,255,.45)';
            });
        });

        // ── Modal Logic ───────────────────────────────
        function showModal(data) {
            const modal = document.getElementById('project-modal');
            document.getElementById('modal-title').innerText = data.name;
            document.getElementById('modal-desc').innerText = data.desc;
            document.getElementById('modal-link').href = data.link;

            // Tags
            const tagsEl = document.getElementById('modal-tags');
            tagsEl.innerHTML = data.tags
                .map(t => `<span class="tag">${t}</span>`)
                .join('');

            modal.style.display = 'block';
            // Animate in
            setTimeout(() => modal.classList.add('visible'), 10);
        }

        function closeModal() {
            const modal = document.getElementById('project-modal');
            modal.style.display = 'none';
            modal.classList.remove('visible');
        }

        document.getElementById('closeModal').onclick = closeModal;

        // Close on backdrop click
        document.getElementById('project-modal').addEventListener('click', function (e) {
            if (e.target === this) closeModal();
        });

        // ── Render Loop + Label Sync ──────────────────
        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        Events.on(engine, 'afterUpdate', () => {
            blocks.forEach((b, i) => {
                const { x, y } = b.position;
                const label = labelEls[i];
                label.style.left = x + 'px';
                label.style.top = y + 'px';

                // Rotate label with block
                const angle = b.angle * (180 / Math.PI);
                label.style.transform = `translate(-50%,-50%) rotate(${angle}deg)`;
            });
        });

        // ── Close intro screen ────────────────────────
        document.getElementById('closeBtn').addEventListener('click', function () {
            const intro = document.getElementById('intro-screen');
            intro.style.transition = 'opacity .5s ease, transform .5s ease';
            intro.style.opacity = '0';
            intro.style.transform = 'scale(1.08)';
            setTimeout(() => { intro.style.display = 'none'; }, 500);
        });

        // ── Navigate function ─────────────────────────
        function navigate(destination) {
            const intro = document.getElementById('intro-screen');

            intro.style.transition = 'opacity .7s ease, transform .7s ease';
            intro.style.opacity = '0';
            intro.style.transform = 'scale(1.15)';

            setTimeout(() => {
                if (destination === 'game') {
                    window.location.href = '/neon-flip-game';
                } else if (destination === 'projects') {
                    blocks.forEach(b => {
                        Matter.Body.applyForce(b, b.position, {
                            x: (Math.random() - 0.5) * 0.08,
                            y: -0.12
                        });
                    });
                    setTimeout(() => window.location.href = 'projects.html', 400);
                } else if (destination === 'about' || destination === 'about.html') {
                    window.location.href = 'about.html';
                } else {
                    intro.style.display = 'none';
                }
            }, 700);
        }


        // ── Window Resize ─────────────────────────────
        window.addEventListener('resize', () => {
            render.options.width = window.innerWidth;
            render.options.height = window.innerHeight;
            render.canvas.width = window.innerWidth;
            render.canvas.height = window.innerHeight;
        });

    } catch (e) {
        console.error('[Portfolio] Script error:', e);
    }
}); // end window load