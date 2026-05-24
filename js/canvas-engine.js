document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    const customCursor = document.getElementById('custom-drag-cursor');

    let width = window.innerWidth;
    let height = window.innerHeight;
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

    const loadedImages = rawImages.map(src => {
        const img = new Image();
        img.src = src;
        return img;
    });

    // --- INFINITE DRAG PHYSICS ---
    let camera = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isDragging = false;
    let startMouseX = 0, startMouseY = 0;
    
    // For raycasting / hover
    let mouseX = width / 2;
    let mouseY = height / 2;

    // Grid Metrics
    const baseSize = 100; // Decreased size
    const spacing = 64;   // Spacing requested
    const cellSize = baseSize + spacing; // 164px total cell footprint
    
    // State map to remember hover scaling for specific grid cells
    // Keys will be 'col,row', values will be { scale, rotation, targetScale, targetRotation }
    const cellStates = new Map();
    function getCellState(col, row) {
        const key = col + ',' + row;
        if (!cellStates.has(key)) {
            cellStates.set(key, { scale: 1, rotation: 0, targetScale: 1, targetRotation: 0, isHovered: false });
        }
        return cellStates.get(key);
    }

    // Input Handling
    function onPointerDown(e) {
        isDragging = true;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        startMouseX = clientX - camera.targetX;
        startMouseY = clientY - camera.targetY;
        if (customCursor) customCursor.style.transform = 'translate(-50%, -50%) scale(0.6)';
    }

    function onPointerUp() {
        isDragging = false;
        if (customCursor) customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
    }

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

        if (!isDragging) return;
        if (e.cancelable) e.preventDefault();

        // Update target camera based on drag
        camera.targetX = clientX - startMouseX;
        camera.targetY = clientY - startMouseY;
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

        // Lerp camera for smooth inertia drag
        camera.x += (camera.targetX - camera.x) * 0.08;
        camera.y += (camera.targetY - camera.y) * 0.08;

        ctx.save();
        ctx.translate(camera.x, camera.y);

        // --- INFINITE MATH GRID ---
        // Determine which cells are visible on screen based on the camera position
        // We divide the inverse of camera by cellSize to find the starting column/row.
        // We add extra padding to ensure images don't pop in at the edges.
        const startCol = Math.floor(-camera.x / cellSize) - 2;
        const endCol = startCol + Math.ceil(width / cellSize) + 4;
        
        const startRow = Math.floor(-camera.y / cellSize) - 2;
        const endRow = startRow + Math.ceil(height / cellSize) + 4;

        // World coordinates of mouse
        const worldMouseX = mouseX - camera.x;
        const worldMouseY = mouseY - camera.y;
        
        // We will collect items to render so we can sort them (hovered items on top)
        const renderList = [];

        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                
                // Which image should go here? Create a deterministic index based on col and row
                // This ensures the pattern repeats infinitely but remains consistent when dragging back and forth.
                let pseudoRandomIndex = (col * 13 + row * 27);
                // Handle negative modulo correctly
                let imgIndex = ((pseudoRandomIndex % loadedImages.length) + loadedImages.length) % loadedImages.length;
                
                const img = loadedImages[imgIndex];
                if (!img.complete || img.naturalWidth === 0) continue;

                // Base coordinates for this cell
                const x = col * cellSize + spacing/2;
                const y = row * cellSize + spacing/2;

                // Raycasting / Hover check for this cell
                const left = x;
                const right = x + baseSize;
                const top = y;
                const bottom = y + baseSize;
                
                const state = getCellState(col, row);

                if (!isDragging && worldMouseX >= left && worldMouseX <= right && worldMouseY >= top && worldMouseY <= bottom) {
                    state.isHovered = true;
                    state.targetScale = 1.25; 
                    state.targetRotation = 0.08;
                } else {
                    state.isHovered = false;
                    state.targetScale = 1;
                    state.targetRotation = 0;
                }

                // Lerp state
                state.scale += (state.targetScale - state.scale) * 0.15;
                state.rotation += (state.targetRotation - state.rotation) * 0.15;
                
                renderList.push({
                    img: img,
                    x: x,
                    y: y,
                    state: state
                });
            }
        }
        
        // Sort: hovered items render last (on top)
        renderList.sort((a, b) => {
            return (a.state.isHovered === b.state.isHovered) ? 0 : a.state.isHovered ? 1 : -1;
        });
        
        // Draw
        renderList.forEach(item => {
            ctx.save();
            
            const centerX = item.x + baseSize / 2;
            const centerY = item.y + baseSize / 2;
            
            ctx.translate(centerX, centerY);
            ctx.rotate(item.state.rotation);
            ctx.scale(item.state.scale, item.state.scale);
            ctx.translate(-centerX, -centerY);

            // Aspect ratio calculation (object-fit: contain)
            const imgAspect = item.img.naturalWidth / item.img.naturalHeight;
            let drawW = baseSize;
            let drawH = baseSize;
            
            if (imgAspect > 1) { 
                drawH = baseSize / imgAspect;
            } else { 
                drawW = baseSize * imgAspect;
            }
            
            const drawX = item.x + (baseSize - drawW) / 2;
            const drawY = item.y + (baseSize - drawH) / 2;

            ctx.drawImage(item.img, drawX, drawY, drawW, drawH);
            
            if (item.state.scale > 1.01) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.fillRect(item.x, item.y, baseSize, baseSize);
            }

            ctx.restore();
        });

        ctx.restore();
        requestAnimationFrame(render);
    }

    render();
});
