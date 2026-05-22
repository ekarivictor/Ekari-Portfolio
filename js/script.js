document.addEventListener('DOMContentLoaded', () => {
    // --- Modals ---
    const estimateModal = document.getElementById('estimate-modal');
    const closeBtns = document.querySelectorAll('.close-modal-btn');
    const cancelBtn = document.querySelector('.cancel-btn');

    window.openEstimateModal = function() {
        if (estimateModal) estimateModal.classList.add('active');
    };

    window.openEstimateModal = function() {
        if (estimateModal) estimateModal.classList.add('active');
    };

    function closeModal() {
        if (estimateModal) estimateModal.classList.remove('active');
    }

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Close on overlay click
    window.addEventListener('click', (e) => {
        if (e.target === estimateModal) {
            closeModal();
        }
    });

    // --- DYNAMIC PROJECTS GRID LOGIC ---
    const projectsGrid = document.getElementById('projects-grid');
    const filterButtons = document.querySelectorAll('#project-filters .sort-btn');
    
    if (projectsGrid) {
        let allProjects = [];

        // Determine icon based on category
        const getCategoryIcon = (category) => {
            switch(category) {
                case 'Motion': return '<svg class="project-icon" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M10 8l6 4-6 4V8z"></path></svg>';
                case 'Branding': return '<svg class="project-icon" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>';
                case 'Website': return '<svg class="project-icon" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>';
                default: return '<svg class="project-icon" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
            }
        };

        const renderProjects = (category = 'All') => {
            let filtered = category === 'All' ? allProjects : allProjects.filter(p => p.category === category);
            
            // Limit to 9 items
            filtered = filtered.slice(0, 9);
            
            projectsGrid.innerHTML = '';
            
            if (filtered.length === 0) {
                projectsGrid.innerHTML = '<p style="padding: 20px;">No projects found for this category.</p>';
                return;
            }

            filtered.forEach(project => {
                const card = document.createElement('a');
                card.href = project.link || '#';
                card.className = 'project-card';
                card.target = project.link && project.link !== '#' ? '_blank' : '_self';

                let hoverMediaHTML = '';
                if (project.hoverMedia) {
                    if (project.hoverMedia.endsWith('.mp4') || project.hoverMedia.endsWith('.webm')) {
                        hoverMediaHTML = `<video class="project-hover-media" src="${project.hoverMedia}" autoplay loop muted playsinline></video>`;
                    } else {
                        hoverMediaHTML = `<img class="project-hover-media" src="${project.hoverMedia}" alt="${project.title} hover" />`;
                    }
                }

                card.innerHTML = `
                    <img class="project-bg-media" src="${project.image || 'images/paper-bg.png'}" alt="${project.title}" />
                    ${hoverMediaHTML}
                    <div class="project-overlay"></div>
                    <div class="project-number handwritten-title">${project.order || ''}</div>
                    <div class="project-info">
                        <div class="project-info-header">
                            ${getCategoryIcon(project.category)}
                            <h3 class="handwritten-title">${project.title}</h3>
                        </div>
                        <p>${project.description || ''}</p>
                        <div class="project-footer">
                            <span class="project-link">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                                View Live
                            </span>
                            <span class="project-year">${project.year || ''}</span>
                        </div>
                    </div>
                `;
                projectsGrid.appendChild(card);
            });
        };

        const updateCounts = () => {
            document.getElementById('count-All').innerText = allProjects.length;
            document.getElementById('count-Motion').innerText = allProjects.filter(p => p.category === 'Motion').length;
            document.getElementById('count-Branding').innerText = allProjects.filter(p => p.category === 'Branding').length;
            document.getElementById('count-Website').innerText = allProjects.filter(p => p.category === 'Website').length;
        };

        // Fetch Data
        fetch('data/projects.json')
            .then(res => res.json())
            .then(data => {
                if (data && data.items) {
                    allProjects = data.items;
                    updateCounts();
                    renderProjects('All');
                }
            })
            .catch(err => {
                console.error("Error loading projects.json:", err);
                projectsGrid.innerHTML = '<p style="padding: 20px; color: red;">Failed to load projects.</p>';
            });

        // Setup filter buttons
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const cat = btn.getAttribute('data-category');
                renderProjects(cat);
            });
        });
    }

    // --- SERVICE.EXE TABS LOGIC ---
    const serviceBtns = document.querySelectorAll('#service-filters .sort-btn');
    const servicePanels = document.querySelectorAll('.service-panel');

    if (serviceBtns.length > 0 && servicePanels.length > 0) {
        serviceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and panels
                serviceBtns.forEach(b => b.classList.remove('active'));
                servicePanels.forEach(p => p.classList.remove('active'));

                // Add active class to clicked button
                btn.classList.add('active');

                // Get target panel id
                const targetId = 'service-' + btn.getAttribute('data-service-tab');
                const targetPanel = document.getElementById(targetId);
                
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    // --- ACCORDION LOGIC ---

    // --- Rate Card Logic ---
    const rateCardState = new Map();
    let isUsdActive = false;

    function parsePrices(text) {
        const ngnMatch = text.match(/₦([\d,]+)/);
        const usdMatch = text.match(/\$([\d,]+)/);
        return {
            ngn: ngnMatch ? parseInt(ngnMatch[1].replace(/,/g, '')) : 0,
            usd: usdMatch ? parseInt(usdMatch[1].replace(/,/g, '')) : 0
        };
    }

    function formatCurrency(amount, currency) {
        return currency === 'NGN' ? `₦${amount.toLocaleString()}` : `$${amount.toLocaleString()}`;
    }

    function updateSidebar() {
        const sidebarItems = document.querySelector('.sidebar-items');
        const estimateCount = document.querySelector('.estimate-count');
        const totalNgnEl = document.querySelector('.total-ngn');
        const totalUsdEl = document.querySelector('.total-usd');
        
        if (!sidebarItems) return;
        
        sidebarItems.innerHTML = '';
        let totalNgn = 0;
        let totalUsd = 0;
        let count = 0;

        rateCardState.forEach((item, id) => {
            if (item.qty <= 0) return;
            count += item.qty;
            const itemTotalNgn = item.priceNgn * item.qty;
            const itemTotalUsd = item.priceUsd * item.qty;
            totalNgn += itemTotalNgn;
            totalUsd += itemTotalUsd;

            const div = document.createElement('div');
            div.className = 'sidebar-item';
            div.innerHTML = `
                <div class="s-left">
                    <h4>${item.name}</h4>
                    ${item.desc ? `<p>${item.desc}</p>` : ''}
                    <span class="s-range">${item.originalPriceText}</span>
                </div>
                <div class="s-right">
                    <div class="s-total">${item.qty}x = <strong>${formatCurrency(isUsdActive ? itemTotalUsd : itemTotalNgn, isUsdActive ? 'USD' : 'NGN')}</strong> <button class="remove-btn" data-id="${id}">×</button></div>
                    <div class="quantity-control small">
                        <button class="qty-btn minus" data-id="${id}">-</button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="qty-btn plus" data-id="${id}">+</button>
                    </div>
                </div>
            `;
            sidebarItems.appendChild(div);
        });

        if (estimateCount) estimateCount.textContent = count;
        if (totalNgnEl) totalNgnEl.textContent = formatCurrency(totalNgn, 'NGN');
        if (totalUsdEl) totalUsdEl.textContent = formatCurrency(totalUsd, 'USD');
    }

    function updateCardUI(card, qty, prices) {
        const qtySpan = card.querySelector('.qty-val');
        if (qtySpan) qtySpan.textContent = qty;
        
        const totalEl = card.querySelector('.pc-total');
        if (totalEl) {
            const itemTotal = isUsdActive ? (prices.usd * qty) : (prices.ngn * qty);
            totalEl.innerHTML = `${qty}x = <strong>${formatCurrency(itemTotal, isUsdActive ? 'USD' : 'NGN')}</strong>`;
        }
    }

    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach((card, index) => {
        const id = 'item-' + index;
        card.setAttribute('data-id', id);
        
        const name = card.querySelector('.pc-left h4')?.textContent || '';
        const desc = card.querySelector('.pc-left p')?.textContent || '';
        const priceText = card.querySelector('.price-range')?.textContent || '';
        const prices = parsePrices(priceText);
        
        const qtyBtns = card.querySelectorAll('.qty-btn');
        qtyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                let currentItem = rateCardState.get(id) || { id, name, desc, originalPriceText: priceText, priceNgn: prices.ngn, priceUsd: prices.usd, qty: 0 };
                
                if (btn.textContent === '+') {
                    currentItem.qty++;
                } else if (btn.textContent === '-' && currentItem.qty > 0) {
                    currentItem.qty--;
                }
                
                rateCardState.set(id, currentItem);
                updateCardUI(card, currentItem.qty, prices);
                updateSidebar();
            });
        });
    });

    // Sidebar event delegation for dynamic +/- and remove buttons
    const sidebarContainer = document.querySelector('.sidebar-items');
    if (sidebarContainer) {
        sidebarContainer.addEventListener('click', (e) => {
            const btn = e.target;
            if (!btn.classList.contains('qty-btn') && !btn.classList.contains('remove-btn')) return;
            
            const id = btn.getAttribute('data-id');
            const item = rateCardState.get(id);
            if (!item) return;

            if (btn.classList.contains('plus')) {
                item.qty++;
            } else if (btn.classList.contains('minus') && item.qty > 0) {
                item.qty--;
            } else if (btn.classList.contains('remove-btn')) {
                item.qty = 0;
            }

            rateCardState.set(id, item);
            
            // Sync back to main card UI
            const mainCard = document.querySelector(`.pricing-card[data-id="${id}"]`);
            if (mainCard) {
                updateCardUI(mainCard, item.qty, {ngn: item.priceNgn, usd: item.priceUsd});
            }
            
            updateSidebar();
        });
    }

    const clearBtn = document.querySelector('.clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            rateCardState.clear();
            document.querySelectorAll('.pricing-card').forEach(card => {
                updateCardUI(card, 0, parsePrices(card.querySelector('.price-range')?.textContent || ''));
            });
            updateSidebar();
        });
    }

    // Toggle Currency
    const currencyBtns = document.querySelectorAll('.currency-toggle button');
    currencyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currencyBtns.forEach(b => b.classList.remove('active', 'green-toggle'));
            e.target.classList.add('active');
            isUsdActive = e.target.textContent.includes('USD');
            if (isUsdActive) {
                e.target.classList.add('green-toggle');
            }
            
            // Re-render everything with new currency format
            document.querySelectorAll('.pricing-card').forEach(card => {
                const id = card.getAttribute('data-id');
                const item = rateCardState.get(id);
                const qty = item ? item.qty : 0;
                updateCardUI(card, qty, parsePrices(card.querySelector('.price-range')?.textContent || ''));
            });
            updateSidebar();
        });
    });

    // --- GALLERY LOGIC ---
    const galleryTrack = document.getElementById('gallery-track');
    if (galleryTrack) {
        fetch('data/gallery.json')
            .then(res => res.json())
            .then(data => {
                if (data && data.items) {
                    const itemsHTML = data.items.map(item => `
                        <div class="polaroid-card">
                            <div class="polaroid-image ${item.image ? '' : 'placeholder'}">
                                ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;" />` : ''}
                            </div>
                            <div class="polaroid-caption">
                                <h3 class="handwritten-title small">${item.title}</h3>
                                <p>${item.description}</p>
                            </div>
                        </div>
                    `).join('');
                    
                    // Duplicate for seamless infinite scrolling
                    galleryTrack.innerHTML = itemsHTML + itemsHTML;
                }
            })
            .catch(err => console.error("Error loading gallery:", err));
    }

    // --- ANIMATED VIBE WALL LOGIC ---
    const vibeContainer = document.getElementById('vibe-container');
    if (vibeContainer) {
        let vibesData = [
            {
                id: 1,
                score: '7.0',
                emoji: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f97a/512.webp', // pleading face
                name: 'My Bro',
                role: '[CTO/SaleHoo]',
                message: 'Love the setup, incredible work!',
                logo: 'https://via.placeholder.com/32/ffffff/000000?text=L'
            },
            {
                id: 2,
                score: '7.0',
                emoji: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp', // fire
                name: 'My Bro',
                role: '[CTO/SaleHoo]',
                message: 'This wall gets me hyped.'
            },
            {
                id: 3,
                score: '7.0',
                emoji: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2764_fe0f_200d_1f525/512.webp', // heart on fire
                name: 'My Bro',
                role: '[CTO/SaleHoo]',
                message: 'Straight perfection.'
            },
            {
                id: 4,
                score: '7.0',
                emoji: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f973/512.webp', // party popper
                name: 'My Bro',
                role: '[CTO/SaleHoo]',
                message: 'Celebrating this launch today.'
            },
            {
                id: 5,
                score: '7.0',
                emoji: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60f/512.webp', // smirking
                name: 'My Bro',
                role: '[CTO/SaleHoo]',
                message: 'We already know who did it best.'
            }
        ];

        const extraEmojis = [
            '1f97a', '1f525', '2764_fe0f_200d_1f525', '1f973', '1f60f', '1f60e', '1f92f', '1f4af'
        ].map(code => `https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/512.webp`);

        const standardEmojis = [];
        for (let i = 0x1f600; i <= 0x1f637; i++) {
            standardEmojis.push(`https://fonts.gstatic.com/s/e/notoemoji/latest/${i.toString(16)}/512.webp`);
        }

        const emojiOptions = [...extraEmojis, ...standardEmojis];

        const modalOverlay = document.getElementById('modal-overlay');
        const openModalBtn = document.getElementById('open-modal-btn');
        const vibeCloseModalBtn = document.getElementById('close-modal-btn');
        const vibeForm = document.getElementById('vibe-form');
        const emojiPickerContainer = document.getElementById('emoji-picker');
        const selectedEmojiInput = document.getElementById('selected-emoji');

        function renderVibes() {
            vibeContainer.innerHTML = `
                <div class="vibe-track" id="vibe-track-0"></div>
                <div class="vibe-track" id="vibe-track-1"></div>
                <div class="vibe-track" id="vibe-track-2"></div>
                <div class="vibe-track" id="vibe-track-3"></div>
            `;
            
            const tracks = [
                document.getElementById('vibe-track-0'),
                document.getElementById('vibe-track-1'),
                document.getElementById('vibe-track-2'),
                document.getElementById('vibe-track-3')
            ];

            vibesData.forEach((vibe) => {
                const createItem = () => {
                    const item = document.createElement('div');
                    item.className = 'vibe-item';
                    
                    item.innerHTML = `
                        <div class="tooltip">${escapeHTML(vibe.message)}</div>
                        <div class="score-pill">
                            <span class="score-star">★</span>
                            ${vibe.score}
                        </div>
                        <img src="${vibe.emoji}" alt="emoji reaction" class="emoji-image" />
                        <div class="user-name">${escapeHTML(vibe.name)}</div>
                        <div class="role-container">
                            ${vibe.logo ? `<img src="${vibe.logo}" alt="brand logo" class="brand-logo" />` : `<div class="brand-logo-placeholder"></div>`}
                            <div class="user-role">${escapeHTML(vibe.role)}</div>
                        </div>
                    `;
                    return item;
                };
                
                tracks.forEach(track => track.appendChild(createItem()));
            });
        }

        function renderEmojiPicker() {
            emojiPickerContainer.innerHTML = '';
            emojiOptions.forEach((emojiUrl, index) => {
                const codeMatch = emojiUrl.match(/\/latest\/(.+)\/512\.webp/);
                const code = codeMatch ? codeMatch[1] : null;
                const option = document.createElement('div');
                option.className = 'emoji-option';
                
                let nativeEmoji = '😀';
                if (code) {
                    try {
                        const codePoints = code.split('_').map(c => parseInt(c, 16));
                        nativeEmoji = String.fromCodePoint(...codePoints);
                    } catch(e) {}
                }
                
                option.innerHTML = `
                    <span class="static-emoji" style="font-size: 28px; line-height: 1;">${nativeEmoji}</span>
                    <img class="animated-emoji" data-src="${emojiUrl}" alt="Emoji Option" style="display:none;" />
                `;
                
                function selectOption() {
                    document.querySelectorAll('.emoji-option').forEach(el => {
                        el.classList.remove('selected');
                        const img = el.querySelector('.animated-emoji');
                        const stat = el.querySelector('.static-emoji');
                        if(img) img.style.display = 'none';
                        if(stat) stat.style.display = 'block';
                    });
                    option.classList.add('selected');
                    const img = option.querySelector('.animated-emoji');
                    if (!img.src || img.src === '') img.src = emojiUrl;
                    img.style.display = 'block';
                    option.querySelector('.static-emoji').style.display = 'none';
                    selectedEmojiInput.value = emojiUrl;
                }

                if (index === 0) {
                    selectOption();
                }

                option.addEventListener('mouseenter', () => {
                    if (!option.classList.contains('selected')) {
                        const img = option.querySelector('.animated-emoji');
                        if (!img.src || img.src === '') img.src = img.getAttribute('data-src');
                        img.style.display = 'block';
                        option.querySelector('.static-emoji').style.display = 'none';
                    }
                });

                option.addEventListener('mouseleave', () => {
                    if (!option.classList.contains('selected')) {
                        option.querySelector('.animated-emoji').style.display = 'none';
                        option.querySelector('.static-emoji').style.display = 'block';
                    }
                });

                option.addEventListener('click', selectOption);

                emojiPickerContainer.appendChild(option);
            });
        }

        function escapeHTML(str) {
            return str.replace(/[&<>'"]/g, 
                tag => ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    "'": '&#39;',
                    '"': '&quot;'
                }[tag])
            );
        }

        if (openModalBtn) {
            openModalBtn.addEventListener('click', () => {
                modalOverlay.classList.add('active');
                // The first emoji is already selected by default, no need to reset unless we want to
            });
        }

        if (vibeCloseModalBtn) {
            vibeCloseModalBtn.addEventListener('click', () => {
                modalOverlay.classList.remove('active');
            });
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    modalOverlay.classList.remove('active');
                }
            });
        }

        if (vibeForm) {
            vibeForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const emoji = selectedEmojiInput.value;
                const message = document.getElementById('vibe-message').value;
                const name = document.getElementById('vibe-name').value;
                const role = document.getElementById('vibe-role').value;
                const score = document.getElementById('vibe-score').value || '7.0';
                const logoInput = document.getElementById('vibe-logo');
                const generatedId = vibesData.length ? Math.max(...vibesData.map(v => v.id)) + 1 : 1;

                let logoUrl = '';
                if (logoInput.files && logoInput.files[0]) {
                    try {
                        logoUrl = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = ev => resolve(ev.target.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(logoInput.files[0]);
                        });
                    } catch (err) {
                        console.error("Error reading logo file:", err);
                    }
                }

                const newVibe = {
                    id: generatedId,
                    score: score.includes('.') ? score : score + '.0',
                    emoji,
                    name,
                    role: role.trim() === '' ? 'Visitor' : role,
                    message,
                    logo: logoUrl
                };

                vibesData.push(newVibe);
                renderVibes();
                vibeForm.reset();
                modalOverlay.classList.remove('active');
                renderEmojiPicker(); 
            });
        }

        renderVibes();
        renderEmojiPicker();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const typingIndicators = document.querySelectorAll('.typing-indicator');
    const contactFormInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    
    if (typingIndicators.length > 0 && contactFormInputs.length > 0) {
        contactFormInputs.forEach(input => {
            input.addEventListener('focus', () => {
                typingIndicators.forEach(indicator => indicator.classList.add('active'));
            });
            input.addEventListener('blur', () => {
                typingIndicators.forEach(indicator => indicator.classList.remove('active'));
            });
        });
    }
});


