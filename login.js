// Firebase configuration (Same as registration)
const firebaseConfig = {
  apiKey: "AIzaSyDa5n4kouD8j8SkZjFKbOaLIR1P75qt_0Q",
  authDomain: "skill-x-e9103.firebaseapp.com",
  projectId: "skill-x-e9103",
  storageBucket: "skill-x-e9103.firebasestorage.app",
  messagingSenderId: "168346915694",
  appId: "1:168346915694:web:04d02b703f6af77cd0277f",
  measurementId: "G-PYNH68ZKVS"
};

// Initialize Firebase
let auth, database;

try {
    // Show alert that Firebase is loading
    console.log("🔧 Loading Firebase for Login...");
    
    // Initialize Firebase ONLY if not already initialized
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("✅ Firebase initialized successfully for Login");
    } else {
        console.log("ℹ️ Firebase already initialized (reusing app)");
    }
    
    // Get references to Firebase services
    auth = firebase.auth();
    database = firebase.database();
    console.log("✅ Firebase Auth & Database services loaded");
    
} catch (error) {
    console.error("❌ Firebase initialization error:", error);
    alert("⚠️ Error: Firebase failed to load. Please refresh the page.");
}

// Login function
function loginUser() {
    console.log("🚀 Login function called!");
    
    // Get form values
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var rememberMe = document.querySelector('input[type="checkbox"]').checked;
    
    // Log login attempt to console
    console.log("📧 Login attempt with email:", email);
    console.log("🔑 Password entered (length):", password.length);
    console.log("💾 Remember me:", rememberMe);
    
    // Input validation with alerts
    if (!email) {
        alert("❌ Please enter your Email or Username!");
        document.getElementById("email").focus();
        return;
    }
    
    if (!password) {
        alert("❌ Please enter your Password!");
        document.getElementById("password").focus();
        return;
    }
    
    // Show loading alert
    alert("⏳ Logging in... Please wait!");
    console.log("🔄 Attempting to authenticate user...");
    
    // Login with Firebase Authentication
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User logged in successfully
            var user = userCredential.user;
            
            // Console log user details
            console.log("🎉 Login successful!");
            console.log("🆔 User UID:", user.uid);
            console.log("📧 User Email:", user.email);
            console.log("✅ Email verified:", user.emailVerified);
            console.log("📅 Last login time:", new Date().toLocaleString());
            
            // Get user data from database to display name
            return database.ref('users/' + user.uid).once('value');
        })
        .then((snapshot) => {
            var userData = snapshot.val();
            
            if (userData) {
                // Show user's name in console
                console.log("👤 Welcome back, " + (userData.firstName || userData.fullName || "User") + "!");
                console.log("📊 User Profile:", userData);
                
                // Show success alert with user name
                var userName = userData.firstName || userData.fullName || "there";
                alert("✅ Login successful!\n\nWelcome back, " + userName + "!\n\nRedirecting to your dashboard...");
            } else {
                console.log("👤 Welcome back!");
                alert("✅ Login successful!\n\nWelcome back!\n\nRedirecting to your dashboard...");
            }
            
            // Update last login time in database
            var updates = {
                lastLogin: new Date().toISOString()
            };
            
            return database.ref('users/' + auth.currentUser.uid).update(updates);
        })
        .then(() => {
            console.log("💾 Last login time updated in database");
            console.log("🔗 Redirecting to landingpage.html...");
            
            // 🔥 ADD THIS: Update navbar before redirect
            if (window.updateNavbarForUser) {
                console.log("🔄 Updating navbar for logged-in user");
                window.updateNavbarForUser(auth.currentUser);
            }
            
            // Show final message and redirect
            alert("🎊 You're logged in!\n\nEnjoy your learning journey with Skill X!");
            
            // Redirect to landing page after successful login
            setTimeout(() => {
                window.location.href = "landingpage.html";
            }, 1000);
        })
        .catch((error) => {
            console.error("❌ Login error:", error);
            console.error("🔍 Error Code:", error.code);
            console.error("📝 Error Message:", error.message);
            
            let errorMessage = error.message;
            let userFriendlyMessage = "";
            
            // Custom error messages with alerts
            if (error.code === 'auth/user-not-found') {
                userFriendlyMessage = "❌ User not found!\n\nNo account exists with this email.\nPlease check your email or sign up first.";
                console.log("🔎 Suggestion: User should register first");
            } else if (error.code === 'auth/wrong-password') {
                userFriendlyMessage = "❌ Wrong password!\n\nPlease check your password and try again.\nClick 'Forgot Password?' if you can't remember.";
                console.log("🔎 Suggestion: User might need to reset password");
            } else if (error.code === 'auth/invalid-email') {
                userFriendlyMessage = "❌ Invalid email format!\n\nPlease enter a valid email address (example@domain.com).";
                console.log("🔎 Suggestion: Check email format");
            } else if (error.code === 'auth/user-disabled') {
                userFriendlyMessage = "🚫 Account disabled!\n\nThis account has been disabled. Please contact support.";
                console.log("🔎 Suggestion: User account is disabled");
            } else if (error.code === 'auth/too-many-requests') {
                userFriendlyMessage = "⏱️ Too many attempts!\n\nAccess temporarily blocked. Try again later or reset your password.";
                console.log("🔎 Suggestion: Too many failed attempts");
            } else if (error.code === 'auth/network-request-failed') {
                userFriendlyMessage = "🌐 Network error!\n\nPlease check your internet connection and try again.";
                console.log("🔎 Suggestion: Check internet connection");
            } else {
                userFriendlyMessage = "⚠️ Login failed: " + errorMessage;
            }
            
            // Show alert with error message
            alert(userFriendlyMessage);
            
            // Also log to console
            console.log("🔄 Login failed - showing error to user");
            
            // Clear password field for security
            document.getElementById("password").value = "";
        });
}

