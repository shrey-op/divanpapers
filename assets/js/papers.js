document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const toggleFilters = document.getElementById('toggle-filters');
    const filtersPanel = document.getElementById('filters-panel');
    const applyFilters = document.getElementById('apply-filters');
    const resetFilters = document.getElementById('reset-filters');
    const papersGrid = document.getElementById('papers-grid');

    // Toggle filters panel
    toggleFilters.addEventListener('click', () => {
        const isHidden = filtersPanel.style.display === 'none';
        filtersPanel.style.display = isHidden ? 'block' : 'none';
        toggleFilters.textContent = isHidden ? 'Hide Filters' : 'Show Filters';
    });

    // Reset filters
    resetFilters.addEventListener('click', () => {
        document.getElementById('filter-categories').selectedIndex = -1;
        document.getElementById('filter-language').selectedIndex = 0;
        document.getElementById('filter-date-from').value = '';
        document.getElementById('filter-date-to').value = '';
        document.getElementById('filter-sort').selectedIndex = 0;
        searchInput.value = '';
        loadPapers();
    });

    // Search and filter papers
    const searchPapers = () => {
        const query = searchInput.value.toLowerCase();
        const categories = Array.from(document.getElementById('filter-categories').selectedOptions).map(opt => opt.value);
        const language = document.getElementById('filter-language').value;
        const dateFrom = document.getElementById('filter-date-from').value;
        const dateTo = document.getElementById('filter-date-to').value;
        const sortBy = document.getElementById('filter-sort').value;

        loadPapers({ query, categories, language, dateFrom, dateTo, sortBy });
    };

    searchButton.addEventListener('click', searchPapers);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchPapers();
    });
    applyFilters.addEventListener('click', searchPapers);

    // Load papers from Firebase
    async function loadPapers(filters = {}) {
        papersGrid.innerHTML = '<div class="loading-spinner">Loading papers...</div>';

        try {
            let query = firebase.database().ref('papers');

            // Apply sorting
            if (filters.sortBy) {
                switch (filters.sortBy) {
                    case 'date-desc':
                        query = query.orderByChild('uploadDate');
                        break;
                    case 'date-asc':
                        query = query.orderByChild('uploadDate');
                        break;
                    case 'title-asc':
                        query = query.orderByChild('title');
                        break;
                    case 'title-desc':
                        query = query.orderByChild('title');
                        break;
                }
            } else {
                // Default sort by newest first
                query = query.orderByChild('uploadDate');
            }

            const snapshot = await query.once('value');
            let papers = [];

            snapshot.forEach(child => {
                papers.push({
                    id: child.key,
                    ...child.val()
                });
            });

            // Apply filters
            papers = papers.filter(paper => {
                if (filters.query) {
                    const searchFields = [
                        paper.title,
                        paper.authors.join(' '),
                        paper.abstract,
                        paper.keywords.join(' ')
                    ].map(field => field.toLowerCase());
                    
                    if (!searchFields.some(field => field.includes(filters.query))) {
                        return false;
                    }
                }

                if (filters.categories?.length > 0) {
                    if (!paper.categories.some(cat => filters.categories.includes(cat))) {
                        return false;
                    }
                }

                if (filters.language && paper.language !== filters.language) {
                    return false;
                }

                if (filters.dateFrom && new Date(paper.publicationDate) < new Date(filters.dateFrom)) {
                    return false;
                }

                if (filters.dateTo && new Date(paper.publicationDate) > new Date(filters.dateTo)) {
                    return false;
                }

                return true;
            });

            // Apply sort direction
            if (filters.sortBy?.includes('-desc')) {
                papers.reverse();
            }

            // Render papers
            if (papers.length === 0) {
                papersGrid.innerHTML = '<div class="no-results">No papers found matching your criteria</div>';
                return;
            }

            papersGrid.innerHTML = papers.map(paper => `
                <div class="paper-card">
                    <h3 class="paper-title">${paper.title}</h3>
                    <div class="paper-authors">${paper.authors.join(', ')}</div>
                    <p class="paper-abstract">${paper.abstract}</p>
                    <div class="paper-metadata">
                        ${paper.categories.map(cat => `<span class="paper-tag">${cat}</span>`).join('')}
                        <span class="paper-tag">${paper.language}</span>
                    </div>
                    <div class="paper-actions">
                        <a href="${paper.paperUrl}" target="_blank" class="btn-primary">Download PDF</a>
                        <span class="paper-date">${new Date(paper.uploadDate).toLocaleDateString()}</span>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Error loading papers:', error);
            papersGrid.innerHTML = '<div class="error">Error loading papers. Please try again later.</div>';
        }
    }

    // Initial load
    loadPapers();
});