// =========================================
// Great Wall (Fragments) Panning Logic
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const viewport = document.getElementById('fragments-viewport');
    const canvas = document.getElementById('fragments-canvas');
    
    if (viewport && canvas) {
        let isDragging = false;
        let startX, startY;
        let currentX = 0, currentY = 0; // Current translation
        let targetX = 0, targetY = 0;   // Target translation for smooth lerp
        
        // Boundaries (roughly limits how far you can pan so you don't lose the canvas)
        const maxX = window.innerWidth * 1.5;
        const maxY = window.innerHeight * 1.5;
        const minX = -window.innerWidth * 1.5;
        const minY = -window.innerHeight * 1.5;

        // Smooth animation loop
        function animate() {
            // Lerp (Linear Interpolation) for smooth inertia
            currentX += (targetX - currentX) * 0.1;
            currentY += (targetY - currentY) * 0.1;
            
            canvas.style.transform = 	ranslate3d( + currentX + px,  + currentY + px, 0);
            requestAnimationFrame(animate);
        }
        animate();

        // Mouse Events
        viewport.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - targetX;
            startY = e.clientY - targetY;
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            let newX = e.clientX - startX;
            let newY = e.clientY - startY;
            
            // Constrain
            newX = Math.max(minX, Math.min(newX, maxX));
            newY = Math.max(minY, Math.min(newY, maxY));
            
            targetX = newX;
            targetY = newY;
        });

                // Custom Cursor Logic
        const customCursor = document.getElementById('custom-drag-cursor');
        if (customCursor) {
            window.addEventListener('mousemove', (e) => {
                customCursor.style.left = e.clientX + 'px';
                customCursor.style.top = e.clientY + 'px';
            });
            
            viewport.addEventListener('mousedown', () => {
                customCursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
            });
            
            window.addEventListener('mouseup', () => {
                customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        }

        // Touch Events
        viewport.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX - targetX;
            startY = e.touches[0].clientY - targetY;
        }, { passive: false });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            let newX = e.touches[0].clientX - startX;
            let newY = e.touches[0].clientY - startY;
            
            newX = Math.max(minX, Math.min(newX, maxX));
            newY = Math.max(minY, Math.min(newY, maxY));
            
            targetX = newX;
            targetY = newY;
        }, { passive: false });
    }
});