// Add interactive effects
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 Login page DOM fully loaded!");
    
    const inputs = document.querySelectorAll('input');
    console.log("🎯 Found " + inputs.length + " input fields");
    
    inputs.forEach((input, index) => {
        // Add focus effect
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            console.log("🔍 Input focused: " + (this.placeholder || this.id || "Input " + index));
        });
        
        // Remove focus effect
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
            console.log("👁️ Input blurred: " + (this.placeholder || this.id || "Input " + index));
        });
    });
    
    // Login button animation and functionality
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        console.log("🖱️ Login button found, adding click handler");
        
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent form submission
            
            console.log("🖱️ Login button clicked!");
            
            // Simple animation
            this.style.transform = 'scale(0.95)';
            console.log("🎬 Button pressed animation");
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                console.log("🎬 Button released animation");
            }, 150);
            
            // Call login function
            console.log("🔄 Calling loginUser() function...");
            loginUser();
        });
    }
    
    // Check if Firebase loaded
    if (typeof firebase !== 'undefined') {
        console.log("✅ Firebase SDK loaded successfully!");
        console.log("🔥 Firebase App:", firebase.app().name);
    } else {
        console.error("❌ Firebase SDK not loaded!");
        alert("⚠️ Warning: Firebase not loaded. Please check your internet connection.");
    }
    
    // Add enter key support
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            console.log("↵ Enter key pressed, attempting login");
            loginUser();
        }
    });
    
    // Check if user is already logged in
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log("👤 User is already logged in:", user.email);
            console.log("🔗 Redirecting to landing page...");
            
            // Ask user if they want to stay or go to dashboard
            const stayOnPage = confirm("You're already logged in as " + user.email + "!\n\nGo to dashboard? (Cancel to stay here)");
            if (stayOnPage) {
                window.location.href = "landingpage.html";
            }
        } else {
            console.log("👤 No user currently logged in");
        }
    });
    
    // Log when page is ready
    console.log("🎬 Login page is ready! You can now login.");
    console.log("📝 Tip: Press Enter to login faster");
});

// Forgot password function (optional - can be linked later)
// Forgot password function (ENHANCED VERSION)
function forgotPassword() {
    console.log("🔓 Forgot password clicked");
    
    // Get email from the login form or prompt
    const emailFromForm = document.getElementById("email").value;
    
    let userEmail = emailFromForm;
    
    // If email field is empty, ask for email
    if (!userEmail) {
        userEmail = prompt("Enter your email to reset password:");
        if (!userEmail) {
            alert("❌ Email is required to reset password.");
            return;
        }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
        alert("❌ Please enter a valid email address.");
        return;
    }
    
    console.log("🔄 Sending password reset to:", userEmail);
    
    // Show loading state
    const messageDiv = document.getElementById("password-reset-message") || createMessageDiv();
    messageDiv.innerHTML = "⏳ Sending reset email...";
    messageDiv.style.display = "block";
    messageDiv.style.background = "#fff3cd";
    messageDiv.style.color = "#856404";
    messageDiv.style.border = "1px solid #ffeaa7";
    
    // Send password reset email
    auth.sendPasswordResetEmail(userEmail)
        .then(() => {
            console.log("✅ Password reset email sent to:", userEmail);
            
            // Show success message
            messageDiv.innerHTML = `
                ✅ <strong>Password reset email sent!</strong><br>
                📧 Check your inbox at <strong>${userEmail}</strong><br>
                📝 Follow the instructions in the email to reset your password.
            `;
            messageDiv.style.background = "#d4edda";
            messageDiv.style.color = "#155724";
            messageDiv.style.border = "1px solid #c3e6cb";
            
            // Also show alert
            alert(`✅ Password reset email sent!\n\nCheck your inbox at ${userEmail}\n\nThe link will expire in 1 hour.`);
            
            // Auto-hide message after 10 seconds
            setTimeout(() => {
                messageDiv.style.display = "none";
            }, 10000);
            
            // Clear the email field for security
            document.getElementById("email").value = "";
        })
        .catch((error) => {
            console.error("❌ Password reset error:", error);
            
            let errorMessage = "Error sending reset email. ";
            
            // User-friendly error messages
            if (error.code === 'auth/user-not-found') {
                errorMessage = `❌ No account found with email: ${userEmail}\n\nPlease check the email or sign up first.`;
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "❌ Invalid email address format.\n\nPlease enter a valid email (example@domain.com).";
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = "⏱️ Too many reset attempts!\n\nPlease try again later.";
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = "🌐 Network error!\n\nPlease check your internet connection.";
            } else {
                errorMessage = "Error: " + error.message;
            }
            
            // Show error in message div
            messageDiv.innerHTML = errorMessage;
            messageDiv.style.background = "#f8d7da";
            messageDiv.style.color = "#721c24";
            messageDiv.style.border = "1px solid #f5c6cb";
            
            // Also show alert
            alert(errorMessage);
        });
}

// Helper function to create message div if it doesn't exist
function createMessageDiv() {
    const div = document.createElement("div");
    div.id = "password-reset-message";
    div.style.padding = "10px";
    div.style.margin = "10px 0";
    div.style.borderRadius = "5px";
    div.style.display = "none";
    document.querySelector(".container").appendChild(div);
    return div;
}

// Expose functions to HTML
window.loginUser = loginUser;
window.forgotPassword = forgotPassword;

// Expose functions to HTML
window.loginUser = loginUser;
window.forgotPassword = forgotPassword;