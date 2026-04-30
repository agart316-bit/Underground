(() => {
    const typeGroup = document.querySelector('[data-post-type-group]');
    const allForms = document.querySelectorAll('.post-form');

    function getActiveForm() {
        return document.querySelector('.post-form:not([hidden])');
    }

    function val(form, name) {
        const el = form.querySelector(`[name="${name}"]`);
        return el ? el.value.trim() : '';
    }

    function setText(id, text, isPlaceholder) {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = text;
        el.classList.toggle('is-placeholder', Boolean(isPlaceholder));
    }

    function updatePreview() {
        const form = getActiveForm();
        if (!form) return;
        const type = form.id.replace('form-', '');
        const previewRsvp = document.getElementById('previewRsvp');

        switch (type) {
            case 'collabs': {
                const project = val(form, 'project');
                const timeline = val(form, 'timeline');
                const location = val(form, 'location');
                const desc = val(form, 'description');
                const metaParts = ['@tanaya.agarwal'];
                if (location) metaParts.push(location);
                if (timeline) metaParts.push(timeline);
                setText('previewType', 'Collab Call');
                setText('previewTitle', project || 'Project', !project);
                setText('previewMeta', metaParts.join(' · '));
                setText('previewDesc', desc || 'Description', !desc);
                if (previewRsvp) previewRsvp.textContent = 'RSVP';
                break;
            }
            case 'events': {
                const title = val(form, 'title');
                const date = val(form, 'date');
                const location = val(form, 'location');
                const cost = val(form, 'cost');
                const desc = val(form, 'description');
                const metaParts = ['@tanaya.agarwal'];
                if (location) metaParts.push(location);
                if (date) metaParts.push(date);
                if (cost) metaParts.push(cost);
                setText('previewType', 'Event');
                setText('previewTitle', title || 'Event Title', !title);
                setText('previewMeta', metaParts.join(' · '));
                setText('previewDesc', desc || 'Description', !desc);
                if (previewRsvp) previewRsvp.textContent = 'RSVP';
                break;
            }
            case 'portfolio': {
                const title = val(form, 'title');
                const medium = val(form, 'medium');
                const desc = val(form, 'description');
                const metaParts = ['@tanaya.agarwal'];
                if (medium) metaParts.push(medium);
                setText('previewType', 'Portfolio');
                setText('previewTitle', title || 'Project Title', !title);
                setText('previewMeta', metaParts.join(' · '));
                setText('previewDesc', desc || 'Description', !desc);
                if (previewRsvp) previewRsvp.textContent = 'View';
                break;
            }
            case 'resources': {
                const name = val(form, 'name');
                const location = val(form, 'location');
                const cost = val(form, 'cost');
                const hours = val(form, 'hours');
                const desc = val(form, 'description');
                const metaParts = [];
                if (location) metaParts.push(location);
                if (hours) metaParts.push(hours);
                if (cost) metaParts.push(cost);
                setText('previewType', 'Resource');
                setText('previewTitle', name || 'Resource Name', !name);
                setText('previewMeta', metaParts.join(' · ') || '@tanaya.agarwal');
                setText('previewDesc', desc || 'Description', !desc);
                if (previewRsvp) previewRsvp.textContent = 'Details';
                break;
            }
        }
    }

    // Tab switching
    if (typeGroup) {
        typeGroup.addEventListener('click', (e) => {
            const chip = e.target.closest('.filter-chip');
            if (!chip || !typeGroup.contains(chip)) return;
            const type = chip.dataset.type;
            if (!type) return;

            typeGroup.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            allForms.forEach(f => { f.hidden = (f.id !== `form-${type}`); });

            const previewImage = document.getElementById('previewImage');
            if (previewImage) { previewImage.src = ''; previewImage.hidden = true; }

            updatePreview();
        });
    }

    // Category selection — single select per form
    document.querySelectorAll('.post-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const form = btn.closest('.post-form');
            if (!form) return;
            form.querySelectorAll('.post-cat-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    // Live preview on input
    document.querySelectorAll('.post-form input, .post-form textarea').forEach(el => {
        el.addEventListener('input', updatePreview);
    });

    // Image upload — show filename + preview
    document.querySelectorAll('.post-upload-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const container = input.closest('.post-upload');
            const filenameEl = container && container.querySelector('.post-upload-filename');
            if (filenameEl) filenameEl.textContent = file.name;
            const reader = new FileReader();
            reader.onload = (evt) => {
                const previewImage = document.getElementById('previewImage');
                if (previewImage) { previewImage.src = evt.target.result; previewImage.hidden = false; }
            };
            reader.readAsDataURL(file);
        });
    });

    // Form submission — save data to sessionStorage and navigate to success page
    document.querySelectorAll('.post-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = form.id.replace('form-', '');
            const data = { type };
            form.querySelectorAll('[name]').forEach(el => {
                data[el.name] = el.value.trim();
            });
            sessionStorage.setItem('postData', JSON.stringify(data));
            window.location.href = 'post-success.html';
        });
    });


    updatePreview();
})();
