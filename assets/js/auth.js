// Theme toggle functionality
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

// Form switching functionality
const loginBox = document.querySelector('.auth-box');
const signupBox = document.getElementById('signup-box');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');

showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginBox.style.display = 'none';
    signupBox.style.display = 'block';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupBox.style.display = 'none';
    loginBox.style.display = 'block';
});

// GitHub OAuth Configuration
const GITHUB_CLIENT_ID = 'your-github-client-id';
const GITHUB_REDIRECT_URI = window.location.origin + '/github-callback.html';

// Function to handle GitHub OAuth
async function handleGitHubAuth() {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('github_state', state);
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=repo&state=${state}`;
    window.location.href = githubAuthUrl;
}

document.addEventListener('DOMContentLoaded', () => {
    // GitHub Sign In
    const githubSignInButton = document.getElementById('github-signin');
    if (githubSignInButton) {
        githubSignInButton.addEventListener('click', handleGitHubAuth);
    }

    // Google Sign In
    const googleSignInButton = document.getElementById('google-signin');
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
                .then(() => {
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    let errorMessage = '';
                    if (error.code === 'auth/unauthorized-domain') {
                        errorMessage = 'This domain is not authorized. Please access the app through an authorized domain or add this domain to Firebase Console -> Authentication -> Settings.';
                    } else {
                        errorMessage = 'Google sign-in failed: ' + error.message;
                    }
                    showError(errorMessage);
                    console.error('Google sign-in error:', error);
                });
        });
    }

    // Email/Password Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(() => {
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    let errorMessage = 'Login failed: ' + error.message;
                    showError(errorMessage);
                    console.error('Login error:', error);
                });
        });
    }

    // Email/Password Sign Up
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;

            if (password !== confirmPassword) {
                showError('Passwords do not match.');
                return;
            }

            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    showError('Sign up failed: ' + error.message);
                    console.error('Signup error:', error);
                });
        });
    }

    // Password Reset
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            
            if (!email) {
                showError('Please enter your email address.');
                return;
            }

            firebase.auth().sendPasswordResetEmail(email)
                .then(() => {
                    alert('Password reset email sent. Please check your inbox.');
                })
                .catch((error) => {
                    showError('Failed to send reset email: ' + error.message);
                    console.error('Password reset error:', error);
                });
        });
    }
});

// Error handling
function showError(message) {
    let errorDiv = document.querySelector('.auth-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error';
        // Try to insert before the first form or after the Google sign-in button
        const form = document.querySelector('form');
        const googleButton = document.getElementById('google-signin');
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
        } else if (googleButton) {
            googleButton.parentNode.insertBefore(errorDiv, googleButton.nextSibling);
        } else {
            // Fallback to body if neither exists
            document.body.insertBefore(errorDiv, document.body.firstChild);
        }
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    console.error('Auth error:', message);
}
