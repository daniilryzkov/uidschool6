
/**
 * Модуль плавных переходов между страницами
 * Паттерн: Модуль (Module)
 */
const PageTransitions = (() => {
    
    function init() {
        // Перехватываем все ссылки в навигации
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Пропускаем внешние ссылки и якоря
                if (!href || href.startsWith('#') || href.startsWith('http')) return;
                
                e.preventDefault();
                navigateTo(href);
            });
        });
        
        // Показываем страницу при загрузке
        fadeIn();
    }
    
    // Переход на другую страницу
    function navigateTo(url) {
        const main = document.querySelector('main') || document.body;
        
        // Плавно скрываем
        main.style.opacity = '1';
        main.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        main.style.opacity = '0';
        main.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            window.location.href = url;
        }, 200);
    }
    
    // Плавное появление
    function fadeIn() {
        const main = document.querySelector('main') || document.body;
        main.style.opacity = '0';
        main.style.transform = 'translateY(10px)';
        main.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        requestAnimationFrame(() => {
            main.style.opacity = '1';
            main.style.transform = 'translateY(0)';
        });
    }
    
    return { init, navigateTo, fadeIn };
})();

// Запускаем при загрузке
document.addEventListener('DOMContentLoaded', () => {
    PageTransitions.init();
});