class CategoryCard {
    static renderCategories(containerId, categories) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const token = localStorage.getItem('token');
        const isLoggedIn = !!token;

        container.innerHTML = categories.map(cat => {
            const lockText = isLoggedIn ? 'Доступен' : 'Требуется регистрация';
            const lockClass = isLoggedIn ? '' : 'category-lock';
            return `
                <div class="category-card" data-category="${cat.id}">
                    <h3>${cat.title}</h3>
                    <p>${cat.description}</p>
                    <div class="category-questions">20 <span>вопросов</span></div>
                    <span class="${lockClass}">${lockText}</span>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                if (isLoggedIn) {
                    // Пользователь авторизован — переходим к тесту
                    const category = card.dataset.category;
                    window.location.href = `quiz.html?category=${category}`;
                } else {
                    // Не авторизован — показываем окно регистрации
                    const event = new CustomEvent('showRegister');
                    document.dispatchEvent(event);
                }
            });
        });
    }
}