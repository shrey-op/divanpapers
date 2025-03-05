// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
let isDarkMode = localStorage.getItem('darkMode') === 'true';

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDarkMode);
}

themeToggle.addEventListener('click', toggleTheme);

// Initialize theme
document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
themeToggle.textContent = isDarkMode ? '☀️' : '🌙';

// Authentication state handling
const authButton = document.getElementById('auth-button');
const authRequired = document.querySelectorAll('.auth-required');

// Add tooltips to auth-required elements
authRequired.forEach(element => {
    element.setAttribute('data-tooltip', 'Login required');
});

// Handle authentication state changes
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        authButton.textContent = user.displayName || 'Logout';
        authButton.onclick = () => {
            firebase.auth().signOut().then(() => {
                window.location.href = 'index.html';
            });
        };

        // Show protected elements
        authRequired.forEach(element => {
            element.removeAttribute('data-tooltip');
        });
    } else {
        // User is signed out
        authButton.textContent = 'Login';
        authButton.onclick = () => window.location.href = 'login.html';

        // Add tooltips to protected elements
        authRequired.forEach(element => {
            element.setAttribute('data-tooltip', 'Login required');
        });

        // Redirect if on a protected page
        const protectedPages = ['upload.html', 'profile.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (protectedPages.includes(currentPage)) {
            window.location.href = 'login.html';
        }
    }
});

// Initialize auth button
if (authButton && window.location.pathname.includes('login.html')) {
    authButton.style.display = 'none';
}

// Sample data for trending and recent papers
const samplePapers = [
    {
        title: 'Introduction to Machine Learning',
        subject: 'Computer Science',
        class: '12',
        uploadDate: '2025-03-01',
        downloads: 156
    },
    {
        title: 'Advanced Calculus',
        subject: 'Mathematics',
        class: '11',
        uploadDate: '2025-03-02',
        downloads: 142
    },
    // Add more sample papers as needed
];

// Render paper cards
function createPaperCard(paper) {
    return `
        <div class="paper-card">
            <h3>${paper.title}</h3>
            <div class="metadata">
                <p>Subject: ${paper.subject}</p>
                <p>Class: ${paper.class}</p>
                <p>Uploaded: ${paper.uploadDate}</p>
                <p>Downloads: ${paper.downloads}</p>
            </div>
            <button class="btn-primary">Download</button>
        </div>
    `;
}

// Populate trending and recent papers
const trendingGrid = document.getElementById('trending-papers-grid');
const recentGrid = document.getElementById('recent-papers-grid');

if (trendingGrid && recentGrid) {
    const trendingPapers = [...samplePapers].sort((a, b) => b.downloads - a.downloads);
    const recentPapers = [...samplePapers].sort((a, b) => 
        new Date(b.uploadDate) - new Date(a.uploadDate)
    );

    trendingGrid.innerHTML = trendingPapers
        .map(paper => createPaperCard(paper))
        .join('');
    
    recentGrid.innerHTML = recentPapers
        .map(paper => createPaperCard(paper))
        .join('');
}

// Search functionality
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        }
    });
}
