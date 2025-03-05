// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAZajEsL4GZSNzqO5uxl3XjbXRPJ0XzczA",
    authDomain: "divanpapers.firebaseapp.com",
    databaseURL: "https://divanpapers-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "divanpapers",
    storageBucket: "divanpapers.firebasestorage.app",
    messagingSenderId: "571262074655",
    appId: "1:571262074655:web:6a6720431891491dc6fa2a",
    measurementId: "G-MWJQ6H6MMR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize auth button
const authButton = document.getElementById('auth-button');
if (authButton) {
    // Initial state
    authButton.addEventListener('click', () => {
        const user = firebase.auth().currentUser;
        if (user) {
            // User is signed in, so sign them out
            firebase.auth().signOut().then(() => {
                console.log('User signed out');
                window.location.href = 'index.html';
            }).catch((error) => {
                console.error('Sign out error:', error);
            });
        } else {
            // User is not signed in, redirect to login page
            window.location.href = 'login.html';
        }
    });
}

// Authentication state observer
firebase.auth().onAuthStateChanged((user) => {
    const authButton = document.getElementById('auth-button');
    const authRequired = document.querySelectorAll('.auth-required');

    if (user) {
        // User is signed in
        console.log('User is signed in:', user.email);
        if (authButton) {
            authButton.textContent = 'Logout';
        }

        // Update protected elements
        authRequired.forEach(element => {
            element.removeAttribute('data-tooltip');
        });

        // Store user data
        const userRef = firebase.database().ref('users/' + user.uid);
        userRef.update({
            email: user.email,
            lastLogin: new Date().toISOString()
        });
    } else {
        // User is signed out
        console.log('User is signed out');
        if (authButton) {
            authButton.textContent = 'Login';
        }

        // Update protected elements
        authRequired.forEach(element => {
            element.setAttribute('data-tooltip', 'Login required');
        });

        // Check if we're on a protected page
        const protectedPages = ['upload.html', 'profile.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (protectedPages.includes(currentPage)) {
            window.location.href = 'login.html';
        }
    }
});

// Export auth instance for other files
window.auth = firebase.auth();
window.database = firebase.database();
window.storage = firebase.storage();
