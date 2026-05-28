document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = !!localStorage.getItem('token');

    if (isLoggedIn) {
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.textContent = 'Перейти к тестам';
            startBtn.onclick = () => {
                window.location.href = 'quiz.html';
            };
        }
    } else {
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                window.authModal.switchMode('register');
                window.authModal.show();
            });
        }

        setTimeout(() => {
            const loginBtn = document.getElementById('loginBtn');
            const registerBtn = document.getElementById('registerBtn');
            if (loginBtn) loginBtn.addEventListener('click', () => {
                window.authModal.switchMode('login');
                window.authModal.show();
            });
            if (registerBtn) registerBtn.addEventListener('click', () => {
                window.authModal.switchMode('register');
                window.authModal.show();
            });
        }, 100);
    }

    const categories = [
        { id: 'driver', title: 'Водитель', description: 'Тест для водителей транспортных средств' },
        { id: 'pedestrian', title: 'Пешеход', description: 'Тест для пешеходов по правилам перехода' },
        { id: 'cyclist', title: 'Велосипедист', description: 'Тест для велосипедистов на дорогах' },
        { id: 'scooter', title: 'Самокатчик', description: 'Тест для пользователей электросамокатов' }
    ];

    CategoryCard.renderCategories('categoriesGrid', categories);
});