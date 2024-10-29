// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDUXRP7fah5PnvoUV02W7BsfKjqOJLh7oM",
    authDomain: "demoweb-46446.firebaseapp.com",
    projectId: "demoweb-46446",
    storageBucket: "demoweb-46446.appspot.com",
    messagingSenderId: "460314176652",
    appId: "1:460314176652:web:691c74421911536a0f9fa9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const authContainer = document.getElementById('auth-container');
const authForm = document.getElementById('auth-form');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const mainContent = document.getElementById('main-content');
const logoutBtn = document.getElementById('logout-btn'); // Add a reference to the logout button

// Show auth form
function showAuthForm() {
    authContainer.classList.add('visible');
    mainContent.classList.remove('visible');
}

// Hide auth form
function hideAuthForm() {
    authContainer.classList.remove('visible');
    mainContent.classList.add('visible');
}

// Handle login
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Logged in:', user);
            hideAuthForm(); // Hide the form after successful login
            if (typeof initApp === 'function') {
                initApp();
            }
        })
        .catch((error) => {
            console.error('Login error:', error);
            alert('Error al iniciar sesión: ' + error.message);
        });
});

// Handle registration
registerBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default form submission
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Registered:', user);
            hideAuthForm(); // Hide the form after successful registration
            if (typeof initApp === 'function') {
                initApp();
            }
        })
        .catch((error) => {
            console.error('Registration error:', error);
            alert('Error al registrarse: ' + error.message);
        });
});

// Handle logout
function logout() {
    auth.signOut().then(() => {
        console.log('User logged out');
        showAuthForm(); // Show the auth form again
    }).catch((error) => {
        console.error('Logout error:', error);
        alert('Error al cerrar sesión: ' + error.message);
    });
}

// Check auth state
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user);
        hideAuthForm(); // Hide the form if the user is signed in
        if (typeof initApp === 'function') {
            initApp();
        }
    } else {
        // User is signed out
        console.log('User is signed out');
        showAuthForm(); // Show the form if the user is signed out
    }
});

// Initialize authentication
document.addEventListener('DOMContentLoaded', () => {
    // Check initial auth state
    const user = auth.currentUser;
    if (user) {
        hideAuthForm(); // Hide the form if the user is already signed in
        if (typeof initApp === 'function') {
            initApp();
        }
    } else {
        showAuthForm(); // Show the form if no user is signed in
    }
});

// Logout button event listener
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logout(); // Call the logout function
});
