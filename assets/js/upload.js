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
            
            // Upload to Firebase Storage
            const storageRef = firebase.storage().ref();
            const paperRef = storageRef.child(`papers/${paperFileName}`);
            
            // Upload the file
            const uploadTask = paperRef.put(paperFile);
            
            // Monitor upload progress
            uploadTask.on('state_changed', 
                (snapshot) => {
                    // Update progress bar
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    progressBar.style.width = progress + '%';
                    progressText.textContent = Math.round(progress) + '%';
                },
                (error) => {
                    // Handle errors
                    console.error('Upload error:', error);
                    throw error;
                }
            );
            
            // Wait for upload to complete
            await uploadTask;
            
            // Get the download URL
            const downloadURL = await paperRef.getDownloadURL();

            // Store paper metadata in Firebase
            const dbRef = firebase.database().ref('papers').push();
            await dbRef.set({
                ...formData,
                paperUrl: downloadURL,  // Store the Firebase Storage URL

                uploadedBy: user.uid,
                uploadDate: firebase.database.ServerValue.TIMESTAMP
            });

            showSuccess('Paper uploaded successfully!');
            uploadForm.reset();
            resetUploadUI();
            
            // Redirect to papers page after a short delay
            setTimeout(() => {
                window.location.href = 'papers.html';
            }, 1500); // 1.5 second delay to show success message

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

// Create or get message container
function getMessageContainer() {
    let container = document.getElementById('message-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'message-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.zIndex = '1000';
        container.style.width = '80%';
        container.style.maxWidth = '500px';
        container.style.textAlign = 'center';
        document.body.appendChild(container);
    }
    return container;
}

// Show error message
function showError(message) {
    const container = getMessageContainer();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.backgroundColor = 'var(--error-bg-color, #ff5252)';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '1rem';
    errorDiv.style.borderRadius = '8px';
    errorDiv.style.marginBottom = '10px';
    errorDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    errorDiv.innerHTML = `❌ ${message}`;
    container.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Show success message
function showSuccess(message) {
    const container = getMessageContainer();
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.backgroundColor = 'var(--success-bg-color, #4caf50)';
    successDiv.style.color = 'white';
    successDiv.style.padding = '1rem';
    successDiv.style.borderRadius = '8px';
    successDiv.style.marginBottom = '10px';
    successDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    successDiv.innerHTML = `✅ ${message}`;
    container.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}
