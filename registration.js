// Firebase configuration
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
    console.log("🔧 Loading Firebase...");
    
    // Initialize Firebase ONLY if not already initialized
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("✅ Firebase initialized successfully");
    } else {
        console.log("ℹ️ Firebase already initialized");
    }
    
    // Get references to Firebase services
    auth = firebase.auth();
    database = firebase.database();
    console.log("✅ Firebase services loaded (Auth & Database)");
    
} catch (error) {
    console.error("❌ Firebase initialization error:", error);
    alert("⚠️ Error: Firebase failed to load. Please refresh the page.");
}

function register() {
    console.log("🚀 Register function called!");
    
    // Get form values
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var fname = document.getElementById("fname").value;
    var lname = document.getElementById("lname").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var agreeTerms = document.getElementById("agreeTerms").checked;
    var errorElement = document.getElementById("error");

    // Clear previous errors
    if (errorElement) {
        errorElement.innerHTML = "";
        errorElement.style.display = "none";
    }

    // Log username to console
    console.log("👤 User Name:", fname + " " + lname);
    console.log("📧 Email:", email);
    console.log("🔑 Password length:", password.length);

    // Input validation with alerts
    if (!fname.trim()) {
        alert("❌ Please enter your First Name!");
        document.getElementById("fname").focus();
        return;
    }
    
    if (!lname.trim()) {
        alert("❌ Please enter your Last Name!");
        document.getElementById("lname").focus();
        return;
    }
    
    if (!email) {
        alert("❌ Please enter your Email Address!");
        document.getElementById("email").focus();
        return;
    }
    
    if (!password) {
        alert("❌ Please create a Password!");
        document.getElementById("password").focus();
        return;
    }
    
    if (password.length < 6) {
        alert("❌ Password must be at least 6 characters long!");
        document.getElementById("password").focus();
        return;
    }
    
    if (password !== confirmPassword) {
        alert("❌ Passwords do not match! Please check again.");
        document.getElementById("confirmPassword").focus();
        return;
    }
    
    if (!agreeTerms) {
        alert("❌ You must agree to the Terms of Service and Privacy Policy!");
        document.getElementById("agreeTerms").focus();
        return;
    }

    console.log("📝 All form validation passed!");
    console.log("🔄 Attempting to create user with email:", email);
    
    // Show loading alert
    alert("⏳ Creating your account... Please wait!");
    
    // Create user with Firebase Authentication
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User created successfully
            var user = userCredential.user;
            
            // Console log user details
            console.log("🎉 User created successfully!");
            console.log("🆔 User UID:", user.uid);
            console.log("👤 Full Name:", fname + " " + lname);
            console.log("📧 User Email:", user.email);
            
            // Show success alert
            alert("✅ Account created successfully!\n\nWelcome " + fname + " " + lname + "!\n\nEmail: " + email + "\nUID: " + user.uid);
            
            // Save additional user data to Realtime Database
            var userData = {
                firstName: fname,
                lastName: lname,
                email: email,
                fullName: fname + " " + lname,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            
            console.log("💾 Saving user data to database...");
            console.log("📊 User Data:", userData);
            
            return database.ref('users/' + user.uid).set(userData);
        })
                .then(() => {
            console.log("💾 User data saved to database successfully!");
            
            // 🔥 ADD THIS: Update navbar before redirect
            if (window.updateNavbarForUser) {
                console.log("🔄 Updating navbar for new user");
                window.updateNavbarForUser(auth.currentUser);
            }
            
            // Show final success message
            alert("🎊 Registration Complete!\n\n✅ Account created\n✅ Profile saved\n✅ Welcome to Skill X!\n\nRedirecting to homepage...");
            
            // Log to console
            console.log("🔗 Redirecting to landingpage.html");
            
            // Redirect to landing page after successful registration
            setTimeout(() => {
                window.location.href = "landingpage.html";
            }, 1000);
        })
        .catch((error) => {
            console.error("❌ Registration error:", error);
            console.error("🔍 Error Code:", error.code);
            console.error("📝 Error Message:", error.message);
            
            let errorMessage = error.message;
            
            // Custom error messages with alerts
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "📧 This email is already registered!\n\nPlease try logging in or use a different email.";
                alert(errorMessage);
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "❌ Invalid email address!\n\nPlease enter a valid email (example@domain.com).";
                alert(errorMessage);
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "🔒 Password is too weak!\n\nPlease use a stronger password with at least 6 characters.";
                alert(errorMessage);
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = "🌐 Network error!\n\nPlease check your internet connection and try again.";
                alert(errorMessage);
            } else {
                // Show the raw error for other cases
                alert("⚠️ Error: " + errorMessage);
            }
            
            // Also show error in the error div if it exists
            if (errorElement) {
                errorElement.innerHTML = errorMessage;
                errorElement.style.display = "block";
            }
        });
}

// Password strength indicator
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 DOM fully loaded!");
    
    const passwordInput = document.getElementById('password');
    const strengthMeter = document.getElementById('strengthMeter');
    
    if (passwordInput && strengthMeter) {
        console.log("🔒 Password strength indicator activated");
        
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            console.log("🔑 Password input:", password.length + " characters");
            
            // Check password length
            if (password.length >= 8) strength += 25;
            
            // Check for lowercase letters
            if (/[a-z]/.test(password)) strength += 25;
            
            // Check for uppercase letters
            if (/[A-Z]/.test(password)) strength += 25;
            
            // Check for numbers and special characters
            if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
            
            // Update strength meter
            strengthMeter.style.width = strength + '%';
            
            // Change color based on strength
            if (strength < 50) {
                strengthMeter.style.background = '#ff4757'; // Red
                console.log("📊 Password strength: Weak (" + strength + "%)");
            } else if (strength < 75) {
                strengthMeter.style.background = '#ffa502'; // Orange
                console.log("📊 Password strength: Medium (" + strength + "%)");
            } else {
                strengthMeter.style.background = '#2ed573'; // Green
                console.log("📊 Password strength: Strong (" + strength + "%)");
            }
        });
    }
    
    // Add interactive effects to inputs
    const inputs = document.querySelectorAll('input');
    console.log("🎯 Found " + inputs.length + " input fields");
    
    inputs.forEach((input, index) => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            console.log("🔍 Input focused: " + (this.placeholder || this.id || "Input " + index));
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
            console.log("👁️ Input blurred: " + (this.placeholder || this.id || "Input " + index));
        });
    });
    
    // Add click effect to signup button
    const signupBtn = document.querySelector('.signup-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            console.log("🖱️ Create Account button clicked!");
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
    
    // Log when page is ready
    console.log("🎬 Page is ready! You can now register.");
});