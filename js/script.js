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

    // --- Rate Card Logic ---
    const qtyBtns = document.querySelectorAll('.qty-btn');
    qtyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const span = e.target.parentElement.querySelector('.qty-val');
            if (span) {
                let val = parseInt(span.textContent) || 0;
                if (e.target.textContent === '+') {
                    val++;
                } else if (e.target.textContent === '-' && val > 0) {
                    val--;
                }
                span.textContent = val;
            }
        });
    });

    // Dummy remove button functionality for the sidebar
    const removeBtns = document.querySelectorAll('.remove-btn');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.sidebar-item');
            if (item) {
                item.remove();
                // update counts etc here if this were fully dynamic
            }
        });
    });

    const clearBtn = document.querySelector('.clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            const itemsContainer = document.querySelector('.sidebar-items');
            if (itemsContainer) itemsContainer.innerHTML = '';
        });
    }

    // Toggle Currency
    const currencyBtns = document.querySelectorAll('.currency-toggle button');
    currencyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currencyBtns.forEach(b => b.classList.remove('active', 'green-toggle'));
            e.target.classList.add('active');
            if (e.target.textContent.includes('USD')) {
                e.target.classList.add('green-toggle');
            }
        });
    });

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
                const option = document.createElement('div');
                option.className = 'emoji-option';
                option.innerHTML = `<img src="${emojiUrl}" alt="Emoji Option" />`;
                
                if (index === 0) {
                    option.classList.add('selected');
                    selectedEmojiInput.value = emojiUrl;
                }

                option.addEventListener('click', () => {
                    document.querySelectorAll('.emoji-option').forEach(el => el.classList.remove('selected'));
                    option.classList.add('selected');
                    selectedEmojiInput.value = emojiUrl;
                });

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
                document.querySelectorAll('.emoji-option').forEach(el => el.classList.remove('selected'));
                if (emojiPickerContainer.firstChild) {
                    emojiPickerContainer.firstChild.classList.add('selected');
                    selectedEmojiInput.value = emojiOptions[0];
                }
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
