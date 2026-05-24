document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    const customCursor = document.getElementById('custom-drag-cursor');
    // For this parallax version, the custom cursor might just follow the mouse,
    // or we might hide it if it's purely parallax. We will keep the dot.

    let width = window.innerWidth;
    let height = window.innerHeight;

    const dpr = window.devicePixelRatio || 1;
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        initLayout(); // Re-layout on resize
    }
    window.addEventListener('resize', resize);

    // Parallax Camera (moves based on mouse, no dragging)
    let camera = { x: 0, y: 0, targetX: 0, targetY: 0 };
    
    // How far the parallax moves in pixels based on mouse position
    const parallaxStrength = 150; 

    let mouseX = width / 2;
    let mouseY = height / 2;

    const rawImages = [
        'web carousel/10k back.jpg',
        'web carousel/card kingxqueen copy.jpg',
        'web carousel/casino von march copy.png',
        'web carousel/Casino Von Queen copy 2.png',
        'web carousel/Casino Vonking red copy 2.png',
        'web carousel/CasinoVon copy.jpg',
        'web carousel/Casinovonpass copy.jpg',
        'web carousel/client exp 1.png',
        'web carousel/emma copy.png',
        'web carousel/illustration.png',
        'web carousel/Pattern black branded.png',
        'web carousel/speak.png',
        'web carousel/SWITCH.png',
        'web carousel/Titos food No expiry date-25.png',
        'web carousel/win 1.png'
    ];

    let fragments = [];

    // Initialize layout (evenly spaced grid)
    function initLayout() {
        fragments = [];
        
        // Let's create a 5 columns x 3 rows grid
        const cols = 5;
        const rows = 3;
        
        // Small, uniform size as requested
        const size = 200; 
        
        // Calculate spacing so they fill the screen plus a little extra for parallax bleed
        const totalWidth = width + parallaxStrength * 2;
        const totalHeight = height + parallaxStrength * 2;
        
        const spacingX = totalWidth / cols;
        const spacingY = totalHeight / rows;
        
        // Offset to start drawing
        const startX = -parallaxStrength + (spacingX - size) / 2;
        const startY = -parallaxStrength + (spacingY - size) / 2;

        rawImages.forEach((src, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            
            // Add a little organic offset so it's not totally rigid
            const offsetX = (Math.random() - 0.5) * 40;
            const offsetY = (Math.random() - 0.5) * 40;

            const x = startX + (col * spacingX) + offsetX;
            const y = startY + (row * spacingY) + offsetY;

            const img = new Image();
            img.src = src;
            
            fragments.push({
                img: img,
                x: x,
                y: y,
                baseW: size,
                baseH: size,
                scale: 1,
                targetScale: 1,
                rotation: 0,
                targetRotation: 0,
                isHovered: false
            });
        });
    }

    resize(); // This calls initLayout

    // Mouse tracking for parallax and custom cursor
    function onPointerMove(e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        mouseX = clientX;
        mouseY = clientY;

        if (customCursor && !e.touches) {
            customCursor.style.left = clientX + 'px';
            customCursor.style.top = clientY + 'px';
            customCursor.style.opacity = '1';
        }

        // Calculate parallax target
        // Mouse at left edge (0) -> camera target is +parallaxStrength
        // Mouse at right edge (width) -> camera target is -parallaxStrength
        const mouseNormX = (clientX / width) - 0.5; // -0.5 to 0.5
        const mouseNormY = (clientY / height) - 0.5;

        camera.targetX = -mouseNormX * parallaxStrength * 2;
        camera.targetY = -mouseNormY * parallaxStrength * 2;
    }

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: false });

    // Click effect for cursor
    window.addEventListener('mousedown', () => {
        if (customCursor) customCursor.style.transform = 'translate(-50%, -50%) scale(0.6)';
    });
    window.addEventListener('mouseup', () => {
        if (customCursor) customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // Render Loop
    function render() {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Smooth parallax lerp
        camera.x += (camera.targetX - camera.x) * 0.05;
        camera.y += (camera.targetY - camera.y) * 0.05;

        ctx.save();
        ctx.translate(camera.x, camera.y);

        // Sort fragments so hovered renders on top
        const sortedFragments = [...fragments].sort((a, b) => {
            return (a.isHovered === b.isHovered) ? 0 : a.isHovered ? 1 : -1;
        });

        // World coordinates of mouse (for hover detection)
        const worldMouseX = mouseX - camera.x;
        const worldMouseY = mouseY - camera.y;

        sortedFragments.forEach(frag => {
            const left = frag.x;
            const right = frag.x + frag.baseW;
            const top = frag.y;
            const bottom = frag.y + frag.baseH;

            // Hover check
            if (worldMouseX >= left && worldMouseX <= right && worldMouseY >= top && worldMouseY <= bottom) {
                frag.isHovered = true;
                frag.targetScale = 1.15; // More pronounced pop
                frag.targetRotation = 0.05; // Slight twist
            } else {
                frag.isHovered = false;
                frag.targetScale = 1;
                frag.targetRotation = 0;
            }

            frag.scale += (frag.targetScale - frag.scale) * 0.15;
            frag.rotation += (frag.targetRotation - frag.rotation) * 0.15;

            if (frag.img.complete && frag.img.naturalWidth !== 0) {
                ctx.save();
                
                const centerX = frag.x + frag.baseW / 2;
                const centerY = frag.y + frag.baseH / 2;
                
                ctx.translate(centerX, centerY);
                ctx.rotate(frag.rotation);
                ctx.scale(frag.scale, frag.scale);
                ctx.translate(-centerX, -centerY);

                ctx.drawImage(frag.img, frag.x, frag.y, frag.baseW, frag.baseH);
                
                if (frag.scale > 1.01) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                    ctx.fillRect(frag.x, frag.y, frag.baseW, frag.baseH);
                }

                ctx.restore();
            }
        });

        ctx.restore();
        requestAnimationFrame(render);
    }

    render();
});
