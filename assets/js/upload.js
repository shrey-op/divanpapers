// GitHub configuration for paper storage
const GITHUB_USERNAME = 'shrey-op';
const GITHUB_REPO = 'divanpapers';
const GITHUB_PAPERS_PATH = 'papers';

// Theme initialization
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

// Upload functionality
document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    const paperFileInput = document.getElementById('paper-file');
    const supplementaryFilesInput = document.getElementById('supplementary-files');
    const fileNameDisplay = document.getElementById('file-name');
    const uploadProgress = document.getElementById('upload-progress');
    const progressBar = uploadProgress.querySelector('.progress-bar > div');
    const progressText = uploadProgress.querySelector('.progress-text');

    // Check authentication state
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = 'login.html';
        }
    });

    // Handle file selection
    paperFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            fileNameDisplay.textContent = file.name;
            validateFileSize(file);
        } else {
            fileNameDisplay.textContent = 'No file chosen';
        }
    });

    // File size validation
    function validateFileSize(file) {
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            showError('File size exceeds 50MB limit');
            paperFileInput.value = '';
            fileNameDisplay.textContent = 'No file chosen';
            return false;
        }
        return true;
    }

    // Handle form submission
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const user = firebase.auth().currentUser;
        if (!user) {
            showError('Please login to upload papers');
            return;
        }

        const formData = getFormData();
        const paperFile = paperFileInput.files[0];
        const supplementaryFiles = supplementaryFilesInput.files;

        // Validate required fields
        if (!validateForm(formData)) {
            return;
        }

        try {
            // Show progress UI
            uploadProgress.style.display = 'block';
            
            // Create a unique filename
            const timestamp = Date.now();
            const paperFileName = `${timestamp}_${paperFile.name}`;
            const githubPath = `${GITHUB_PAPERS_PATH}/${paperFileName}`;
            const githubUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/main/${githubPath}`;
            
            // Update progress for file reading
            progressBar.style.width = '50%';
            progressText.textContent = '50%';
            
            // Read and process the file
            const reader = new FileReader();
            await new Promise((resolve, reject) => {
                reader.onload = () => {
                    try {
                        // In production, you would upload the file to GitHub through your backend
                        console.log('File would be uploaded to:', githubUrl);
                        resolve();
                    } catch (error) {
                        console.error('Error handling file:', error);
                        reject(error);
                    }
                };
                reader.onerror = () => reject(reader.error);
                reader.readAsArrayBuffer(paperFile);
            });
            
            // Update progress after file processing
            progressBar.style.width = '100%';
            progressText.textContent = '100%';

            // Store paper metadata in Firebase
            const paperRef = firebase.database().ref('papers').push();
            await paperRef.set({
                ...formData,
                paperUrl: githubUrl,  // Store the GitHub URL

                uploadedBy: user.uid,
                uploadDate: firebase.database.ServerValue.TIMESTAMP
            });

            showSuccess('Paper uploaded successfully!');
            uploadForm.reset();
            resetUploadUI();

        } catch (error) {
            console.error('Upload error:', error);
            showError('Upload failed. Please try again.');
            uploadProgress.style.display = 'none';
        }
    });

    // Get form data
    function getFormData() {
        return {
            title: document.getElementById('title').value,
            authors: document.getElementById('authors').value.split(',').map(author => author.trim()),
            abstract: document.getElementById('abstract').value,
            publicationDate: document.getElementById('publication-date').value,
            doi: document.getElementById('doi').value,
            categories: Array.from(document.getElementById('categories').selectedOptions).map(option => option.value),
            keywords: document.getElementById('keywords').value.split(',').map(keyword => keyword.trim()),
            language: document.getElementById('language').value,
            citation: document.getElementById('citation').value,
            funding: document.getElementById('funding').value
        };
    }

    // Validate form
    function validateForm(formData) {
        if (!formData.title) {
            showError('Please enter a paper title');
            return false;
        }
        if (!formData.authors.length) {
            showError('Please enter at least one author');
            return false;
        }
        if (!formData.abstract) {
            showError('Please provide an abstract');
            return false;
        }
        if (!formData.categories.length) {
            showError('Please select at least one category');
            return false;
        }
        if (!formData.keywords.length) {
            showError('Please enter at least one keyword');
            return false;
        }
        if (!document.getElementById('terms').checked) {
            showError('Please accept the terms');
            return false;
        }
        return true;
    }

    // Reset upload UI
    function resetUploadUI() {
        uploadProgress.style.display = 'none';
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        fileNameDisplay.textContent = 'No file chosen';
    }
});

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.upload-container').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.querySelector('.upload-container').prepend(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}
