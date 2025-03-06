// Initialize theme
const themeToggle = document.getElementById('theme-toggle');
let isDarkMode = localStorage.getItem('darkMode') === 'true';
document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDarkMode);
});

// Search functionality
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');

const samplePapers = [
    {
        title: 'Introduction to Machine Learning',
        subject: 'math',
        std: '12',
        medium: 'english',
        year: '2025',
        school: 'Sample School',
        downloadUrl: '#'
    },
    // Add more sample papers
];

function filterPapers() {
    const std = document.getElementById('std-filter').value;
    const subject = document.getElementById('subject-filter').value;
    const medium = document.getElementById('medium-filter').value;
    const year = document.getElementById('year-filter').value;
    const school = document.getElementById('school-filter').value.toLowerCase();

    return samplePapers.filter(paper => {
        return (!std || paper.std === std) &&
               (!subject || paper.subject === subject) &&
               (!medium || paper.medium === medium) &&
               (!year || paper.year === year) &&
               (!school || paper.school.toLowerCase().includes(school));
    });
}

function displayResults(papers) {
    if (papers.length === 0) {
        searchResults.innerHTML = '<p>No papers found matching your criteria.</p>';
        return;
    }

    const resultsHtml = papers.map(paper => `
        <div class="paper-card">
            <h3>${paper.title}</h3>
            <div class="metadata">
                <p>Standard: ${paper.std}</p>
                <p>Subject: ${paper.subject}</p>
                <p>Medium: ${paper.medium}</p>
                <p>Year: ${paper.year}</p>
                <p>School: ${paper.school}</p>
            </div>
            <button class="btn-primary" onclick="downloadPaper('${paper.downloadUrl}')">Download</button>
        </div>
    `).join('');

    searchResults.innerHTML = resultsHtml;
}

function displayPaper(url) {
    const paperHtml = `
        <div class="paper-card">
            <h3>Paper</h3>
            <button class="btn-primary" onclick="downloadPaper('${url}')">Download</button>
        </div>
    `;
    searchResults.innerHTML += paperHtml;
}

function downloadPaper(url) {
    // Implement actual download logic here
    // For now, just log the action
    console.log('Downloading paper:', url);
    alert('Download started!');
}

// Fetch and display papers from the 'papers' folder in Firebase Storage
const papersRef = firebase.storage().ref().child('papers');
papersRef.listAll().then((res) => {
    res.items.forEach((itemRef) => {
        itemRef.getDownloadURL().then((url) => {
            // Display the paper on the papers page
            displayPaper(url);
        });
    });
});

// Event listeners
searchButton.addEventListener('click', () => {
    const filteredPapers = filterPapers();
    displayResults(filteredPapers);
});

// Parse URL parameters for direct searches
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
        document.getElementById('school-filter').value = query;
        searchButton.click();
    }
});
