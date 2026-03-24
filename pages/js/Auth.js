/**
 * PixelNeev – Auth.js
 * Handles: Sliding window animation toggle & Firebase Authentication Flow (Email + Google)
 */

document.addEventListener("DOMContentLoaded", () => {
    const signUpTrigger = document.getElementById('signUpTrigger');
    const signInTrigger = document.getElementById('signInTrigger');
    const authBox = document.getElementById('authBox');
    
    const signUpForm = document.getElementById('signUpForm');
    const signInForm = document.getElementById('signInForm');
    
    // Google Buttons
    const googleSignUpBtn = document.getElementById('googleSignUpBtn');
    const googleSignInBtn = document.getElementById('googleSignInBtn');

    // ==========================================
    // 1. UI SLIDING LOGIC (MANUAL TOGGLES)
    // ==========================================
    
    if (signUpTrigger) {
        signUpTrigger.addEventListener('click', () => {
            authBox.classList.add("is-sliding-active");
            if (window.innerWidth <= 768) authBox.classList.add("is-mobile-signup");
        });
    }
  
    if (signInTrigger) {
        signInTrigger.addEventListener('click', () => {
            authBox.classList.remove("is-sliding-active");
            if (window.innerWidth <= 768) authBox.classList.remove("is-mobile-signup");
        });
    }

    // ==========================================
    // 2. SUCCESS LOGIC
    // ==========================================

    // Helper function to handle SUCCESSFUL LOGIN (Redirects to Main)
    /**
     * Handles successful authentication by saving user metadata 
     * and redirecting to the Main feed.
     */
    async function completeLogin(user) {
        const firebaseData = {
            uid: user.uid,
            name: user.displayName || user.email.split('@')[0],
            email: user.email
        };

        try {
            // ─── STEP 1: Sync with MongoDB ───
            const response = await fetch('http://localhost:5000/api/auth/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(firebaseData)
            });

            const mongoData = await response.json();

            // ─── STEP 2: Save the MongoDB data (which includes Bio, Projects, etc.) ───
            localStorage.setItem('pixelNeev_user', JSON.stringify(mongoData));

            // ─── STEP 3: Update UI & Redirect ───
            if (window.PixelNeevNavbar && window.PixelNeevNavbar.setUsername) {
                window.PixelNeevNavbar.setUsername(mongoData.name);
            }
            
            window.location.replace("./Main.html");

        } catch (error) {
            console.error("Failed to sync with MongoDB:", error);
            alert("Login successful, but profile sync failed.");
        }
    }

    // ==========================================
    // 3. GOOGLE SIGN-IN LOGIC
    // ==========================================

    async function handleGoogleAuth() {
        try {
            // Trigger Firebase Google Popup
            // Inside handleGoogleAuth()
            const result = await window.firebaseMethods.signInWithPopup(window.pixelAuth, window.pixelGoogleProvider);
            // Pass the whole user object
            completeLogin(result.user);
            
            // Extract the user's Google display name (fallback to "Developer" if null)
            const userName = result.user.displayName || "Developer";
            
            // Log them in!
            completeLogin(userName);

        } catch (error) {
            console.error("Google Auth Error:", error);
            // Ignore the error if the user just closed the popup manually
            if (error.code !== 'auth/popup-closed-by-user') {
                alert("Google Sign-In failed: " + error.message);
            }
        }
    }

    // Attach the function to BOTH Google buttons
    if (googleSignUpBtn) googleSignUpBtn.addEventListener('click', handleGoogleAuth);
    if (googleSignInBtn) googleSignInBtn.addEventListener('click', handleGoogleAuth);


    // ==========================================
    // 4. EMAIL / PASSWORD LOGIC
    // ==========================================

    // --- Handle Registration (Sign Up) ---
    if (signUpForm) {
        signUpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = signUpForm.querySelector('input[type="email"]').value;
            const passwordInput = signUpForm.querySelector('input[type="password"]').value;
            const submitBtn = signUpForm.querySelector('button[type="submit"]');

            try {
                submitBtn.textContent = "Creating Account...";
                submitBtn.disabled = true;

                // 1. Create the user in Firebase
                await window.firebaseMethods.createUserWithEmailAndPassword(
                    window.pixelAuth, 
                    emailInput, 
                    passwordInput
                );
                
                // 2. Success! Alert the user
                alert("Account created successfully! Please sign in to continue.");
                
                // 3. Reset the Sign Up button
                submitBtn.textContent = "Sign Up";
                submitBtn.disabled = false;
                signUpForm.reset();

                // 4. Pre-fill the Sign In email field for better UX
                if (signInForm) {
                    signInForm.querySelector('input[type="email"]').value = emailInput;
                }

                // 5. SLIDE TO SIGN IN PANEL AUTOMATICALLY
                authBox.classList.remove("is-sliding-active");
                if (window.innerWidth <= 768) authBox.classList.remove("is-mobile-signup");

            } catch (error) {
                console.error("Sign Up Error:", error);
                alert("Registration failed: " + error.message);
                
                submitBtn.textContent = "Sign Up";
                submitBtn.disabled = false;
            }
        });
    }

    // --- Handle Login (Sign In) ---
    if (signInForm) {
        signInForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = signInForm.querySelector('input[type="email"]').value;
            const passwordInput = signInForm.querySelector('input[type="password"]').value;
            const submitBtn = signInForm.querySelector('button[type="submit"]');

            try {
                submitBtn.textContent = "Signing In...";
                submitBtn.disabled = true;

                // 1. Authenticate the user
                // Inside the signInForm submit listener
                const userCredential = await window.firebaseMethods.signInWithEmailAndPassword(window.pixelAuth, emailInput, passwordInput);
                // Pass the whole user object
                completeLogin(userCredential.user);
                
                // 2. Success! Get username and trigger redirect
                const userName = userCredential.user.displayName || emailInput.split('@')[0];
                
                // THIS triggers the redirect to Main.html
                completeLogin(userName);

            } catch (error) {
                console.error("Sign In Error:", error);
                alert("Login failed: " + error.message);
                
                submitBtn.textContent = "Sign In";
                submitBtn.disabled = false;
            }
        });
    }
});