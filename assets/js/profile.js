document.addEventListener('DOMContentLoaded', () => {
    // References to DOM elements
    const profileImage = document.getElementById('profile-image');
    const changeAvatarBtn = document.getElementById('change-avatar');
    const avatarUpload = document.getElementById('avatar-upload');
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const joinDate = document.getElementById('join-date');
    const profileForm = document.getElementById('profile-form');
    const papersList = document.getElementById('papers-list');

    // Check authentication state
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            // User is signed in
            await loadUserProfile(user);
            await loadUserPapers(user);
        } else {
            // Redirect to login page if not authenticated
            window.location.href = 'login.html';
        }
    });

    // Load user profile data
    async function loadUserProfile(user) {
        try {
            // Set basic info
            profileEmail.textContent = user.email;
            profileName.textContent = user.displayName || 'Anonymous User';
            joinDate.textContent = `Member since: ${new Date(user.metadata.creationTime).toLocaleDateString()}`;

            // Set profile picture
            if (user.photoURL) {
                profileImage.src = user.photoURL;
            }

            // Load additional profile data from database
            const userRef = firebase.database().ref('users/' + user.uid);
            const snapshot = await userRef.once('value');
            const userData = snapshot.val() || {};

            // Fill form with existing data
            document.getElementById('display-name').value = userData.displayName || user.displayName || '';
            document.getElementById('bio').value = userData.bio || '';
            document.getElementById('institution').value = userData.institution || '';
            document.getElementById('research-interests').value = userData.researchInterests || '';

        } catch (error) {
            console.error('Error loading profile:', error);
            showError('Failed to load profile data');
        }
    }

    // Load user's papers
    async function loadUserPapers(user) {
        try {
            const papersRef = firebase.database().ref('papers').orderByChild('userId').equalTo(user.uid);
            const snapshot = await papersRef.once('value');
            const papers = snapshot.val();

            if (papers) {
                papersList.innerHTML = '';
                Object.entries(papers).forEach(([key, paper]) => {
                    const paperElement = createPaperElement(key, paper);
                    papersList.appendChild(paperElement);
                });
            }
        } catch (error) {
            console.error('Error loading papers:', error);
            showError('Failed to load papers');
        }
    }

    // Create paper element
    function createPaperElement(key, paper) {
        const div = document.createElement('div');
        div.className = 'paper-item';
        div.innerHTML = `
            <div class="paper-info">
                <h3>${paper.title}</h3>
                <p>Uploaded on ${new Date(paper.uploadDate).toLocaleDateString()}</p>
            </div>
            <div class="paper-actions">
                <button onclick="window.location.href='${paper.downloadUrl}'">Download</button>
                <button onclick="deletePaper('${key}')">Delete</button>
            </div>
        `;
        return div;
    }

    // Handle avatar change
    changeAvatarBtn.addEventListener('click', () => {
        avatarUpload.click();
    });

    avatarUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const user = firebase.auth().currentUser;
            const storageRef = firebase.storage().ref();
            const avatarRef = storageRef.child(`avatars/${user.uid}/${file.name}`);

            // Upload file
            const snapshot = await avatarRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();

            // Update profile
            await user.updateProfile({
                photoURL: downloadURL
            });

            // Update UI
            profileImage.src = downloadURL;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            showError('Failed to upload avatar');
        }
    });

    // Handle profile form submission
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const user = firebase.auth().currentUser;
        if (!user) return;

        const updates = {
            displayName: document.getElementById('display-name').value,
            bio: document.getElementById('bio').value,
            institution: document.getElementById('institution').value,
            researchInterests: document.getElementById('research-interests').value,
            lastUpdated: firebase.database.ServerValue.TIMESTAMP
        };

        try {
            // Update display name in Firebase Auth
            await user.updateProfile({
                displayName: updates.displayName
            });

            // Update additional data in Realtime Database
            await firebase.database().ref('users/' + user.uid).update(updates);

            // Update UI
            profileName.textContent = updates.displayName;
            showSuccess('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            showError('Failed to update profile');
        }
    });
});

// Delete paper function
async function deletePaper(paperId) {
    if (!confirm('Are you sure you want to delete this paper?')) return;

    try {
        const user = firebase.auth().currentUser;
        if (!user) return;

        // Get paper data first
        const paperRef = firebase.database().ref(`papers/${paperId}`);
        const snapshot = await paperRef.once('value');
        const paper = snapshot.val();

        if (paper) {
            // Delete file from storage
            const storageRef = firebase.storage().ref(paper.storagePath);
            await storageRef.delete();

            // Delete database entry
            await paperRef.remove();

            // Refresh papers list
            const paperElement = document.querySelector(`[data-paper-id="${paperId}"]`);
            if (paperElement) {
                paperElement.remove();
            }

            showSuccess('Paper deleted successfully');
        }
    } catch (error) {
        console.error('Error deleting paper:', error);
        showError('Failed to delete paper');
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.profile-container').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.querySelector('.profile-container').prepend(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}
