document.addEventListener('DOMContentLoaded', () => {
    // --- Autograph Hover Logic ---
    const autographVideos = document.querySelectorAll('.autograph-video');
    autographVideos.forEach(player => {
        // Play from start on hover
        player.addEventListener('mouseenter', function() {
            try {
                this.seek(0);
                this.play();
            } catch(e) {}
        });
    });

    // --- Preloader Logic ---
    const preloader = document.getElementById('global-preloader');
    if (preloader) {
        document.body.style.overflow = 'hidden';
        let preloaderHidden = false;
        
        const hidePreloader = () => {
            if (preloaderHidden) return;
            preloaderHidden = true;
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
            setTimeout(() => preloader.remove(), 600);
        };

        preloader.addEventListener("click", hidePreloader);

        const isMobile = window.innerWidth <= 768;
        const activeVideo = isMobile ? preloader.querySelector('.mobile-preloader') : preloader.querySelector('.desktop-preloader');
        
        if (activeVideo) {
            // Force play in case autoplay was blocked initially
            activeVideo.play().catch(e => {
                console.log('Autoplay blocked', e);
                // If autoplay completely fails, hide it so site isn't stuck
                hidePreloader();
            });
            activeVideo.addEventListener('ended', hidePreloader);
            activeVideo.addEventListener('error', hidePreloader);
            
            // Extreme fallback just in case video hangs forever
            setTimeout(hidePreloader, 15000);
        } else {
            window.addEventListener('load', hidePreloader);
        }
    }
    // --- Load Site CMS Text ---
    function loadSiteText() {
        // Load Homepage Text
        fetch('data/home.json')
            .then(res => res.json())
            .then(data => {
                const introEl = document.getElementById('cms-intro-text');
                const contactHeaderEl = document.getElementById('cms-contact-header');
                const contactSubtextEl = document.getElementById('cms-contact-subtext');
                
                if (introEl && data.introText) introEl.innerHTML = data.introText;
                if (contactHeaderEl && data.contactHeader) contactHeaderEl.innerHTML = data.contactHeader;
                if (contactSubtextEl && data.contactSubtext) contactSubtextEl.innerHTML = data.contactSubtext;
            }).catch(e => console.log('No home.json found or error loading it', e));

        // Load About Page Text
        fetch('data/about.json')
            .then(res => res.json())
            .then(data => {
                const titleEl = document.getElementById('cms-about-hero-title');
                const bioEl = document.getElementById('cms-about-bio');
                const philEl = document.getElementById('cms-about-philosophy');
                const skillsEl = document.getElementById('cms-about-skills');
                const hobbiesEl = document.getElementById('cms-about-hobbies');

                if (titleEl && data.heroTitle) titleEl.innerHTML = data.heroTitle;
                if (bioEl && data.heroBio) bioEl.innerHTML = data.heroBio;
                if (philEl && data.philosophy) philEl.innerHTML = data.philosophy;
                
                if (skillsEl && data.skills && Array.isArray(data.skills)) {
                    skillsEl.innerHTML = data.skills.map(s => `<span class="tag">${s}</span>`).join('');
                }
                if (hobbiesEl && data.hobbies && Array.isArray(data.hobbies)) {
                    hobbiesEl.innerHTML = data.hobbies.map(s => `<span class="tag">${s}</span>`).join('');
                }
            }).catch(e => console.log('No about.json found or error loading it', e));
    }
    loadSiteText();

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
                case 'Web/UI': return '<svg class="project-icon" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>';
                default: return '<svg class="project-icon" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
            }
        };

        const renderProjects = (category = 'All') => {
            let filtered = category === 'All' ? allProjects : allProjects.filter(p => {
                if (Array.isArray(p.category)) return p.category.includes(category);
                return p.category === category;
            });
            
            // Limit to 9 items
            filtered = filtered.slice(0, 9);
            
            projectsGrid.innerHTML = '';
            
            if (filtered.length === 0) {
                projectsGrid.innerHTML = '<p style="padding: 20px;">No projects found for this category.</p>';
                return;
            }

            filtered.forEach(project => {
                const card = document.createElement('a');
                
                // Route to project detail, or use direct link if provided and requested
                if (project.link && project.link !== '#') {
                    card.href = project.link;
                    card.target = '_blank';
                } else {
                    card.href = `project-detail.html?id=${encodeURIComponent(project.title)}`;
                    card.target = '_self';
                }
                
                card.className = 'project-card';

                let hoverMediaHTML = '';
                if (project.hoverMedia) {
                    if (project.hoverMedia.endsWith('.mp4') || project.hoverMedia.endsWith('.webm')) {
                        hoverMediaHTML = `<video class="project-hover-media" src="${project.hoverMedia}" autoplay loop muted playsinline></video>`;
                    } else {
                        hoverMediaHTML = `<img class="project-hover-media" src="${project.hoverMedia}" alt="${project.title} hover" />`;
                    }
                }
                
                let categoriesArray = Array.isArray(project.category) ? project.category : [project.category || ''];
                let categoriesHTML = categoriesArray.map(cat => {
                    let mainColor = '#FFFFFF';
                    let bgColor = 'rgba(255,255,255,0.1)';
                    
                    if (cat.toLowerCase().includes('motion')) {
                        mainColor = '#42C5F4'; // Cyan/Blue
                        bgColor = 'rgba(66, 197, 244, 0.15)';
                    } else if (cat.toLowerCase().includes('branding')) {
                        mainColor = '#A4E320'; // Light Green
                        bgColor = 'rgba(164, 227, 32, 0.15)';
                    } else if (cat.toLowerCase().includes('web')) {
                        mainColor = '#F6C15E'; // Orange/Peach
                        bgColor = 'rgba(246, 193, 94, 0.15)';
                    }
                    
                    return `<span class="category-pill" style="color: ${mainColor}; background: ${bgColor}; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-right: 8px; display: inline-flex; align-items: center; gap: 6px;"><div style="width:6px; height:6px; border-radius:50%; background-color:${mainColor};"></div> ${cat}</span>`;
                }).join('');

                card.innerHTML = `
                    <div class="project-image-wrapper" style="position: relative; width: 100%; aspect-ratio: 4/3; overflow: hidden; border-radius: 8px;">
                        <img class="project-bg-media" src="${project.image || 'images/paper-bg.png'}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                        ${hoverMediaHTML}
                        <div class="project-number handwritten-title" style="position: absolute; top: 16px; right: 24px; font-size: 64px; color: var(--accent-color); text-shadow: 2px 4px 12px rgba(0,0,0,0.5); z-index: 5;">${project.order || ''}</div>
                    </div>
                    
                    <div class="project-info" style="padding: 16px 0; display: flex; flex-direction: column; gap: 12px; flex: 1;">
                        <h3 class="handwritten-title" style="font-size: 40px; color: var(--accent-color); margin: 0;">${project.title}</h3>
                        <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.5; margin: 0; max-width: 95%; flex: 1;">${project.description || ''}</p>
                        
                        <div class="project-categories" style="display: flex; flex-wrap: wrap; margin-bottom: auto;">
                            ${categoriesHTML}
                        </div>
                        
                        <div class="project-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; width: 100%;">
                            ${(() => {
                                let isWebUi = categoriesArray.some(c => c.toLowerCase().includes('web') || c.toLowerCase().includes('ui'));
                                if (isWebUi) {
                                    let clickHandler = project.liveLink ? `onclick="window.open('${project.liveLink}', '_blank'); event.preventDefault(); event.stopPropagation();"` : `onclick="event.preventDefault(); event.stopPropagation();"`;
                                    return `<button class="live-link-btn" ${clickHandler}>View Live Link</button>`;
                                } else {
                                    return `<button class="live-link-btn disabled" disabled onclick="event.preventDefault(); event.stopPropagation();">View Live Link</button>`;
                                }
                            })()}
                            <span class="project-year" style="color: #fff; font-size: 14px; opacity: 0.5;">${project.year || ''}</span>
                        </div>
                    </div>
                `;
                
                // If no live link, disable clicking the "View Live Link" button behavior by ensuring it looks disabled
                // However, the card itself still clicks to the case study
                
                projectsGrid.appendChild(card);
            });
        };

        const updateCounts = () => {
            const hasCat = (p, cat) => Array.isArray(p.category) ? p.category.includes(cat) : p.category === cat;
            document.getElementById('count-All').innerText = allProjects.length;
            document.getElementById('count-Motion').innerText = allProjects.filter(p => hasCat(p, 'Motion')).length;
            document.getElementById('count-Branding').innerText = allProjects.filter(p => hasCat(p, 'Branding')).length;
            document.getElementById('count-Web/UI').innerText = allProjects.filter(p => hasCat(p, 'Web/UI')).length;
        };

        // Fetch Data
        fetch('data/projects.json?t=' + new Date().getTime())
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








