(() => {
    function setupLandingMenu() {
        const body = document.body;
        const menuButton = document.getElementById('landingMenuToggle');
        const drawer = document.getElementById('landingDrawer');
        const backdrop = document.getElementById('landingMenuBackdrop');
        const closeButton = document.getElementById('landingDrawerClose');

        if (!body.classList.contains('landing-page') || !menuButton || !drawer || !backdrop || !closeButton) {
            return;
        }

        const landingMenuMedia = window.matchMedia('(max-width: 900px)');

        function setOpenState(isOpen) {
            body.classList.toggle('menu-open', isOpen);
            menuButton.setAttribute('aria-expanded', String(isOpen));
            drawer.setAttribute('aria-hidden', String(!isOpen));
            backdrop.setAttribute('aria-hidden', String(!isOpen));
        }

        function openMenu() {
            setOpenState(true);
        }

        function closeMenu() {
            setOpenState(false);
        }

        menuButton.addEventListener('click', () => {
            const isOpen = body.classList.contains('menu-open');
            setOpenState(!isOpen);
        });

        closeButton.addEventListener('click', closeMenu);
        backdrop.addEventListener('click', closeMenu);

        drawer.querySelectorAll('a, button').forEach((element) => {
            if (element === closeButton) {
                return;
            }

            element.addEventListener('click', () => {
                closeMenu();
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && body.classList.contains('menu-open')) {
                closeMenu();
            }
        });

        landingMenuMedia.addEventListener('change', (event) => {
            if (!event.matches) {
                closeMenu();
            }
        });
    }

    function setupLandingHero() {
        const landingHero = document.querySelector('.landing-hero');
        if (!landingHero) {
            return;
        }

        const decoRects = Array.from(landingHero.querySelectorAll('.deco-rect'));
        if (!decoRects.length) {
            return;
        }

        const imagePool = [
            'assets/aub-fest-vii.jpg',
            'assets/live-musicians-jazz-festival.jpg',
            'assets/typographer-print-editorial.jpg',
            'assets/set-designer-storefront-play.jpg',
            'assets/one-on-one-film-photography-ana-costa.jpg',
            'assets/summer-sonic-24.jpg',
            'assets/artists-gallery-group-show.jpg',
            'assets/bravo-design-good-design.jpg',
            'assets/bella-figura.jpg',
            'assets/vocalist-rnb-mixtape.jpg',
            'assets/dj-underground-warehouse-party.jpg',
            'assets/16mm-camera-operator-for-dance-short.jpg',
            'assets/camera-lighting-gear-lending.jpg',
            'assets/textile-print-lab.jpg',
            'assets/open-studio-weekend.jpg',
            'assets/actors-indie-short-film.jpg',
            'assets/studio-a-bushwick.jpg',
            'assets/featured-artist-k-pop-collab.jpg',
            'assets/the-annex-ridgewood.jpg',
            'assets/dancer-music-video-shoot.jpg',
            'assets/motion-poster-archive.png',
            'assets/black-box-new-works.jpg',
            'assets/hervision.jpg'
        ];
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const activeStates = new Set();
        const ambientTiles = new Set();

        function randomBetween(min, max) {
            return min + (Math.random() * (max - min));
        }

        function pickRandomImage(excludedImages = []) {
            const excludedSet = new Set(excludedImages);
            const candidates = imagePool.filter((image) => !excludedSet.has(image));
            const source = candidates.length ? candidates : imagePool;
            return source[Math.floor(Math.random() * source.length)];
        }

        function setLayerImage(layer, imageSrc) {
            layer.style.backgroundImage = `url("${imageSrc}")`;
        }

        function createImageLayer() {
            const layer = document.createElement('span');
            layer.className = 'deco-rect-image';
            return layer;
        }

        function buildTileState(tile, initialImage) {
            const visibleLayer = createImageLayer();
            const hiddenLayer = createImageLayer();

            tile.replaceChildren(visibleLayer, hiddenLayer);
            setLayerImage(visibleLayer, initialImage);
            visibleLayer.classList.add('is-visible');

            return {
                tile,
                layers: [visibleLayer, hiddenLayer],
                activeIndex: 0,
                currentImage: initialImage,
                floatTimeout: null,
                removeTimeout: null
            };
        }

        function registerState(state) {
            activeStates.add(state);
            return state;
        }

        function unregisterState(state) {
            if (!state) {
                return;
            }

            activeStates.delete(state);
            if (state.floatTimeout) {
                window.clearTimeout(state.floatTimeout);
            }
            if (state.removeTimeout) {
                window.clearTimeout(state.removeTimeout);
            }
        }

        function scheduleFloat(state) {
            if (!state.tile.isConnected) {
                unregisterState(state);
                return;
            }

            const maxOffsetX = Math.min(Math.max(state.tile.offsetWidth * 0.48, 52), 160);
            const maxOffsetY = Math.min(Math.max(state.tile.offsetHeight * 0.48, 52), 160);
            const nextX = randomBetween(-maxOffsetX, maxOffsetX);
            const nextY = randomBetween(-maxOffsetY, maxOffsetY);
            const rotation = randomBetween(-8, 8);
            const scale = randomBetween(0.95, 1.05);
            const duration = 9000 + Math.random() * 7000;

            state.tile.style.setProperty('--float-duration', `${duration}ms`);
            state.tile.style.setProperty('--float-x', `${nextX.toFixed(1)}px`);
            state.tile.style.setProperty('--float-y', `${nextY.toFixed(1)}px`);
            state.tile.style.setProperty('--float-rotate', `${rotation.toFixed(2)}deg`);
            state.tile.style.setProperty('--float-scale', scale.toFixed(3));

            state.floatTimeout = window.setTimeout(() => scheduleFloat(state), duration);
        }

        function getAmbientPath(size) {
            const margin = size * 0.8;
            const heroWidth = landingHero.clientWidth;
            const heroHeight = landingHero.clientHeight;
            const edge = Math.floor(Math.random() * 4);

            if (edge === 0) {
                const startX = randomBetween(-size * 0.3, heroWidth - (size * 0.7));
                return {
                    startX,
                    startY: -margin,
                    endX: startX + randomBetween(-heroWidth * 0.25, heroWidth * 0.25),
                    endY: heroHeight + margin
                };
            }

            if (edge === 1) {
                const startY = randomBetween(-size * 0.3, heroHeight - (size * 0.7));
                return {
                    startX: heroWidth + margin,
                    startY,
                    endX: -margin,
                    endY: startY + randomBetween(-heroHeight * 0.25, heroHeight * 0.25)
                };
            }

            if (edge === 2) {
                const startX = randomBetween(-size * 0.3, heroWidth - (size * 0.7));
                return {
                    startX,
                    startY: heroHeight + margin,
                    endX: startX + randomBetween(-heroWidth * 0.25, heroWidth * 0.25),
                    endY: -margin
                };
            }

            const startY = randomBetween(-size * 0.3, heroHeight - (size * 0.7));
            return {
                startX: -margin,
                startY,
                endX: heroWidth + margin,
                endY: startY + randomBetween(-heroHeight * 0.25, heroHeight * 0.25)
            };
        }

        function maxAmbientCount() {
            return window.innerWidth <= 760 ? 2 : 4;
        }

        function removeAmbientTile(state) {
            ambientTiles.delete(state);
            unregisterState(state);
            if (state.tile.isConnected) {
                state.tile.remove();
            }
        }

        function spawnAmbientTile() {
            if (reducedMotion || document.hidden || ambientTiles.size >= maxAmbientCount()) {
                return;
            }

            const size = randomBetween(96, 240);
            const tile = document.createElement('div');
            tile.className = 'deco-rect deco-rect--ambient';
            tile.setAttribute('aria-hidden', 'true');
            tile.style.width = `${size.toFixed(0)}px`;
            tile.style.height = `${size.toFixed(0)}px`;

            const path = getAmbientPath(size);
            const initialImage = pickRandomImage();
            tile.style.left = `${path.startX.toFixed(1)}px`;
            tile.style.top = `${path.startY.toFixed(1)}px`;

            const state = registerState(buildTileState(tile, initialImage));
            ambientTiles.add(state);
            landingHero.appendChild(tile);

            const duration = 22000 + Math.random() * 14000;
            const rotation = randomBetween(-18, 18);
            const scale = randomBetween(0.92, 1.1);

            window.requestAnimationFrame(() => {
                tile.style.setProperty('--float-duration', `${duration}ms`);
                tile.style.setProperty('--float-x', `${(path.endX - path.startX).toFixed(1)}px`);
                tile.style.setProperty('--float-y', `${(path.endY - path.startY).toFixed(1)}px`);
                tile.style.setProperty('--float-rotate', `${rotation.toFixed(2)}deg`);
                tile.style.setProperty('--float-scale', scale.toFixed(3));
                tile.classList.add('is-active');
            });

            state.removeTimeout = window.setTimeout(() => {
                tile.classList.remove('is-active');
                tile.classList.add('is-leaving');
            }, Math.max(duration - 2600, 0));

            window.setTimeout(() => {
                removeAmbientTile(state);
            }, duration + 1200);
        }

        const usedImages = new Set();
        const states = decoRects.map((tile) => {
            const initialImage = pickRandomImage(usedImages);
            usedImages.add(initialImage);
            return registerState(buildTileState(tile, initialImage));
        });

        function swapImage(state) {
            if (!state.tile.isConnected) {
                unregisterState(state);
                return;
            }

            const nextIndex = state.activeIndex === 0 ? 1 : 0;
            const incomingLayer = state.layers[nextIndex];
            const outgoingLayer = state.layers[state.activeIndex];
            const nextImage = pickRandomImage([state.currentImage]);

            incomingLayer.classList.remove('is-visible');
            setLayerImage(incomingLayer, nextImage);

            window.requestAnimationFrame(() => {
                incomingLayer.classList.add('is-visible');
                outgoingLayer.classList.remove('is-visible');
            });

            state.activeIndex = nextIndex;
            state.currentImage = nextImage;
        }

        if (!reducedMotion) {
            window.requestAnimationFrame(() => {
                states.forEach((state) => scheduleFloat(state));
            });

            window.setTimeout(() => spawnAmbientTile(), 400);
            window.setTimeout(() => spawnAmbientTile(), 2400);
            window.setInterval(() => {
                spawnAmbientTile();
            }, 7000);
        }

        window.setInterval(() => {
            activeStates.forEach((state) => swapImage(state));
        }, 45000);
    }

    function slugify(value) {
        return value
            .toLowerCase()
            .replace(/&/g, ' and ')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function createButton(className, label, type = 'button') {
        const button = document.createElement('button');
        button.className = className;
        button.type = type;
        button.textContent = label;
        return button;
    }

    function getSavedPosts() {
        try {
            return JSON.parse(localStorage.getItem('underground_saved') || '{}');
        } catch {
            return {};
        }
    }

    function setSavedPosts(saved) {
        try {
            localStorage.setItem('underground_saved', JSON.stringify(saved));
        } catch {}
    }

    function createHeartButton() {
        const button = createButton('card-heart', '♡');
        button.setAttribute('aria-label', 'Save card');
        button.setAttribute('aria-pressed', 'false');
        return button;
    }

    function appendTextElement(parent, tagName, className, text) {
        const element = document.createElement(tagName);
        element.className = className;
        element.textContent = text;
        parent.appendChild(element);
        return element;
    }

    function applyCardMapData(element, card) {
        if (card.lat !== undefined) {
            element.dataset.lat = String(card.lat);
        }
        if (card.lng !== undefined) {
            element.dataset.lng = String(card.lng);
        }
    }

    function buildSquareCard(card) {
        const article = document.createElement('article');
        article.className = 'square-card';
        if (card.hero) {
            article.classList.add('feed-hero-card');
        }
        article.dataset.tags = card.tags.join(' ');
        applyCardMapData(article, card);

        const inner = document.createElement('div');
        inner.className = 'square-card-inner';
        article.appendChild(inner);

        const front = document.createElement('div');
        front.className = 'square-card-face square-card-front';
        if (card.imageSrc) {
            const image = document.createElement('img');
            image.src = card.imageSrc;
            image.alt = card.imageAlt || card.title;
            front.appendChild(image);
        } else {
            front.textContent = card.frontLabel || card.category;
        }
        inner.appendChild(front);

        const back = document.createElement('div');
        back.className = 'square-card-face square-card-back';
        back.appendChild(createHeartButton());
        appendTextElement(back, 'p', 'square-card-category', card.category);
        appendTextElement(back, 'p', 'square-card-title', card.title);
        appendTextElement(back, 'p', 'square-card-meta', card.meta);
        appendTextElement(back, 'p', 'square-card-desc', card.desc);
        appendTextElement(back, 'p', 'square-card-stats', card.stats);

        const action = createButton('square-card-btn', card.action || 'Details');
        back.appendChild(action);

        inner.appendChild(back);
        return article;
    }

    function buildWideCard(card) {
        const article = document.createElement('article');
        article.className = 'wide-card';
        article.dataset.tags = card.tags.join(' ');
        article.dataset.img = card.imageSrc;
        applyCardMapData(article, card);

        const inner = document.createElement('div');
        inner.className = 'wide-card-inner';
        article.appendChild(inner);

        const front = document.createElement('div');
        front.className = 'wide-card-face wide-card-front';
        const image = document.createElement('img');
        image.src = card.imageSrc;
        image.alt = card.imageAlt || card.title;
        front.appendChild(image);
        inner.appendChild(front);

        const back = document.createElement('div');
        back.className = 'wide-card-face wide-card-back';
        back.appendChild(createHeartButton());
        appendTextElement(back, 'p', 'wide-card-category', card.category);
        appendTextElement(back, 'p', 'wide-card-title', card.title);
        appendTextElement(back, 'p', 'wide-card-meta', card.meta);
        appendTextElement(back, 'p', 'wide-card-desc', card.desc);
        appendTextElement(back, 'p', 'wide-card-extra', card.stats);

        const action = createButton('wide-card-btn', card.action || 'Details');
        back.appendChild(action);

        inner.appendChild(back);
        return article;
    }

    const SHARED_CARD_PATCHES = {
        'Bravo! Design — 好好设计！': {
            meta: 'Chinatown · Manhattan · Oct 18 – Nov 27',
            stats: 'Free Entry',
            lat: 40.7158,
            lng: -73.997
        },
        "Summer Sonic '24": {
            meta: 'Flushing Meadows · Queens · May 20–22 · All Day',
            stats: '$125',
            lat: 40.7498,
            lng: -73.8447
        },
        'Bella Figura': {
            meta: 'Midtown · Manhattan · Apr 24–28 · 7:30 PM',
            stats: '$35',
            lat: 40.764,
            lng: -73.9808
        },
        'HerVision': {
            meta: 'Mott Haven · Bronx · Apr 27–28',
            stats: 'Free',
            lat: 40.8089,
            lng: -73.9228
        },
        'AUB Fest VII': {
            meta: 'Stapleton · Staten Island · Mar 22 · All Day',
            stats: 'Free',
            lat: 40.627,
            lng: -74.0757
        },
        'The Annex - Ridgewood': {
            meta: 'Ridgewood · Queens · 10am-8pm · Mon-Sat',
            stats: '$80/h',
            lat: 40.7043,
            lng: -73.9012
        },
        'Studio A - Bushwick': {
            meta: 'Bushwick · Brooklyn · 9am-9pm · Mon-Sat',
            stats: '$75/h',
            lat: 40.7051,
            lng: -73.928
        },
        'Camera & Lighting Gear Lending': {
            meta: 'Long Island City · Queens · 10am-6pm · Weekdays',
            stats: 'Free (members)',
            lat: 40.744,
            lng: -73.9489
        },
        'Camera & lighting gear lending': {
            meta: 'Long Island City · Queens · 10am-6pm · Weekdays',
            stats: 'Free (members)',
            lat: 40.744,
            lng: -73.9489
        },
        'Textile and Print Lab': {
            meta: 'Sunset Park · Brooklyn · 12pm-8pm · Tue-Sun',
            stats: '$20/session',
            lat: 40.6455,
            lng: -74.012
        },
        '1:1 Film Photography with Ana Costa': {
            meta: 'Lower East Side · Manhattan · By appointment',
            stats: 'Free',
            lat: 40.7208,
            lng: -73.9893
        },
        'Open Studio Weekend': {
            meta: 'Ridgewood · Queens · Sat-Sun · 1 PM',
            stats: 'Free',
            lat: 40.7043,
            lng: -73.9012
        },
        'Black Box New Works': {
            meta: 'Fort Greene · Brooklyn · Fri · 8 PM',
            stats: '$15',
            lat: 40.6876,
            lng: -73.9772
        },
        'Grant-writing office hours': {
            meta: 'Downtown Brooklyn · Brooklyn · Wednesdays · 6 PM',
            stats: 'Free',
            lat: 40.6905,
            lng: -73.9852
        },
        'Grant-writing Office Hours': {
            meta: 'Downtown Brooklyn · Brooklyn · Wednesdays · 6 PM',
            stats: 'Free',
            lat: 40.6905,
            lng: -73.9852
        }
    };

    const PAGE_LAYOUTS = {
        feed: {
            containerSelector: '.feed-grid',
            itemSelector: '.square-card',
            pageSize: 9,
            kind: 'square',
            paginationAnchorSelector: '.feed-grid'
        },
        events: {
            containerSelector: '.wide-card-list',
            itemSelector: '.wide-card',
            pageSize: 5,
            kind: 'wide',
            paginationAnchorSelector: '.split-layout',
            split: true
        },
        collabs: {
            containerSelector: '.three-grid',
            itemSelector: '.square-card',
            pageSize: 9,
            kind: 'square',
            paginationAnchorSelector: '.three-grid'
        },
        map: {
            containerSelector: '.wide-card-list',
            itemSelector: '.wide-card',
            pageSize: 5,
            kind: 'wide',
            paginationAnchorSelector: '.split-layout',
            split: true
        },
        profile: {
            containerSelector: '.three-grid',
            itemSelector: '.square-card',
            pageSize: 9,
            kind: 'square',
            paginationAnchorSelector: '.three-grid'
        }
    };

    const PAGE_CARD_PATCHES = {
        feed: {
            "Summer Sonic '24": { category: 'Events', tags: ['events', 'following'] },
            'DJ for underground warehouse party': { category: 'Collabs', tags: ['collabs', 'following'] },
            'Live musicians for jazz festival': { category: 'Collabs', tags: ['collabs'] },
            '1:1 Film Photography with Ana Costa': { category: 'Resources', tags: ['resources'] },
            'Artists for gallery group show': { category: 'Collabs', tags: ['collabs'] },
            'Bella Figura': { category: 'Events', tags: ['events'] },
            'Camera & lighting gear lending': { category: 'Resources', tags: ['resources'] },
            'Actors for indie short film': { category: 'Collabs', tags: ['collabs'] },
            'Dancer for music video shoot': { category: 'Collabs', tags: ['collabs', 'following'] }
        },
        events: {
            'Bravo! Design — 好好设计！': { tags: ['this-week', 'free', 'type'] },
            "Summer Sonic '24": { tags: ['this-week', 'type'] },
            'Bella Figura': { tags: ['tonight', 'this-week', 'type'] },
            'HerVision': { tags: ['this-week', 'free', 'type'] },
            'AUB Fest VII': { tags: ['free', 'type'] }
        },
        collabs: {
            'Typographer for print editorial': { tags: ['visual-arts'] },
            'Featured artist for K-pop collab': { tags: ['music'] },
            'Live musicians for jazz festival': { tags: ['music'] },
            'Vocalist for R&B mixtape': { tags: ['music'] },
            'Actors for indie short film': { tags: ['cinema'] },
            'DJ for underground warehouse party': { tags: ['music'] },
            'Dancer for music video shoot': { tags: ['dance'] },
            'B-boys for street performance': { tags: ['dance'] },
            'Artists for gallery group show': { tags: ['visual-arts'] }
        },
        map: {
            'The Annex - Ridgewood': { category: 'Spaces', tags: ['spaces'] },
            'Studio A - Bushwick': { category: 'Spaces', tags: ['spaces'] },
            'Camera & Lighting Gear Lending': { category: 'Equipment', tags: ['equipment'] },
            'Textile and Print Lab': { category: 'Materials', tags: ['materials'] },
            '1:1 Film Photography with Ana Costa': { category: 'Mentorship', tags: ['mentorship'] }
        },
        profile: {
            'Interactive mural study': {
                category: 'Work',
                tags: ['work'],
                desc: 'A mural system combining painted marks with touch-responsive projection for neighborhood storytelling.'
            },
            'Generative poster set': {
                category: 'Work',
                tags: ['work'],
                desc: 'A series of code-driven posters exploring pacing, grids, and motion-inspired typography.'
            },
            'Neighborhood media showcase': {
                category: 'Events',
                tags: ['events'],
                desc: 'A community showcase pairing projection, sound, and live demos from local artists.'
            },
            'Projection mapping masterclass': {
                category: 'Saved',
                tags: ['saved'],
                desc: 'A bookmarked workshop focused on site analysis, light placement, and projection workflows.'
            },
            'Ink and code studies': {
                category: 'Work',
                tags: ['work'],
                desc: 'An ongoing sketchbook translating hand-drawn marks into generative systems and print tests.'
            },
            'Looking for sound artist': {
                category: 'Collabs',
                tags: ['collabs'],
                desc: 'Seeking a collaborator to build a reactive sound layer for a new installation in progress.'
            },
            'Motion poster archive': {
                category: 'Work',
                tags: ['work'],
                desc: 'An archive of animated poster studies spanning typographic motion, looping identities, and title cards.'
            },
            'Crit session with Maya Lee': {
                category: 'Saved',
                tags: ['saved'],
                desc: 'A saved mentorship slot for a one-on-one critique focused on sequencing and presentation.'
            },
            'Downtown night projection': {
                category: 'Events',
                tags: ['events'],
                desc: 'An outdoor projection night testing responsive visuals against moving street conditions.'
            }
        }
    };

    const PAGE_SUPPLEMENTAL_CARDS = {
        feed: [
            {
                category: 'Events',
                title: 'Bravo! Design — 好好设计！',
                meta: 'Chinatown · Manhattan · Oct 18 – Nov 27',
                desc: 'A multilingual design showcase bringing together poster systems, editorial experiments, and graphic work from emerging studios.',
                stats: '128 saves · Exhibition',
                action: 'Details',
                imageSrc: 'assets/bravo-design-good-design.jpg',
                imageAlt: 'Bravo! Design exhibition poster',
                tags: ['events', 'following']
            },
            {
                category: 'Resources',
                title: 'The Annex - Ridgewood',
                meta: 'Ridgewood · Queens · 10am-8pm · Mon-Sat',
                desc: 'A bright multi-use studio with flexible floor space for rehearsals, critiques, shoots, and small community gatherings.',
                stats: '46 saves · Spaces',
                action: 'Details',
                imageSrc: 'assets/the-annex-ridgewood.jpg',
                imageAlt: 'Studio space interior',
                tags: ['resources']
            },
            {
                category: 'Collabs',
                title: 'Typographer for print editorial',
                meta: '@dmnd.txt · Brooklyn · Rev share',
                desc: 'Seeking a type-forward designer to help shape an indie editorial issue with bold spreads and tactile print details.',
                stats: '8 responses · Visual Arts',
                action: 'Details',
                imageSrc: 'assets/typographer-print-editorial.jpg',
                imageAlt: 'Typographic poster for editorial collab',
                tags: ['collabs', 'following']
            },
            {
                category: 'Portfolios',
                title: 'Motion poster archive',
                meta: '@tanaya.agarwal · NYC',
                desc: 'An archive of animated poster studies spanning typographic motion, looping identities, and title cards.',
                stats: '522 views · 1w ago',
                action: 'Details',
                imageSrc: 'assets/motion-poster-archive.png',
                imageAlt: 'Motion poster archive preview',
                tags: ['portfolios', 'following']
            },
            {
                category: 'Resources',
                title: 'Textile and Print Lab',
                meta: 'Sunset Park · Brooklyn · 12pm-8pm · Tue-Sun',
                desc: 'A hands-on lab for experimenting with fabric treatments, screen printing, and small-batch material prototyping.',
                stats: '31 saves · Materials',
                action: 'Details',
                imageSrc: 'assets/textile-print-lab.jpg',
                imageAlt: 'Textile and print lab',
                tags: ['resources']
            },
            {
                category: 'Events',
                title: 'Open Studio Weekend',
                meta: 'Ridgewood · Queens · Sat-Sun · 1 PM',
                desc: 'A two-day open studio trail with process tables, quick critiques, and rotating live demos from local artists.',
                stats: '72 going · Free',
                action: 'Details',
                imageSrc: 'assets/open-studio-weekend.jpg',
                imageAlt: 'Open studio event poster',
                tags: ['events']
            },
            {
                category: 'Collabs',
                title: '16mm camera operator for dance short',
                meta: '@framebyframe · Manhattan · Paid',
                desc: 'Looking for a film operator comfortable with handheld choreography coverage and fast-moving rehearsal environments.',
                stats: '5 responses · Cinema',
                action: 'Apply',
                imageSrc: 'assets/16mm-camera-operator-for-dance-short.jpg',
                imageAlt: 'Cinema collaboration call',
                tags: ['collabs']
            },
            {
                category: 'Portfolios',
                title: 'Generative poster set',
                meta: '@tanaya.agarwal · Manhattan',
                desc: 'A series of code-driven posters exploring pacing, grids, and motion-inspired typography.',
                stats: '296 views · 1d ago',
                action: 'Details',
                imageSrc: 'assets/generative-poster-set.png',
                imageAlt: 'Generative poster set preview',
                tags: ['portfolios', 'following']
            },
            {
                category: 'Resources',
                title: 'Grant-writing office hours',
                meta: 'Downtown Brooklyn · Brooklyn · Wednesdays · 6 PM',
                desc: 'Short mentorship sessions covering artist statements, budget framing, and application narratives for emerging grants.',
                stats: '14 saves · Mentorship',
                action: 'Book',
                imageSrc: 'assets/grant-writing-office-hours.jpg',
                imageAlt: 'Mentorship session',
                tags: ['resources']
            },
            {
                category: 'Events',
                title: 'Black Box New Works',
                meta: 'Fort Greene · Brooklyn · Fri · 8 PM',
                desc: 'A theatre night featuring staged readings, sound sketches, and audience feedback for works in progress.',
                stats: '39 going · Theatre',
                action: 'Details',
                imageSrc: 'assets/black-box-new-works.jpg',
                imageAlt: 'Black box theatre event',
                tags: ['events']
            },
            {
                category: 'Collabs',
                title: 'Set designer for storefront play',
                meta: '@brasshinge · Lower East Side · Stipend',
                desc: 'Seeking a designer to build a flexible modular set for an intimate storefront theatre production.',
                stats: '4 responses · Theatre',
                action: 'Apply',
                imageSrc: 'assets/set-designer-storefront-play.jpg',
                imageAlt: 'Theatre collaboration post',
                tags: ['collabs']
            }
        ],
        events: [
            {
                category: 'Performance',
                title: 'Rooftop Listening Session',
                meta: 'Bushwick · Brooklyn · Tonight · 8:30 PM',
                desc: 'A sunset-to-nightfall listening event pairing live ambient sets with projected visuals and informal artist intros.',
                stats: 'Free',
                action: 'Details',
                imageSrc: 'assets/rooftop-listening-session.jpg',
                imageAlt: 'Music event poster',
                tags: ['tonight', 'this-week', 'free', 'type'],
                lat: 40.7069,
                lng: -73.9214
            },
            {
                category: 'Open Studio',
                title: 'Open Studio Weekend',
                meta: 'Ridgewood · Queens · Sat-Sun · 1 PM',
                desc: 'A two-day open studio trail with process tables, quick critiques, and rotating live demos from neighborhood artists.',
                stats: 'Free',
                action: 'Details',
                imageSrc: 'assets/open-studio-weekend.jpg',
                imageAlt: 'Open studio weekend poster',
                tags: ['this-week', 'free', 'type'],
                lat: 40.7043,
                lng: -73.9012
            },
            {
                category: 'Screening',
                title: 'Microcinema: Soft Signals',
                meta: 'Chinatown · Manhattan · Thu · 7:30 PM',
                desc: 'A short-form screening night focused on experimental film, hybrid documentary, and artist talkbacks.',
                stats: '$12',
                action: 'Details',
                imageSrc: 'assets/microcinema-soft-signals.jpg',
                imageAlt: 'Microcinema screening poster',
                tags: ['this-week', 'type'],
                lat: 40.7193,
                lng: -74.0018
            },
            {
                category: 'Market',
                title: 'Downtown Zine Fair',
                meta: 'Lower East Side · Manhattan · Sun · 12 PM',
                desc: 'An afternoon of self-published books, mini-comics, print swaps, and table talks with local makers.',
                stats: 'Free',
                action: 'Details',
                imageSrc: 'assets/downtown-zine-fair.jpg',
                imageAlt: 'Zine fair poster',
                tags: ['this-week', 'free', 'type'],
                lat: 40.7208,
                lng: -73.9884
            },
            {
                category: 'Workshop',
                title: 'Clay + Sound Workshop',
                meta: 'Ridgewood · Queens · Sat · 3 PM',
                desc: 'A tactile workshop pairing hand-built clay forms with an intro to recording and layering found sound.',
                stats: '$18',
                action: 'Details',
                imageSrc: 'assets/clay-and-sound-workshop.jpg',
                imageAlt: 'Workshop poster',
                tags: ['this-week', 'type'],
                lat: 40.7041,
                lng: -73.902
            },
            {
                category: 'Dance',
                title: 'Midnight Movement Jam',
                meta: 'Bed-Stuy · Brooklyn · Tonight · 11 PM',
                desc: 'An open-floor dance session with rotating DJs, improvised lighting, and short set showcases throughout the night.',
                stats: '$10',
                action: 'Details',
                imageSrc: 'assets/midnight-movement-jam.jpg',
                imageAlt: 'Dance jam poster',
                tags: ['tonight', 'type'],
                lat: 40.686,
                lng: -73.9419
            },
            {
                category: 'Talk',
                title: 'Projection Mapping Crit Night',
                meta: 'Long Island City · Queens · Tonight · 7 PM',
                desc: 'A peer critique session sharing projection tests, spatial studies, and feedback on in-progress installations.',
                stats: 'Free',
                action: 'Details',
                imageSrc: 'assets/projection-mapping-crit-night.jpg',
                imageAlt: 'Projection mapping talk',
                tags: ['tonight', 'free', 'type'],
                lat: 40.744,
                lng: -73.9489
            },
            {
                category: 'Theatre',
                title: 'Black Box New Works',
                meta: 'Fort Greene · Brooklyn · Fri · 8 PM',
                desc: 'A theatre night featuring staged readings, sound sketches, and audience feedback for works in progress.',
                stats: '$15',
                action: 'Details',
                imageSrc: 'assets/black-box-new-works.jpg',
                imageAlt: 'Theatre event poster',
                tags: ['this-week', 'type'],
                lat: 40.6876,
                lng: -73.9772
            },
            {
                category: 'Performance',
                title: 'Neighborhood Tape Swap',
                meta: 'Bed-Stuy · Brooklyn · Tonight · 6 PM',
                desc: 'Bring a tape, trade a tape, and stay for short listening sets from neighborhood selectors and musicians.',
                stats: 'Free',
                action: 'Details',
                imageSrc: 'assets/neighborhood-tape-swap.jpg',
                imageAlt: 'Tape swap event',
                tags: ['tonight', 'free', 'type'],
                lat: 40.6872,
                lng: -73.9418
            },
            {
                category: 'Workshop',
                title: 'Analog Photo Walk',
                meta: 'Prospect Park · Brooklyn · Sat · 10 AM',
                desc: 'A guided film photo walk covering composition prompts, metering basics, and a quick critique over coffee.',
                stats: 'Free',
                action: 'Details',
                imageSrc: 'assets/analog-photo-walk.jpg',
                imageAlt: 'Photography walk poster',
                tags: ['this-week', 'free', 'type'],
                lat: 40.6602,
                lng: -73.969
            },
            {
                category: 'Performance',
                title: 'Basement Poetry Open Mic',
                meta: 'Chinatown · Manhattan · Tonight · 9 PM',
                desc: 'An intimate open mic for spoken word, text experiments, and improvised sound accompaniment.',
                stats: 'Free',
                action: 'Details',
                imageSrc: 'assets/basement-poetry-open-mic.jpg',
                imageAlt: 'Open mic poster',
                tags: ['tonight', 'free', 'type'],
                lat: 40.7195,
                lng: -74.0003
            },
            {
                category: 'Exhibition',
                title: 'Costume Lab Showcase',
                meta: 'Garment District · Manhattan · Sun · 5 PM',
                desc: 'A one-evening showcase of process garments, movement tests, and performance costume prototypes.',
                stats: '$8',
                action: 'Details',
                imageSrc: 'assets/costume-lab-showcase.jpg',
                imageAlt: 'Costume lab event poster',
                tags: ['this-week', 'type'],
                lat: 40.7527,
                lng: -73.9912
            },
            {
                category: 'Talk',
                title: 'Artists Union Town Hall',
                meta: 'Mott Haven · Bronx · Tonight · 6:30 PM',
                desc: 'A community conversation about fair pay, shared resources, and mutual support for independent creatives.',
                stats: 'Free',
                action: 'Details',
                imageSrc: 'assets/artists-union-town-hall.jpg',
                imageAlt: 'Town hall poster',
                tags: ['tonight', 'free', 'type'],
                lat: 40.8172,
                lng: -73.9113
            },
            {
                category: 'Performance',
                title: 'Lantern Parade Rehearsal',
                meta: 'Lower East Side · Manhattan · Thu · 7 PM',
                desc: 'A rehearsal gathering for a neighborhood procession mixing live drumming, movement prompts, and light sculptures.',
                stats: 'Free',
                action: 'Details',
                imageSrc: 'assets/lantern-parade-rehearsal.jpg',
                imageAlt: 'Lantern parade poster',
                tags: ['this-week', 'free', 'type'],
                lat: 40.716,
                lng: -73.9893
            },
            {
                category: 'Screening',
                title: 'Immersive Audio Preview',
                meta: 'Bushwick · Brooklyn · Tonight · 8 PM',
                desc: 'A preview session for an upcoming spatial audio installation with artist commentary and listening notes.',
                stats: '$14',
                action: 'Details',
                imageSrc: 'assets/immersive-audio-preview.jpg',
                imageAlt: 'Immersive audio event',
                tags: ['tonight', 'type'],
                lat: 40.7051,
                lng: -73.928
            }
        ],
        collabs: [
            {
                category: 'Theatre',
                title: 'Set designer for storefront play',
                meta: '@brasshinge · Lower East Side · Stipend',
                desc: 'Seeking a designer to build a flexible modular set for an intimate storefront theatre production.',
                stats: '4 responses · 1d ago',
                action: 'Apply',
                imageSrc: 'assets/set-designer-storefront-play.jpg',
                imageAlt: 'Set design call',
                tags: ['theatre']
            },
            {
                category: 'Cinema',
                title: '16mm camera operator for dance short',
                meta: '@framebyframe · Manhattan · Paid',
                desc: 'Looking for a film operator comfortable with handheld choreography coverage and fast-moving rehearsal environments.',
                stats: '5 responses · 2h ago',
                action: 'Apply',
                imageSrc: 'assets/16mm-camera-operator-for-dance-short.jpg',
                imageAlt: 'Camera operator call',
                tags: ['cinema']
            },
            {
                category: 'Visual Arts',
                title: 'Installation assistant for pop-up show',
                meta: '@roomtone.gallery · Chinatown · Paid',
                desc: 'Need an assistant to help install wall work, lighting cues, and a short-run gallery transformation.',
                stats: '6 responses · 3h ago',
                action: 'Apply',
                imageSrc: 'assets/installation-assistant-pop-up-show.jpg',
                imageAlt: 'Installation assistant call',
                tags: ['visual-arts']
            },
            {
                category: 'Music',
                title: 'Synth player for late-night session',
                meta: '@nightindex · Bushwick · Paid',
                desc: 'Looking for a synth player with atmospheric instincts for a short recording sprint and live test set.',
                stats: '10 responses · 1h ago',
                action: 'Apply',
                imageSrc: 'assets/synth-player-late-night-session.jpg',
                imageAlt: 'Music session call',
                tags: ['music']
            },
            {
                category: 'Dance',
                title: 'Choreographer for rooftop duet',
                meta: '@skytrace · Williamsburg · Paid',
                desc: 'Seeking a choreographer to shape an intimate duet for a rooftop film with long continuous takes.',
                stats: '3 responses · 6h ago',
                action: 'Apply',
                imageSrc: 'assets/choreographer-rooftop-duet.jpg',
                imageAlt: 'Choreographer call',
                tags: ['dance']
            },
            {
                category: 'Theatre',
                title: 'Stage manager for devised piece',
                meta: '@quietriot.stage · Brooklyn · Stipend',
                desc: 'Need a stage manager to support rehearsals, prompt transitions, and keep a collaborative devised team aligned.',
                stats: '2 responses · 8h ago',
                action: 'Apply',
                imageSrc: 'assets/stage-manager-devised-piece.jpg',
                imageAlt: 'Stage manager call',
                tags: ['theatre']
            },
            {
                category: 'Cinema',
                title: 'Editor for hybrid doc',
                meta: '@sidewalk.cut · Queens · Paid',
                desc: 'Looking for an editor to shape interviews, street footage, and animated inserts into a concise short doc.',
                stats: '7 responses · 9h ago',
                action: 'Apply',
                imageSrc: 'assets/editor-hybrid-doc.jpg',
                imageAlt: 'Film editor call',
                tags: ['cinema']
            },
            {
                category: 'Visual Arts',
                title: 'Printmaker for community poster drop',
                meta: '@blockprint.nyc · Harlem · Rev share',
                desc: 'Seeking a printmaker to help produce and distribute a neighborhood poster series tied to a public art action.',
                stats: '5 responses · 11h ago',
                action: 'Apply',
                imageSrc: 'assets/printmaker-community-poster-drop.jpg',
                imageAlt: 'Printmaking collaboration call',
                tags: ['visual-arts']
            },
            {
                category: 'Dance',
                title: 'Movement coach for theatre lab',
                meta: '@blackboxworks · Downtown · Paid',
                desc: 'Need a movement coach to help actors build physical vocabulary for a performance lab in development.',
                stats: '4 responses · 12h ago',
                action: 'Apply',
                imageSrc: 'assets/movement-coach-theatre-lab.jpg',
                imageAlt: 'Movement coach call',
                tags: ['dance']
            },
            {
                category: 'Theatre',
                title: 'Costume lead for movement theatre',
                meta: '@softarmor.stage · Manhattan · Paid',
                desc: 'Looking for a costume lead to develop flexible silhouettes that can shift from rehearsal room to performance.',
                stats: '6 responses · 1d ago',
                action: 'Apply',
                imageSrc: 'assets/costume-lead-movement-theatre.jpg',
                imageAlt: 'Costume collaboration call',
                tags: ['theatre']
            },
            {
                category: 'Cinema',
                title: 'Production designer for microbudget feature',
                meta: '@lowlight.film · Queens · Stipend',
                desc: 'Seeking a designer with a strong eye for found interiors, color systems, and material storytelling.',
                stats: '8 responses · 1d ago',
                action: 'Apply',
                imageSrc: 'assets/production-designer-microbudget-feature.jpg',
                imageAlt: 'Production designer call',
                tags: ['cinema']
            }
        ],
        map: [
            {
                category: 'Spaces',
                title: 'Canal Street Crit Room',
                meta: 'Chinatown · Manhattan · 2pm-10pm · Wed-Sun',
                desc: 'A compact review space with projector, pin-up walls, and flexible seating for critiques and presentations.',
                stats: '$35/h',
                action: 'Details',
                imageSrc: 'assets/canal-street-crit-room.jpg',
                imageAlt: 'Crit room resource',
                tags: ['spaces'],
                lat: 40.7193,
                lng: -74.0018
            },
            {
                category: 'Spaces',
                title: 'Queens Black Box',
                meta: 'Astoria · Queens · 11am-11pm · Daily',
                desc: 'A rehearsal-ready black box with simple lighting, sprung floor panels, and adaptable seating blocks.',
                stats: '$60/h',
                action: 'Details',
                imageSrc: 'assets/queens-black-box.jpg',
                imageAlt: 'Black box space',
                tags: ['spaces'],
                lat: 40.7644,
                lng: -73.9235
            },
            {
                category: 'Equipment',
                title: 'Portable PA Checkout',
                meta: 'Bed-Stuy · Brooklyn · 9am-6pm · Weekdays',
                desc: 'A lending setup with small speakers, mixer, mics, and cables for pop-up performances or workshops.',
                stats: '$15/day',
                action: 'Details',
                imageSrc: 'assets/portable-pa-checkout.jpg',
                imageAlt: 'Portable PA setup',
                tags: ['equipment'],
                lat: 40.6872,
                lng: -73.9418
            },
            {
                category: 'Materials',
                title: 'Risograph Paper Bar',
                meta: 'Greenpoint · Brooklyn · 1pm-7pm · Tue-Sat',
                desc: 'A materials station for specialty paper, test prints, inks, and short-run risograph troubleshooting.',
                stats: '$10/session',
                action: 'Details',
                imageSrc: 'assets/risograph-paper-bar.jpg',
                imageAlt: 'Risograph materials',
                tags: ['materials'],
                lat: 40.7296,
                lng: -73.9577
            },
            {
                category: 'Mentorship',
                title: 'Lighting Consult with Mara Ives',
                meta: 'Harlem · Manhattan · By appointment',
                desc: 'A one-hour consult covering cue planning, practical rig options, and low-budget lighting strategy.',
                stats: '$25',
                action: 'Book',
                imageSrc: 'assets/lighting-consult-mara-ives.jpg',
                imageAlt: 'Lighting mentorship',
                tags: ['mentorship'],
                lat: 40.8116,
                lng: -73.9465
            },
            {
                category: 'Equipment',
                title: 'Projector + Screen Bank',
                meta: 'Long Island City · Queens · 10am-6pm · Weekdays',
                desc: 'Reserve compact projectors, foldable screens, and mounting accessories for exhibitions or screenings.',
                stats: '$20/day',
                action: 'Details',
                imageSrc: 'assets/projector-screen-bank.jpg',
                imageAlt: 'Projector equipment bank',
                tags: ['equipment'],
                lat: 40.744,
                lng: -73.9489
            },
            {
                category: 'Materials',
                title: 'Fabric Remnant Wall',
                meta: 'Garment District · Manhattan · 12pm-8pm · Daily',
                desc: 'A community stock of donated fabric, offcuts, and trims for prototyping costumes or soft installations.',
                stats: 'Pay what you can',
                action: 'Details',
                imageSrc: 'assets/fabric-remnant-wall.jpg',
                imageAlt: 'Fabric materials wall',
                tags: ['materials'],
                lat: 40.7527,
                lng: -73.9912
            },
            {
                category: 'Mentorship',
                title: 'Grant-writing Office Hours',
                meta: 'Downtown Brooklyn · Brooklyn · Wednesdays · 6 PM',
                desc: 'Short mentorship sessions covering artist statements, budget framing, and application narratives.',
                stats: 'Free',
                action: 'Book',
                imageSrc: 'assets/grant-writing-office-hours.jpg',
                imageAlt: 'Grant writing mentorship',
                tags: ['mentorship'],
                lat: 40.6905,
                lng: -73.9852
            },
            {
                category: 'Spaces',
                title: 'Sunset Rooftop Deck',
                meta: 'Sunset Park · Brooklyn · 4pm-10pm · Thu-Sun',
                desc: 'A rooftop gathering space suited for intimate performances, listening sessions, and small projection tests.',
                stats: '$45/h',
                action: 'Details',
                imageSrc: 'assets/sunset-rooftop-deck.jpg',
                imageAlt: 'Rooftop event space',
                tags: ['spaces'],
                lat: 40.6455,
                lng: -74.012
            },
            {
                category: 'Equipment',
                title: 'Field Recorder Library',
                meta: 'Mott Haven · Bronx · 11am-5pm · Mon-Fri',
                desc: 'A check-out collection of handheld recorders, lavs, and simple monitoring kits for interviews and sound walks.',
                stats: '$12/day',
                action: 'Details',
                imageSrc: 'assets/field-recorder-library.jpg',
                imageAlt: 'Audio recording equipment',
                tags: ['equipment'],
                lat: 40.8089,
                lng: -73.9228
            },
            {
                category: 'Materials',
                title: 'Woodshop Offcut Depot',
                meta: 'Port Morris · Bronx · 10am-7pm · Tue-Sat',
                desc: 'An affordable pickup area for plywood offcuts, framing scraps, and small construction materials.',
                stats: '$8/bin',
                action: 'Details',
                imageSrc: 'assets/woodshop-offcut-depot.jpg',
                imageAlt: 'Woodshop materials',
                tags: ['materials'],
                lat: 40.8062,
                lng: -73.9117
            },
            {
                category: 'Mentorship',
                title: 'Portfolio Review with Ji Park',
                meta: 'Jackson Heights · Queens · Sundays · In person',
                desc: 'A review session for sequencing, web presentation, and shaping a cohesive portfolio narrative.',
                stats: '$30',
                action: 'Book',
                imageSrc: 'assets/portfolio-review-ji-park.jpg',
                imageAlt: 'Portfolio review mentorship',
                tags: ['mentorship'],
                lat: 40.7557,
                lng: -73.8831
            },
            {
                category: 'Materials',
                title: 'Paint Exchange Shelf',
                meta: 'Bushwick · Brooklyn · 1pm-8pm · Daily',
                desc: 'Swap partly used paint, primers, and scenic finishes with other makers working on installations and sets.',
                stats: 'Free',
                action: 'Details',
                imageSrc: 'assets/paint-exchange-shelf.jpg',
                imageAlt: 'Paint exchange shelf',
                tags: ['materials'],
                lat: 40.7069,
                lng: -73.9214
            },
            {
                category: 'Mentorship',
                title: 'Choreo Coaching with Amina Stone',
                meta: 'Upper West Side · Manhattan · By appointment',
                desc: 'A movement-focused coaching session for refining transitions, dynamics, and rehearsal structures.',
                stats: '$35',
                action: 'Book',
                imageSrc: 'assets/choreo-coaching-amina-stone.jpg',
                imageAlt: 'Choreography mentorship',
                tags: ['mentorship'],
                lat: 40.7861,
                lng: -73.9754
            },
            {
                category: 'Equipment',
                title: 'Sewing Machine Share',
                meta: 'St. George · Staten Island · 12pm-8pm · Tue-Sun',
                desc: 'Reserve industrial and domestic sewing stations for quick alterations, prototyping, and costume repairs.',
                stats: '$10/h',
                action: 'Details',
                imageSrc: 'assets/sewing-machine-share.jpg',
                imageAlt: 'Sewing machine resource',
                tags: ['equipment'],
                lat: 40.6437,
                lng: -74.0736
            }
        ],
        profile: [
            {
                category: 'Work',
                title: 'Signal mural prototype',
                meta: '@tanaya.agarwal · East Village',
                desc: 'An expanded mural prototype testing reactive line work, projector timing, and audience-triggered loops.',
                stats: '218 views · 3d ago',
                action: 'Details',
                frontLabel: 'Prototype',
                tags: ['work']
            },
            {
                category: 'Events',
                title: 'Open studio walkthrough',
                meta: '@tanaya.agarwal · Ridgewood',
                desc: 'A hosted walkthrough of works in progress, research sketches, and the technical setup behind a current installation.',
                stats: '41 going · Sun 2pm',
                action: 'Details',
                frontLabel: 'Open Studio',
                tags: ['events']
            },
            {
                category: 'Collabs',
                title: 'Looking for projection technician',
                meta: '@tanaya.agarwal · Brooklyn',
                desc: 'Seeking a collaborator to help calibrate projectors and optimize playback for an upcoming site test.',
                stats: '6 responses · 1d ago',
                action: 'Details',
                frontLabel: 'Collab',
                tags: ['collabs']
            },
            {
                category: 'Saved',
                title: 'Studio A booking draft',
                meta: '@resource.map · Bushwick',
                desc: 'A saved resource listing for an audio session tied to a future installation score.',
                stats: 'Saved yesterday',
                action: 'Details',
                frontLabel: 'Saved',
                tags: ['saved']
            },
            {
                category: 'Work',
                title: 'Neighborhood interface sketches',
                meta: '@tanaya.agarwal · Lower East Side',
                desc: 'A process set focused on interface fragments, annotation systems, and public-facing interaction prompts.',
                stats: '183 views · 4d ago',
                action: 'Details',
                frontLabel: 'Sketches',
                tags: ['work']
            },
            {
                category: 'Events',
                title: 'Projection test night',
                meta: '@tanaya.agarwal · SoHo',
                desc: 'A low-stakes outdoor test of color, motion, and brightness across a temporary downtown facade setup.',
                stats: '22 going · Thu 9pm',
                action: 'Details',
                frontLabel: 'Event',
                tags: ['events']
            },
            {
                category: 'Collabs',
                title: 'Seeking motion editor',
                meta: '@tanaya.agarwal · Manhattan',
                desc: 'Looking for a motion editor to help shape documentation clips, title cards, and portfolio reels.',
                stats: '4 responses · 2d ago',
                action: 'Details',
                frontLabel: 'Collab',
                tags: ['collabs']
            },
            {
                category: 'Work',
                title: 'Archive of poster loops',
                meta: '@tanaya.agarwal · NYC',
                desc: 'A browser-ready archive of moving posters, identity loops, and short animation systems built over the past year.',
                stats: '341 views · 5d ago',
                action: 'Details',
                frontLabel: 'Archive',
                tags: ['work']
            },
            {
                category: 'Saved',
                title: 'Sound critique with Elena Park',
                meta: '@creativecircle · Online',
                desc: 'A saved mentorship session focused on shaping sound cues for installation and performance contexts.',
                stats: 'Booked for Saturday',
                action: 'Details',
                frontLabel: 'Saved',
                tags: ['saved']
            },
            {
                category: 'Collabs',
                title: 'Need ceramic fabricator',
                meta: '@tanaya.agarwal · Queens',
                desc: 'Seeking a collaborator to help prototype modular ceramic forms for a mixed-media installation.',
                stats: '3 responses · 3d ago',
                action: 'Details',
                frontLabel: 'Collab',
                tags: ['collabs']
            },
            {
                category: 'Events',
                title: 'Artist talk on public systems',
                meta: '@tanaya.agarwal · Cooper Square',
                desc: 'A short artist talk on participation, public space interfaces, and translating research into exhibition form.',
                stats: '36 RSVPs · Mon 6pm',
                action: 'Details',
                frontLabel: 'Talk',
                tags: ['events']
            }
        ]
    };

    function getCurrentPageKey() {
        const fileName = window.location.pathname.split('/').pop().replace('.html', '');
        return PAGE_LAYOUTS[fileName] ? fileName : '';
    }

    const LIVE_MAP_CONFIG = {
        events: { containerId: 'eventsLiveMap' },
        map: { containerId: 'resourceLiveMap' }
    };

    const SVG_MAP_W = 590;
    const SVG_MAP_H = 460;
    const SVG_MAP_BOUNDS = { minLng: -74.27, maxLng: -73.68, minLat: 40.47, maxLat: 40.93 };

    const BOROUGH_SHAPES = [
        {
            id: 'bronx',
            coords: [
                [40.808, -73.917], [40.808, -73.830], [40.813, -73.765],
                [40.893, -73.749], [40.917, -73.848], [40.900, -73.934],
                [40.877, -73.931]
            ]
        },
        {
            id: 'manhattan',
            coords: [
                [40.878, -73.908], [40.863, -73.929], [40.848, -73.941],
                [40.820, -73.953], [40.795, -73.944], [40.770, -73.952],
                [40.748, -73.971], [40.720, -73.982], [40.701, -74.017],
                [40.698, -74.021], [40.705, -74.016], [40.725, -74.004],
                [40.745, -73.997], [40.769, -73.983], [40.798, -73.964],
                [40.820, -73.950], [40.845, -73.935], [40.870, -73.920]
            ]
        },
        {
            id: 'brooklyn',
            coords: [
                [40.703, -73.995], [40.680, -74.005], [40.645, -74.033],
                [40.617, -74.038], [40.598, -74.002], [40.552, -73.960],
                [40.590, -73.913], [40.650, -73.900], [40.698, -73.863],
                [40.730, -73.948]
            ]
        },
        {
            id: 'queens',
            coords: [
                [40.776, -73.918], [40.743, -73.941], [40.698, -73.863],
                [40.605, -73.757], [40.587, -73.770], [40.752, -73.700],
                [40.808, -73.700], [40.808, -73.830]
            ]
        },
        {
            id: 'staten-island',
            coords: [
                [40.643, -74.073], [40.644, -74.190], [40.570, -74.253],
                [40.500, -74.246], [40.505, -74.215], [40.558, -74.103],
                [40.595, -74.060], [40.636, -74.061]
            ]
        }
    ];

    const liveMapRegistry = new Map();

    function latlngToSvgPt(lat, lng) {
        const x = (lng - SVG_MAP_BOUNDS.minLng) / (SVG_MAP_BOUNDS.maxLng - SVG_MAP_BOUNDS.minLng) * SVG_MAP_W;
        const y = (SVG_MAP_BOUNDS.maxLat - lat) / (SVG_MAP_BOUNDS.maxLat - SVG_MAP_BOUNDS.minLat) * SVG_MAP_H;
        return [x, y];
    }

    function coordsToPath(coords) {
        return coords.map(([lat, lng], i) => {
            const [x, y] = latlngToSvgPt(lat, lng);
            return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
        }).join(' ') + ' Z';
    }

    function ensureLiveMap(pageKey) {
        const config = LIVE_MAP_CONFIG[pageKey];
        if (!config) return null;

        const existing = liveMapRegistry.get(pageKey);
        if (existing) return existing;

        const container = document.getElementById(config.containerId);
        if (!container) return null;

        const NS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('viewBox', `0 0 ${SVG_MAP_W} ${SVG_MAP_H}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        svg.style.cssText = 'width:100%;height:100%;display:block;';

        const defs = document.createElementNS(NS, 'defs');
        const filter = document.createElementNS(NS, 'filter');
        filter.setAttribute('id', `grain-${pageKey}`);
        filter.setAttribute('x', '0%');
        filter.setAttribute('y', '0%');
        filter.setAttribute('width', '100%');
        filter.setAttribute('height', '100%');
        const feTurbulence = document.createElementNS(NS, 'feTurbulence');
        feTurbulence.setAttribute('type', 'fractalNoise');
        feTurbulence.setAttribute('baseFrequency', '0.65');
        feTurbulence.setAttribute('numOctaves', '3');
        feTurbulence.setAttribute('stitchTiles', 'stitch');
        const feColorMatrix = document.createElementNS(NS, 'feColorMatrix');
        feColorMatrix.setAttribute('type', 'saturate');
        feColorMatrix.setAttribute('values', '0');
        const feBlend = document.createElementNS(NS, 'feBlend');
        feBlend.setAttribute('in', 'SourceGraphic');
        feBlend.setAttribute('in2', 'noise');
        feBlend.setAttribute('mode', 'multiply');
        filter.appendChild(feTurbulence);
        filter.appendChild(feColorMatrix);
        defs.appendChild(filter);
        svg.appendChild(defs);

        const bg = document.createElementNS(NS, 'rect');
        bg.setAttribute('width', SVG_MAP_W);
        bg.setAttribute('height', SVG_MAP_H);
        bg.setAttribute('fill', '#bfcdd9');
        svg.appendChild(bg);

        BOROUGH_SHAPES.forEach(({ id, coords }) => {
            const path = document.createElementNS(NS, 'path');
            path.setAttribute('d', coordsToPath(coords));
            path.setAttribute('class', `map-borough map-borough--${id}`);
            svg.appendChild(path);
        });

        const grain = document.createElementNS(NS, 'rect');
        grain.setAttribute('width', SVG_MAP_W);
        grain.setAttribute('height', SVG_MAP_H);
        grain.setAttribute('fill', 'transparent');
        grain.setAttribute('filter', `url(#grain-${pageKey})`);
        grain.setAttribute('opacity', '0.04');
        svg.appendChild(grain);

        const markersGroup = document.createElementNS(NS, 'g');
        markersGroup.setAttribute('class', 'map-markers');
        svg.appendChild(markersGroup);

        container.appendChild(svg);

        const state = { svg, markersGroup };
        liveMapRegistry.set(pageKey, state);
        return state;
    }

    function syncLiveMap(pageKey, items) {
        const state = ensureLiveMap(pageKey);
        if (!state) return;

        while (state.markersGroup.firstChild) {
            state.markersGroup.removeChild(state.markersGroup.firstChild);
        }

        const NS = 'http://www.w3.org/2000/svg';

        items.filter((item) => {
            const lat = Number(item.dataset.lat);
            const lng = Number(item.dataset.lng);
            return !item.hidden && Number.isFinite(lat) && Number.isFinite(lng);
        }).forEach((card) => {
            const [x, y] = latlngToSvgPt(Number(card.dataset.lat), Number(card.dataset.lng));

            const g = document.createElementNS(NS, 'g');
            g.setAttribute('class', 'map-pin');

            const ring = document.createElementNS(NS, 'circle');
            ring.setAttribute('cx', x);
            ring.setAttribute('cy', y);
            ring.setAttribute('r', '10');
            ring.setAttribute('class', 'map-pin-ring');

            const dot = document.createElementNS(NS, 'circle');
            dot.setAttribute('cx', x);
            dot.setAttribute('cy', y);
            dot.setAttribute('r', '4');
            dot.setAttribute('class', 'map-pin-dot');

            g.appendChild(ring);
            g.appendChild(dot);
            g.addEventListener('click', () => card.click());
            state.markersGroup.appendChild(g);
        });
    }

    function getCardTitle(card) {
        return getText(card, '.square-card-title') || getText(card, '.wide-card-title');
    }

    function ensureCardDesc(card, prefix, text) {
        let desc = card.querySelector(`.${prefix}-desc`);
        if (!desc) {
            desc = document.createElement('p');
            desc.className = `${prefix}-desc`;
            const back = card.querySelector(`.${prefix}-back`);
            const anchor = prefix === 'wide-card'
                ? card.querySelector('.wide-card-extra')
                : card.querySelector('.square-card-stats');
            if (anchor) {
                back.insertBefore(desc, anchor);
            } else {
                back.appendChild(desc);
            }
        }
        desc.textContent = text;
    }

    function applyCardPatch(card, patch) {
        const prefix = card.classList.contains('wide-card') ? 'wide-card' : 'square-card';
        if (patch.category) {
            const category = card.querySelector(`.${prefix}-category`);
            if (category) {
                category.textContent = patch.category;
            }
        }
        if (patch.meta) {
            const meta = card.querySelector(`.${prefix}-meta`);
            if (meta) {
                meta.textContent = patch.meta;
            }
        }
        if (patch.tags) {
            card.dataset.tags = patch.tags.join(' ');
        }
        if (patch.desc) {
            ensureCardDesc(card, prefix, patch.desc);
        }
        if (patch.stats) {
            const stats = card.querySelector(prefix === 'wide-card' ? '.wide-card-extra' : '.square-card-stats');
            if (stats) {
                stats.textContent = patch.stats;
            }
        }
        if (patch.action) {
            const action = card.querySelector(`.${prefix}-btn`);
            if (action) {
                action.textContent = patch.action;
            }
        }
        if (patch.lat !== undefined) {
            card.dataset.lat = String(patch.lat);
        }
        if (patch.lng !== undefined) {
            card.dataset.lng = String(patch.lng);
        }
    }

    function seedPageCards(pageKey) {
        const layout = PAGE_LAYOUTS[pageKey];
        if (!layout) {
            return;
        }

        const container = document.querySelector(layout.containerSelector);
        if (!container || container.dataset.seeded === 'true') {
            return;
        }

        const patches = PAGE_CARD_PATCHES[pageKey] || {};
        Array.from(container.querySelectorAll(layout.itemSelector)).forEach((card) => {
            const title = getCardTitle(card);
            const patch = {
                ...(SHARED_CARD_PATCHES[title] || {}),
                ...(patches[title] || {})
            };

            if (Object.keys(patch).length) {
                applyCardPatch(card, patch);
            }
        });

        const supplementalCards = PAGE_SUPPLEMENTAL_CARDS[pageKey] || [];
        supplementalCards.forEach((card) => {
            const patch = {
                ...card,
                ...(SHARED_CARD_PATCHES[card.title] || {}),
                ...(patches[card.title] || {})
            };
            const element = layout.kind === 'wide' ? buildWideCard(patch) : buildSquareCard(patch);
            container.appendChild(element);
        });

        if (pageKey === 'profile') {
            const saved = getSavedPosts();
            const existingTitles = new Set(
                Array.from(container.querySelectorAll(layout.itemSelector)).map(getCardTitle)
            );
            Object.values(saved).forEach((cardData) => {
                if (!existingTitles.has(cardData.title)) {
                    const element = buildSquareCard({ ...cardData, tags: ['saved'] });
                    container.appendChild(element);
                }
            });
        }

        container.dataset.seeded = 'true';
    }

    function setupPaginatedCollection(pageKey) {
        const layout = PAGE_LAYOUTS[pageKey];
        if (!layout) {
            return;
        }

        const container = document.querySelector(layout.containerSelector);
        if (!container) {
            return;
        }

        const items = Array.from(container.querySelectorAll(layout.itemSelector));
        if (!items.length) {
            return;
        }

        const filterGroup = document.querySelector('[data-tab-group]');
        const anchor = document.querySelector(layout.paginationAnchorSelector) || container;
        const pagination = document.createElement('nav');
        pagination.className = 'pagination';
        pagination.setAttribute('aria-label', 'Pagination');
        anchor.insertAdjacentElement('afterend', pagination);

        const activeChip = filterGroup ? filterGroup.querySelector('.filter-chip.active') : null;
        const state = {
            page: 1,
            filter: activeChip ? slugify(activeChip.textContent.trim()) : 'all'
        };

        function getFilteredItems() {
            if (state.filter === 'all') {
                return items;
            }

            return items.filter((item) => {
                const tags = item.dataset.tags ? item.dataset.tags.split(/\s+/) : [];
                return tags.includes(state.filter);
            });
        }

        function createPageButton(label, targetPage, disabled = false, active = false, extraClass = '') {
            const button = createButton('pagination-btn', label);
            button.dataset.page = String(targetPage);
            button.disabled = disabled;
            if (active) {
                button.classList.add('active');
            }
            if (extraClass) {
                button.classList.add(...extraClass.split(' '));
            }
            return button;
        }

        function createEllipsis() {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            return ellipsis;
        }

        function getVisiblePages(totalPages) {
            if (totalPages <= 7) {
                return Array.from({ length: totalPages }, (_, index) => index + 1);
            }

            const visible = new Set([1, totalPages, state.page]);
            if (state.page > 1) visible.add(state.page - 1);
            if (state.page < totalPages) visible.add(state.page + 1);
            if (state.page <= 3) {
                visible.add(2);
                visible.add(3);
            }
            if (state.page >= totalPages - 2) {
                visible.add(totalPages - 1);
                visible.add(totalPages - 2);
            }

            return [...visible].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
        }

        function renderPagination(totalItems, totalPages) {
            pagination.replaceChildren();

            const previous = createPageButton('Previous', state.page - 1, state.page === 1, false, 'pagination-btn--edge');
            const next = createPageButton('Next', state.page + 1, state.page === totalPages, false, 'pagination-btn--edge pagination-btn--next');
            const visiblePages = getVisiblePages(totalPages);

            pagination.appendChild(previous);

            visiblePages.forEach((page, index) => {
                const previousPage = visiblePages[index - 1];
                if (previousPage && page - previousPage > 1) {
                    pagination.appendChild(createEllipsis());
                }
                pagination.appendChild(createPageButton(String(page), page, false, page === state.page));
            });

            pagination.appendChild(next);
        }

        function renderPage() {
            const filteredItems = getFilteredItems();
            const totalPages = Math.max(1, Math.ceil(filteredItems.length / layout.pageSize));
            state.page = Math.min(state.page, totalPages);

            const start = (state.page - 1) * layout.pageSize;
            const visibleItems = new Set(filteredItems.slice(start, start + layout.pageSize));

            items.forEach((item) => {
                item.hidden = !visibleItems.has(item);
            });

            renderPagination(filteredItems.length, totalPages);
            syncLiveMap(pageKey, items);
        }

        pagination.addEventListener('click', (event) => {
            const button = event.target.closest('.pagination-btn');
            if (!button || button.disabled) {
                return;
            }

            state.page = Number(button.dataset.page);
            renderPage();
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        });

        if (filterGroup) {
            filterGroup.addEventListener('click', (event) => {
                const chip = event.target.closest('.filter-chip');
                if (!chip || !filterGroup.contains(chip)) {
                    return;
                }

                state.filter = slugify(chip.textContent.trim());
                state.page = 1;
                renderPage();
            });
        }

        renderPage();
    }

    // Connect Post buttons to post.html
    document.querySelectorAll('.btn-post').forEach((btn) => {
        if (!window.location.pathname.endsWith('post.html')) {
            btn.addEventListener('click', () => {
                window.location.href = 'post.html';
            });
        }
    });

    setupLandingMenu();
    setupLandingHero();

    const currentPageKey = getCurrentPageKey();
    if (currentPageKey) {
        seedPageCards(currentPageKey);
        setupPaginatedCollection(currentPageKey);
    }

    document.querySelectorAll('[data-tab-group]').forEach((group) => {
        group.addEventListener('click', (event) => {
            const chip = event.target.closest('.filter-chip');
            if (!chip || !group.contains(chip)) {
                return;
            }

            if (chip.tagName === 'A') {
                event.preventDefault();
            }

            group.querySelectorAll('.filter-chip').forEach((item) => item.classList.remove('active'));
            chip.classList.add('active');
        });
    });

    document.querySelectorAll('.card-heart').forEach((heart) => {
        heart.addEventListener('click', (event) => {
            event.stopPropagation();
            const liked = heart.classList.toggle('liked');
            heart.setAttribute('aria-pressed', liked ? 'true' : 'false');
            heart.textContent = liked ? '♥' : '♡';

            const card = heart.closest('.square-card, .wide-card');
            if (card) {
                const cardData = getCardData(card);
                const key = cardData.title;
                if (key) {
                    const saved = getSavedPosts();
                    if (liked) {
                        saved[key] = cardData;
                    } else {
                        delete saved[key];
                    }
                    setSavedPosts(saved);
                }
            }
        });
    });

    const _savedForRestore = getSavedPosts();
    document.querySelectorAll('.square-card, .wide-card').forEach((card) => {
        const title = getCardTitle(card);
        if (title && _savedForRestore[title]) {
            const heart = card.querySelector('.card-heart');
            if (heart) {
                heart.classList.add('liked');
                heart.setAttribute('aria-pressed', 'true');
                heart.textContent = '♥';
            }
        }
    });

    function setupModal(overlayId, modalId) {
        const overlay = document.getElementById(overlayId);
        const modal = document.getElementById(modalId);
        if (!overlay || !modal) {
            return null;
        }

        let closeButton = modal.querySelector('.feed-modal-close');
        if (!closeButton) {
            closeButton = document.createElement('button');
            closeButton.className = 'feed-modal-close';
            closeButton.type = 'button';
            closeButton.setAttribute('aria-label', 'Close');
            closeButton.textContent = '×';
            modal.appendChild(closeButton);
        }

        function close() {
            overlay.classList.remove('is-open');
            document.body.style.overflow = '';
        }

        overlay.addEventListener('click', (e) => {
            if (!modal.contains(e.target)) close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
        });

        closeButton.addEventListener('click', close);

        const heart = modal.querySelector('.feed-modal-heart');
        if (heart) {
            heart.addEventListener('click', () => {
                const liked = heart.classList.toggle('liked');
                heart.setAttribute('aria-pressed', liked ? 'true' : 'false');
                heart.textContent = liked ? '♥' : '♡';
            });
        }

        return { overlay, modal, close };
    }

    function getText(container, selector) {
        return container.querySelector(selector)?.textContent?.trim() || '';
    }

    function setModalImage(modal, src, alt) {
        const media = modal.querySelector('.feed-modal-media');
        if (!media) {
            return;
        }

        media.replaceChildren();

        if (!src) {
            return;
        }

        const img = document.createElement('img');
        img.src = src;
        img.alt = alt || '';
        img.classList.remove('is-visible');

        function revealImage() {
            window.setTimeout(() => {
                img.classList.add('is-visible');
            }, 140);
        }

        if (img.complete) {
            revealImage();
        } else {
            img.addEventListener('load', revealImage, { once: true });
        }

        media.appendChild(img);
    }

    function getCardData(card) {
        const isWideCard = card.classList.contains('wide-card');
        const prefix = isWideCard ? 'wide-card' : 'square-card';
        const frontImage = card.querySelector(`.${prefix}-front img`) || card.querySelector('img');

        return {
            category: getText(card, `.${prefix}-category`),
            title: getText(card, `.${prefix}-title`),
            meta: getText(card, `.${prefix}-meta`),
            desc: getText(card, `.${prefix}-desc`),
            stats: getText(card, isWideCard ? '.wide-card-extra' : '.square-card-stats'),
            action: getText(card, `.${prefix}-btn`),
            tags: (card.dataset.tags || '').split(/\s+/).filter(Boolean),
            imageSrc: frontImage?.getAttribute('src') || '',
            imageAlt: frontImage?.getAttribute('alt') || ''
        };
    }

    function bindCardModal({
        cardSelector,
        overlayId,
        modalId,
        categoryId,
        titleId,
        metaId,
        descId,
        statsId
    }) {
        const modalParts = setupModal(overlayId, modalId);
        if (!modalParts) {
            return;
        }

        const { overlay, modal } = modalParts;
        const category = document.getElementById(categoryId);
        const title = document.getElementById(titleId);
        const meta = document.getElementById(metaId);
        const desc = document.getElementById(descId);
        const stats = document.getElementById(statsId);
        const actionButton = modal.querySelector('.feed-modal-rsvp');
        const connectPanel = modal.querySelector('.feed-modal-connect');
        const connectAvatarLetter = connectPanel && connectPanel.querySelector('.connect-avatar-letter');
        const connectHandle = connectPanel && connectPanel.querySelector('.connect-poster-handle');
        const connectHeading = connectPanel && connectPanel.querySelector('.connect-heading');
        const backButton = connectPanel && connectPanel.querySelector('.connect-back');
        const connectActionsEl = connectPanel && connectPanel.querySelector('.connect-actions');
        const allConnectActions = connectPanel ? Array.from(connectPanel.querySelectorAll('.connect-action')) : [];
        const messageButton = allConnectActions[0] || null;
        const viewProfileButton = allConnectActions[1] || null;
        const followButton = connectPanel && connectPanel.querySelector('.connect-action--follow');
        let chatBox = null;
        let profilePreview = null;
        let rsvpForm = null;

        let currentCardData = null;
        let currentPanelView = 'hidden';
        let followState = false;

        function isEventCard(cardData) {
            if (!cardData) {
                return false;
            }

            return overlayId === 'eventOverlay'
                || cardData.tags.includes('events')
                || cardData.category.trim().toLowerCase() === 'events';
        }

        function extractHandle(metaText) {
            const match = metaText && metaText.match(/^(@[^\s·]+)/);
            return match ? match[1] : null;
        }

        function parseMetaParts(metaText) {
            return (metaText || '')
                .split('·')
                .map((part) => part.trim())
                .filter(Boolean);
        }

        function getHandleAndAvatar(cardData) {
            const handle = extractHandle(cardData.meta);
            const fallbackHandle = parseMetaParts(cardData.meta)[0] || cardData.title;
            const displayHandle = handle || fallbackHandle;
            const avatarLetter = handle
                ? handle.charAt(1).toUpperCase()
                : (displayHandle.charAt(0) || '?').toUpperCase();

            return { handle: displayHandle, avatarLetter };
        }

        function setConnectView(view) {
            if (!connectPanel) {
                return;
            }

            currentPanelView = view;
            const isReplacementPanel = view !== 'hidden' && view !== 'profile';
            modal.classList.toggle('is-panel-open', isReplacementPanel);
            modal.classList.toggle('is-profile-open', view === 'profile');
            connectPanel.hidden = view === 'hidden' || view === 'profile';
            if (backButton) backButton.hidden = view === 'hidden' || view === 'options';
            if (connectActionsEl) connectActionsEl.hidden = view !== 'options';
            if (chatBox) chatBox.hidden = view !== 'chat';
            if (profilePreview) profilePreview.hidden = view !== 'profile';
            if (rsvpForm) rsvpForm.hidden = view !== 'rsvp';
        }

        function setFollowState(isFollowed) {
            followState = Boolean(isFollowed);

            if (followButton) {
                followButton.classList.toggle('is-followed', followState);
                followButton.textContent = followState ? 'Following' : 'Follow';
            }

            if (profilePreview) {
                const previewFollow = profilePreview.querySelector('.connect-profile-follow');
                if (previewFollow) {
                    previewFollow.classList.toggle('is-followed', followState);
                    previewFollow.textContent = followState ? 'Following' : 'Follow';
                }
            }
        }

        function showConnectOptions() {
            setConnectView('options');
        }

        function resetConnectPanel() {
            if (rsvpForm) {
                rsvpForm.reset();
                rsvpForm.classList.remove('is-submitted');
                const status = rsvpForm.querySelector('.connect-rsvp-status');
                const submitButton = rsvpForm.querySelector('.connect-rsvp-submit');
                if (status) status.textContent = '';
                if (submitButton) submitButton.textContent = 'Submit RSVP';
            }

            if (!connectPanel) {
                return;
            }

            setConnectView('hidden');
        }

        function ensureChatBox() {
            if (chatBox || !connectPanel) {
                return chatBox;
            }

            chatBox = document.createElement('div');
            chatBox.className = 'connect-chat';
            chatBox.hidden = true;
            chatBox.innerHTML = `
                <div class="connect-chat-messages"></div>
                <div class="connect-chat-input-row">
                    <input class="connect-chat-input" type="text" placeholder="Type a message...">
                    <button class="connect-chat-send" type="button">Send</button>
                </div>
            `;
            connectPanel.appendChild(chatBox);

            const sendBtn = chatBox.querySelector('.connect-chat-send');
            const input = chatBox.querySelector('.connect-chat-input');
            const messagesEl = chatBox.querySelector('.connect-chat-messages');

            function sendMsg() {
                const text = input.value.trim();
                if (!text) return;
                const msg = document.createElement('div');
                msg.className = 'connect-chat-msg connect-chat-msg--sent';
                msg.textContent = text;
                messagesEl.appendChild(msg);
                input.value = '';
                messagesEl.scrollTop = messagesEl.scrollHeight;
            }

            sendBtn.addEventListener('click', sendMsg);
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMsg(); });
            return chatBox;
        }

        function ensureRsvpForm() {
            if (rsvpForm || !connectPanel) {
                return rsvpForm;
            }

            rsvpForm = document.createElement('form');
            rsvpForm.className = 'connect-rsvp';
            rsvpForm.hidden = true;
            rsvpForm.innerHTML = `
                <div class="connect-rsvp-fields">
                    <label class="connect-rsvp-field">
                        <span>Name</span>
                        <input class="connect-rsvp-input" name="name" type="text" placeholder="Your name" required>
                    </label>
                    <label class="connect-rsvp-field">
                        <span>Email</span>
                        <input class="connect-rsvp-input" name="email" type="email" placeholder="name@email.com" required>
                    </label>
                    <label class="connect-rsvp-field">
                        <span>Guests</span>
                        <div class="connect-rsvp-select-wrapper">
                            <select class="connect-rsvp-input" name="guests">
                                <option value="1">1 person</option>
                                <option value="2">2 people</option>
                                <option value="3">3 people</option>
                                <option value="4">4 people</option>
                            </select>
                        </div>
                    </label>
                    <label class="connect-rsvp-field">
                        <span>Notes</span>
                        <textarea class="connect-rsvp-textarea" name="notes" placeholder="Anything the host should know?"></textarea>
                    </label>
                </div>
                <div class="connect-rsvp-footer">
                    <button class="connect-rsvp-submit" type="submit">Submit RSVP</button>
                    <p class="connect-rsvp-status" aria-live="polite"></p>
                </div>
            `;
            connectPanel.appendChild(rsvpForm);

            const status = rsvpForm.querySelector('.connect-rsvp-status');
            const submitButton = rsvpForm.querySelector('.connect-rsvp-submit');

            rsvpForm.addEventListener('submit', (event) => {
                event.preventDefault();
                if (!rsvpForm.reportValidity()) {
                    return;
                }

                rsvpForm.classList.add('is-submitted');
                if (status) status.textContent = 'RSVP sent';
                if (submitButton) submitButton.textContent = 'Submitted';
            });

            return rsvpForm;
        }

        function ensureProfilePreview() {
            if (profilePreview) {
                return profilePreview;
            }

            profilePreview = document.createElement('div');
            profilePreview.className = 'connect-profile-preview';
            profilePreview.hidden = true;
            profilePreview.innerHTML = `
                <button class="connect-profile-back" type="button">← Back</button>
                <div class="profile-hero connect-profile-page-hero">
                    <div class="connect-profile-avatar"></div>
                    <h1 class="profile-username connect-profile-handle"></h1>
                    <p class="profile-subtitle connect-profile-subtitle"></p>
                    <p class="connect-profile-blurb"></p>
                    <p class="connect-profile-current"></p>
                    <div class="profile-stats connect-profile-stats">
                        <div class="profile-stat-card connect-profile-stat">
                            <span class="profile-stat-num connect-profile-stat-num">12</span>
                            <span class="profile-stat-label connect-profile-stat-label">Posts</span>
                        </div>
                        <div class="profile-stat-card connect-profile-stat">
                            <span class="profile-stat-num connect-profile-stat-num">11k</span>
                            <span class="profile-stat-label connect-profile-stat-label">Followers</span>
                        </div>
                        <div class="profile-stat-card connect-profile-stat">
                            <span class="profile-stat-num connect-profile-stat-num">8</span>
                            <span class="profile-stat-label connect-profile-stat-label">Collabs</span>
                        </div>
                    </div>
                    <button class="connect-profile-follow" type="button">Follow</button>
                </div>
<section class="three-grid connect-profile-grid" aria-label="Profile preview cards">
                    <article class="connect-profile-card connect-profile-card--feature">
                        <div class="connect-profile-card-media"></div>
                        <p class="connect-profile-card-category"></p>
                        <p class="connect-profile-card-title"></p>
                        <p class="connect-profile-card-copy"></p>
                    </article>
                    <article class="connect-profile-card">
                        <p class="connect-profile-card-category">Work</p>
                        <p class="connect-profile-card-title">Process archive</p>
                        <p class="connect-profile-card-copy">Notes, iterations, and image studies from recent projects.</p>
                    </article>
                    <article class="connect-profile-card">
                        <p class="connect-profile-card-category">Events</p>
                        <p class="connect-profile-card-title">Upcoming appearances</p>
                        <p class="connect-profile-card-copy">Talks, open studios, and installations happening this month.</p>
                    </article>
                    <article class="connect-profile-card">
                        <p class="connect-profile-card-category">Saved</p>
                        <p class="connect-profile-card-title">Inspiration stack</p>
                        <p class="connect-profile-card-copy">Collected references, spaces, and conversations shaping the next post.</p>
                    </article>
                </section>
            `;
            modal.appendChild(profilePreview);

            const profileBackButton = profilePreview.querySelector('.connect-profile-back');
            const previewFollowButton = profilePreview.querySelector('.connect-profile-follow');

            profileBackButton.addEventListener('click', () => showConnectOptions());
            previewFollowButton.addEventListener('click', () => {
                setFollowState(!followState);
            });

            return profilePreview;
        }

        function fillRespondIdentity(cardData, mode = 'respond') {
            if (!connectPanel) {
                return;
            }

            const { handle, avatarLetter } = getHandleAndAvatar(cardData);
            const metaParts = parseMetaParts(cardData.meta);
            const metaWithoutHandle = metaParts.filter((part) => part !== handle && !part.startsWith('@'));

            if (connectAvatarLetter) connectAvatarLetter.textContent = avatarLetter;
            if (connectHandle) connectHandle.textContent = handle;
            if (connectHeading) {
                if (mode === 'rsvp') {
                    connectHeading.textContent = `RSVP for ${cardData.title}`;
                } else {
                    connectHeading.textContent = metaWithoutHandle.length
                        ? `${cardData.category} · ${metaWithoutHandle.join(' · ')}`
                        : `Respond to this ${cardData.category.toLowerCase()}`;
                }
            }
        }

        function openChatView() {
            const chat = ensureChatBox();
            if (!chat || !connectPanel) {
                return;
            }

            setConnectView('chat');
        }

        function openProfilePreview() {
            if (!currentCardData) {
                return;
            }

            const preview = ensureProfilePreview();
            const { handle, avatarLetter } = getHandleAndAvatar(currentCardData);
            const metaParts = parseMetaParts(currentCardData.meta);
            const metaWithoutHandle = metaParts.filter((part) => part !== handle && !part.startsWith('@'));
            const previewHandle = preview.querySelector('.connect-profile-handle');
            const previewAvatar = preview.querySelector('.connect-profile-avatar');
            const previewBlurb = preview.querySelector('.connect-profile-blurb');
            const previewCurrent = preview.querySelector('.connect-profile-current');
            const previewSubtitle = preview.querySelector('.connect-profile-subtitle');
            const previewCardMedia = preview.querySelector('.connect-profile-card-media');
            const previewCardCategory = preview.querySelector('.connect-profile-card-category');
            const previewCardTitle = preview.querySelector('.connect-profile-card-title');
            const previewCardCopy = preview.querySelector('.connect-profile-card-copy');
            previewHandle.textContent = handle;
            previewSubtitle.textContent = metaWithoutHandle.length
                ? metaWithoutHandle.join(' · ')
                : currentCardData.category;
            previewAvatar.textContent = avatarLetter;
            previewBlurb.textContent = currentCardData.desc || `${handle} is active in ${currentCardData.category.toLowerCase()}.`;
            previewCurrent.textContent = `${currentCardData.category} · ${currentCardData.stats}`;

            previewCardCategory.textContent = currentCardData.category;
            previewCardTitle.textContent = currentCardData.title;
            previewCardCopy.textContent = currentCardData.meta;
            previewCardMedia.replaceChildren();

            if (currentCardData.imageSrc) {
                const img = document.createElement('img');
                img.src = currentCardData.imageSrc;
                img.alt = currentCardData.imageAlt || currentCardData.title;
                previewCardMedia.appendChild(img);
            } else {
                previewCardMedia.textContent = currentCardData.category;
            }

            setFollowState(followState);
            setConnectView('profile');
        }

        function openRsvpView() {
            if (!currentCardData || !connectPanel) {
                return;
            }

            resetConnectPanel();
            ensureRsvpForm();
            fillRespondIdentity(currentCardData, 'rsvp');
            setConnectView('rsvp');
        }

        function openModal(card) {
            const cardData = getCardData(card);
            currentCardData = cardData;
            setFollowState(false);
            resetConnectPanel();

            if (category) {
                category.textContent = cardData.category;
            }
            if (title) {
                title.textContent = cardData.title;
            }
            if (meta) {
                meta.textContent = cardData.meta;
            }
            if (desc) {
                desc.textContent = cardData.desc;
            }
            if (stats) {
                stats.textContent = cardData.stats;
            }
            if (actionButton) {
                actionButton.textContent = isEventCard(cardData) ? 'RSVP' : 'Respond';
            }

            setModalImage(modal, cardData.imageSrc, cardData.imageAlt || cardData.title);
            overlay.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        }

        if (actionButton && connectPanel) {
            actionButton.addEventListener('click', () => {
                if (!currentCardData) return;

                if (isEventCard(currentCardData)) {
                    openRsvpView();
                    return;
                }

                fillRespondIdentity(currentCardData);
                showConnectOptions();
            });
        }

        if (backButton) {
            backButton.hidden = true;
            backButton.addEventListener('click', () => {
                if (currentPanelView === 'chat' || currentPanelView === 'profile') {
                    showConnectOptions();
                    return;
                }

                if (currentPanelView === 'rsvp') {
                    resetConnectPanel();
                }
            });
        }

        if (messageButton && connectActionsEl) {
            messageButton.addEventListener('click', () => {
                openChatView();
            });
        }

        if (viewProfileButton) {
            viewProfileButton.addEventListener('click', () => {
                openProfilePreview();
            });
        }

        if (followButton) {
            followButton.addEventListener('click', () => {
                setFollowState(!followState);
            });
        }

        document.querySelectorAll(cardSelector).forEach((card) => {
            card.addEventListener('click', (event) => {
                if (event.target.closest('.card-heart')) {
                    return;
                }

                openModal(card);
            });
        });
    }

    bindCardModal({
        cardSelector: '.wide-card',
        overlayId: 'eventOverlay',
        modalId: 'eventModal',
        categoryId: 'eventModalCategory',
        titleId: 'eventModalTitle',
        metaId: 'eventModalMeta',
        descId: 'eventModalDesc',
        statsId: 'eventModalStats'
    });

    bindCardModal({
        cardSelector: '.square-card',
        overlayId: 'feedOverlay',
        modalId: 'feedModal',
        categoryId: 'modalCategory',
        titleId: 'modalTitle',
        metaId: 'modalMeta',
        descId: 'modalDesc',
        statsId: 'modalStats'
    });

    bindCardModal({
        cardSelector: '.square-card',
        overlayId: 'collabOverlay',
        modalId: 'collabModal',
        categoryId: 'collabModalCategory',
        titleId: 'collabModalTitle',
        metaId: 'collabModalMeta',
        descId: 'collabModalDesc',
        statsId: 'collabModalStats'
    });

    bindCardModal({
        cardSelector: '.wide-card',
        overlayId: 'mapOverlay',
        modalId: 'mapModal',
        categoryId: 'mapModalCategory',
        titleId: 'mapModalTitle',
        metaId: 'mapModalMeta',
        descId: 'mapModalDesc',
        statsId: 'mapModalStats'
    });
})();
