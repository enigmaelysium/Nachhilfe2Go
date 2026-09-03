// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    if (typeof translations === 'undefined') {
        console.error("translations.js is missing or failed to load.");
        return;
    }

    // --- 1. Language Handling (Syncing Mobile & Desktop Selectors) ---
    const langSelects = document.querySelectorAll('.lang-select');
    const savedLang = localStorage.getItem('siteLang') || 'de';
    
    if (langSelects.length > 0) {
        langSelects.forEach(select => {
            select.value = savedLang; // Set initial value for all dropdowns
            
            select.addEventListener('change', (e) => {
                const newLang = e.target.value;
                localStorage.setItem('siteLang', newLang);
                
                // Update all other dropdowns to match the selection
                langSelects.forEach(s => s.value = newLang); 
                
                applyLanguage(newLang);
            });
        });
    }
    
    applyLanguage(savedLang);

    function applyLanguage(lang) {
        // Automatically flips the layout for Arabic using logical properties in Tailwind
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translatedText = (translations[lang] && translations[lang][key]) 
                                    ? translations[lang][key] 
                                    : translations['de'][key]; // Fallback
            
            if (translatedText) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translatedText;
                } else {
                    el.innerHTML = translatedText;
                }
            }
        });
    }

    // --- 2. Mobile Menu Toggle Logic ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileBtn && mobileMenu) {
        // Open/Close menu when clicking the hamburger icon
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });

        // Close the mobile menu automatically when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            });
        });
    }
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');
const customAlert = document.getElementById('custom-alert');
const closeAlertBtn = document.getElementById('close-alert-btn');
const email = "kontakt@nachhilfe-2go.de";

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
        if (btnText && btnLoading) {
            btnText.classList.add('hidden');
            btnLoading.classList.remove('hidden');
        }

        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        
        // FormSubmit backend configurations
        object._captcha = "false"; // Disable captcha for AJAX to prevent CORS errors
        object._subject = "Neue Kontaktanfrage von Nachhilfe2Go"; 
        
        const json = JSON.stringify(object);

        try {
            // Using FormSubmit AJAX endpoint directed to the new email
            const response = await fetch(`https://formsubmit.co/ajax/${email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });

            const result = await response.json();

            if (result.success) {
                form.reset();
                successMsg.classList.remove('hidden');
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMsg.classList.add('hidden');
                }, 5000);
            } else {
                // Trigger Custom Error Modal
                customAlert.classList.remove('hidden');
            }
        } catch (error) {
            // Trigger Custom Error Modal
            customAlert.classList.remove('hidden');
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            if (btnText && btnLoading) {
                btnLoading.classList.add('hidden');
                btnText.classList.remove('hidden');
            }
        }
    });
}

// Close Custom Alert Modal
if (closeAlertBtn) {
    closeAlertBtn.addEventListener('click', () => {
        customAlert.classList.add('hidden');
    });
}
});