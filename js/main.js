// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    if (typeof translations === 'undefined') {
        console.error("translations.js is missing or failed to load.");
        return;
    }

    const langSelect = document.getElementById('langSelect');
    const savedLang = localStorage.getItem('siteLang') || 'de';
    
    if(langSelect) {
        langSelect.value = savedLang;
        langSelect.addEventListener('change', (e) => {
            const newLang = e.target.value;
            localStorage.setItem('siteLang', newLang);
            applyLanguage(newLang);
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
                // Apply translation to placeholders if the element is an input or textarea
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translatedText;
                } else {
                    el.innerText = translatedText;
                }
            }
        });
    }
});