// Contact Form Interactive Animations
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    const contactInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    
    const sendingVideo = document.getElementById('sending-anim');
    const receiveLottie = document.getElementById('receive-anim');
    
    if (!sendingVideo || !receiveLottie) return;

    let isTyping = false;
    let typingTimeout;
    let hasSent = false;
    let lottieReady = false;
    
    // Animation constants
    const SENDING_LOOP_START = 16 / 60; // Frame 16 at 60fps ~ 0.266s
    const SENDING_LOOP_END = 45 / 60;   // Frame 45 at 60fps ~ 0.75s
    const LOTTIE_FPS = 60; // Assumption
    const LOTTIE_LOOP_END = 2 * LOTTIE_FPS; // 2 seconds at 60fps = 120 frames
    
    // Setup initial state
    sendingVideo.pause();
    sendingVideo.currentTime = 0;
    
    receiveLottie.addEventListener('ready', () => {
        lottieReady = true;
        const lottieInstance = receiveLottie.getLottie();
        lottieInstance.pause();
    });

    const startTyping = () => {
        if (hasSent) return;
        if (!isTyping) {
            isTyping = true;
            sendingVideo.play();
            if (lottieReady) {
                // Play from 0 to 120 and loop it by listening to complete event
                const lottieInstance = receiveLottie.getLottie();
                lottieInstance.loop = false; 
                lottieInstance.playSegments([0, LOTTIE_LOOP_END], true);
            }
        }
        
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            isTyping = false;
            // When idle, go back to frame 0
            sendingVideo.pause();
            sendingVideo.currentTime = 0;
            if (lottieReady) {
                const lottieInstance = receiveLottie.getLottie();
                lottieInstance.pause();
                lottieInstance.goToAndStop(0, true);
            }
        }, 1500); // 1.5 seconds idle time = not typing
    };

    contactInputs.forEach(input => {
        input.addEventListener('input', startTyping);
    });

    sendingVideo.addEventListener('timeupdate', () => {
        if (hasSent) return; // If sent, play till end
        
        // If typing, loop from SENDING_LOOP_END to SENDING_LOOP_START
        if (isTyping && sendingVideo.currentTime >= SENDING_LOOP_END) {
            sendingVideo.currentTime = SENDING_LOOP_START;
            sendingVideo.play(); // ensure playing
        }
    });

    if (receiveLottie) {
        receiveLottie.addEventListener('complete', () => {
            if (hasSent) return; // if sent, it finishes at the end
            if (isTyping && lottieReady) {
                // If it finished playing the segment and we are still typing, replay the segment
                const lottieInstance = receiveLottie.getLottie();
                lottieInstance.playSegments([0, LOTTIE_LOOP_END], true);
            }
        });
    }

    // Handle form submit
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            hasSent = true;
            isTyping = false;
            clearTimeout(typingTimeout);
            
            // Jump to the final segments if they aren't already there
            if (sendingVideo.currentTime < SENDING_LOOP_END) {
                sendingVideo.currentTime = SENDING_LOOP_END;
            }
            sendingVideo.play();
            
            if (lottieReady) {
                const lottieInstance = receiveLottie.getLottie();
                lottieInstance.loop = false;
                // Play from 2 seconds to the very end
                lottieInstance.playSegments([LOTTIE_LOOP_END, lottieInstance.totalFrames], true);
            }
        });
    }
});

