(() => {
    const data = JSON.parse(sessionStorage.getItem('postData') || '{}');
    const type = data.type || 'collabs';

    const typeLabels = {
        collabs: 'Collab Call',
        events: 'Event',
        portfolio: 'Portfolio',
        resources: 'Resource'
    };

    const headlineMap = {
        collabs: 'Your collab call is live!',
        events: 'Your event is live!',
        portfolio: 'Your portfolio is live!',
        resources: 'Your resource is live!'
    };

    const subMap = {
        collabs: 'Underground is notifying 47 matching creators automatically.',
        events: 'Underground is notifying 47 matching attendees automatically.',
        portfolio: 'Underground is sharing your work with 47 matching creators automatically.',
        resources: 'Underground is notifying 47 matching creators automatically.'
    };

    const viewLinkMap = {
        collabs: 'collabs.html',
        events: 'events.html',
        portfolio: 'profile.html',
        resources: 'map.html'
    };

    const title = data.project || data.title || data.name || 'Your Post';
    const location = data.location || '';
    const timeline = data.timeline || data.date || '';
    const desc = data.description || '';

    const metaParts = ['@tanaya.agarwal'];
    if (location) metaParts.push(location);
    if (timeline) metaParts.push(timeline);

    function truncate(str, maxLen) {
        return str.length > maxLen ? str.slice(0, maxLen) + '...' : str;
    }

    document.getElementById('successHeadline').textContent = headlineMap[type] || 'Your post is live!';
    document.getElementById('successSub').textContent = subMap[type] || subMap.collabs;
    document.getElementById('successType').textContent = typeLabels[type] || 'Post';
    document.getElementById('successTitle').textContent = truncate(title, 40);
    document.getElementById('successMeta').textContent = metaParts.join(' · ');
    document.getElementById('successDesc').textContent = truncate(desc, 70);

    const viewBtn = document.getElementById('viewPostBtn');
    if (viewBtn) viewBtn.href = viewLinkMap[type] || 'feed.html';
})();
