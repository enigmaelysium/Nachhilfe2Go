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
                    el.innerText = translatedText;
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

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;
    submitBtn.disabled = true;
    submitBtn.innerText = "Wird gesendet...";

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
        const response = await fetch('https://api.staticforms.xyz/submit', {
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
        } else {
            alert('Fehler beim Senden: ' + (result.message || 'Bitte versuchen Sie es erneut.'));
        }
    } catch (error) {
        alert('Netzwerkfehler. Bitte versuchen Sie es später erneut.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
    }
});
});