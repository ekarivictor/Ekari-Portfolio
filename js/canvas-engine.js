document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // alpha: false for performance optimization

    const customCursor = document.getElementById('custom-drag-cursor');

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resize);
    resize();

    // The Camera (for panning)
    let camera = { x: 0, y: 0, targetX: 0, targetY: 0 };
    
    // Limits
    const boundX = width * 1.5;
    const boundY = height * 1.5;

    // Mouse/Touch State
    let isDragging = false;
    let startMouseX = 0, startMouseY = 0;
    let mouseX = 0, mouseY = 0; // World coordinates

    const imagesData = [
        { src: 'web carousel/10k back.jpg', x: width*0.1, y: height*0.1, w: 400, h: 300 },
        { src: 'web carousel/card kingxqueen copy.jpg', x: width*0.35, y: height*0.25, w: 300, h: 400 },
        { src: 'web carousel/casino von march copy.png', x: width*0.6, y: height*0.05, w: 350, h: 250 },
        { src: 'web carousel/Casino Von Queen copy 2.png', x: width*0.15, y: height*0.4, w: 500, h: 300 },
        { src: 'web carousel/Casino Vonking red copy 2.png', x: width*0.7, y: height*0.45, w: 250, h: 350 },
        { src: 'web carousel/CasinoVon copy.jpg', x: width*0.05, y: height*0.7, w: 350, h: 350 },
        { src: 'web carousel/Casinovonpass copy.jpg', x: width*0.45, y: height*0.65, w: 400, h: 200 },
        { src: 'web carousel/client exp 1.png', x: width*0.3, y: height*0.85, w: 300, h: 450 },
        { src: 'web carousel/emma copy.png', x: width*0.75, y: height*0.8, w: 350, h: 350 },
        { src: 'web carousel/illustration.png', x: width*0.8, y: height*0.15, w: 250, h: 250 },
        { src: 'web carousel/Pattern black branded.png', x: width*-0.05, y: height*0.35, w: 200, h: 300 },
        { src: 'web carousel/speak.png', x: width*0.85, y: height*0.55, w: 300, h: 200 },
        { src: 'web carousel/SWITCH.png', x: width*0.6, y: height*0.9, w: 250, h: 350 },
        { src: 'web carousel/Titos food No expiry date-25.png', x: width*0.55, y: height*0.25, w: 350, h: 350 },
        { src: 'web carousel/win 1.png', x: width*0.35, y: height*0.55, w: 450, h: 300 }
    ];

    const fragments = [];

    // Load images
    imagesData.forEach(data => {
        const img = new Image();
        img.src = data.src;
        fragments.push({
            img: img,
            x: data.x,
            y: data.y,
            baseW: data.w,
            baseH: data.h,
            scale: 1,
            targetScale: 1,
            rotation: 0,
            targetRotation: 0,
            isHovered: false
        });
    });

    // Input Handling
    function onPointerDown(e) {
        isDragging = true;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        startMouseX = clientX - camera.targetX;
        startMouseY = clientY - camera.targetY;
        if (customCursor) customCursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    }

    function onPointerUp() {
        isDragging = false;
        if (customCursor) customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
    }

    function onPointerMove(e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        // Custom cursor tracking
        if (customCursor && !e.touches) {
            customCursor.style.left = clientX + 'px';
            customCursor.style.top = clientY + 'px';
        }

        // Screen to World coordinates for hover logic
        mouseX = clientX - camera.x;
        mouseY = clientY - camera.y;

        if (!isDragging) return;
        if (e.cancelable) e.preventDefault();

        let newX = clientX - startMouseX;
        let newY = clientY - startMouseY;

        // Add soft boundaries
        newX = Math.max(-boundX, Math.min(newX, boundX));
        newY = Math.max(-boundY, Math.min(newY, boundY));

        camera.targetX = newX;
        camera.targetY = newY;
    }

    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('mousemove', onPointerMove);

    canvas.addEventListener('touchstart', onPointerDown, { passive: false });
    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('touchmove', onPointerMove, { passive: false });

    // Render Loop
    function render() {
        // Clear background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Lerp camera
        camera.x += (camera.targetX - camera.x) * 0.08;
        camera.y += (camera.targetY - camera.y) * 0.08;

        ctx.save();
        ctx.translate(camera.x, camera.y);

        let hoveredAny = false;

        // Sort fragments so hovered ones render on top
        const sortedFragments = [...fragments].sort((a, b) => {
            return (a.isHovered === b.isHovered) ? 0 : a.isHovered ? 1 : -1;
        });

        sortedFragments.forEach(frag => {
            // AABB Collision Detection (Raycasting)
            const left = frag.x;
            const right = frag.x + frag.baseW;
            const top = frag.y;
            const bottom = frag.y + frag.baseH;

            // Check if mouse is hovering over this image
            if (!isDragging && mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom) {
                frag.isHovered = true;
                frag.targetScale = 1.08;
                frag.targetRotation = 0.03; // ~2 degrees in radians
                hoveredAny = true;
            } else {
                frag.isHovered = false;
                frag.targetScale = 1;
                frag.targetRotation = 0;
            }

            // Lerp scale and rotation
            frag.scale += (frag.targetScale - frag.scale) * 0.1;
            frag.rotation += (frag.targetRotation - frag.rotation) * 0.1;

            if (frag.img.complete && frag.img.naturalWidth !== 0) {
                ctx.save();
                
                // Move to center of image for scaling/rotation
                const centerX = frag.x + frag.baseW / 2;
                const centerY = frag.y + frag.baseH / 2;
                
                ctx.translate(centerX, centerY);
                ctx.rotate(frag.rotation);
                ctx.scale(frag.scale, frag.scale);
                ctx.translate(-centerX, -centerY);

                // Draw image
                ctx.drawImage(frag.img, frag.x, frag.y, frag.baseW, frag.baseH);
                
                // Add a subtle overlay when hovering (like reference)
                if (frag.scale > 1.01) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                    ctx.fillRect(frag.x, frag.y, frag.baseW, frag.baseH);
                }

                ctx.restore();
            }
        });

        ctx.restore();

        // Show/hide cursor depending on interactions
        if (customCursor) {
            if (isDragging || hoveredAny) {
                customCursor.style.opacity = '1';
            } else if (!isDragging && !hoveredAny) {
                // If we want it always visible, keep opacity 1. The reference site often has it visible on canvas.
                customCursor.style.opacity = '1';
            }
        }

        requestAnimationFrame(render);
    }

    render();
});
