class NewsPage {
    constructor() {
        this.api = new ApiService();
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || '{}');
        this.currentFilter = 'all';
        this.displayedCount = 6;
        this.newsPerLoad = 3;
        
        this.news = [
            {
                id: 1,
                category: 'laws',
                title: 'Новые штрафы за нарушения ПДД в 2026 году',
                excerpt: 'Минтранс утвердил повышение штрафов за серьёзные нарушения. Превышение скорости теперь обойдётся водителям значительно дороже.',
                content: '<p>Министерство транспорта РФ утвердило новые размеры штрафов за нарушения правил дорожного движения. Изменения вступят в силу с 1 мая 2026 года.</p><p>Основные изменения:</p><ul><li>Превышение скорости на 20-40 км/ч — штраф увеличен с 500 до 1000 рублей</li><li>Превышение на 40-60 км/ч — с 1500 до 3000 рублей</li><li>Превышение более чем на 60 км/ч — с 5000 до 10000 рублей или лишение прав на 6 месяцев</li><li>Проезд на красный свет — с 1000 до 2000 рублей</li></ul><p>По словам представителей министерства, данные меры направлены на снижение аварийности на дорогах страны.</p>',
                date: '2026-04-20',
                image: 'assets/a.webp',
                featured: true
            },
            {
                id: 2,
                category: 'technology',
                title: 'Электросамокаты: новые правила',
                excerpt: 'Владельцев СИМ обяжут получать права категории M, а также регистрировать устройства мощнее 250 Вт.',
                content: '<p>С 15 мая 2026 года вступают в силу новые правила для пользователей электросамокатов и других средств индивидуальной мобильности (СИМ).</p><p>Ключевые изменения:</p><ul><li>Для управления СИМ мощнее 250 Вт потребуются права категории M</li><li>Все СИМ мощнее 250 Вт должны быть зарегистрированы в ГИБДД</li><li>Обязательное использование шлема при движении по проезжей части</li><li>Запрет на движение по автомагистралям и дорогам с разрешённой скоростью более 60 км/ч</li></ul><p>Штраф за нарушение новых правил составит от 800 до 1500 рублей.</p>',
                date: '2026-03-18',
                image: 'assets/b.webp',
                featured: false
            },
            {
                id: 3,
                category: 'safety',
                title: 'Кампания «Внимание — дети!»',
                excerpt: 'ГИБДД проведёт всероссийскую акцию по безопасности детей на дорогах. В школах пройдут уроки ПДД.',
                content: '<p>С 20 по 30 мая 2026 года Госавтоинспекция проведёт ежегодную всероссийскую акцию «Внимание — дети!».</p><p>В рамках акции запланированы:</p><ul><li>Уроки ПДД во всех школах страны</li><li>Рейды возле учебных заведений</li><li>Раздача светоотражающих элементов</li><li>Конкурсы рисунков и сочинений на тему безопасности</li></ul><p>Особое внимание будет уделено правилам перехода дороги и использованию светоотражателей в тёмное время суток.</p>',
                date: '2026-04-15',
                image: 'assets/c.jpg',
                featured: false
            },
            {
                id: 4,
                category: 'events',
                title: 'Форум по безопасности дорожного движения 2026',
                excerpt: 'Ведущие эксперты обсудили новые подходы к снижению аварийности на российских дорогах.',
                content: '<p>В Москве завершился ежегодный форум «Безопасность на дорогах — 2026», собравший более 500 экспертов со всей страны.</p><p>Основные темы форума:</p><ul><li>Внедрение интеллектуальных транспортных систем</li><li>Новые стандарты пассивной безопасности автомобилей</li><li>Развитие инфраструктуры для электротранспорта</li><li>Обучение детей правилам дорожного движения</li></ul><p>Участники форума отметили снижение смертности на дорогах на 8% по сравнению с прошлым годом.</p>',
                date: '2026-04-12',
                image: 'assets/d.jpg',
                featured: false
            },
            {
                id: 5,
                category: 'laws',
                title: 'Изменения в ПДД для велосипедистов',
                excerpt: 'С 1 июня вступают в силу поправки, касающиеся движения велосипедистов по проезжей части.',
                content: '<p>Правительство утвердило поправки в ПДД, касающиеся велосипедистов. Новые правила начнут действовать с 1 июня 2026 года.</p><p>Основные изменения:</p><ul><li>Велосипедистам разрешено движение по правому краю проезжей части в любом возрасте при отсутствии велодорожки</li><li>Обязательное использование шлема для велосипедистов младше 14 лет</li><li>Введение новых дорожных знаков для велосипедных зон</li><li>Штраф за нарушение ПДД велосипедистом увеличен до 1500 рублей</li></ul>',
                date: '2026-04-10',
                image: 'assets/e.jpg',
                featured: false
            },
            {
                id: 6,
                category: 'technology',
                title: 'Умные светофоры появятся в 50 городах',
                excerpt: 'Система адаптивного управления светофорами на основе ИИ будет внедрена до конца года.',
                content: '<p>До конца 2026 года в 50 крупных городах России будет внедрена система адаптивного управления светофорами на основе искусственного интеллекта.</p><p>Преимущества новой системы:</p><ul><li>Анализ трафика в реальном времени</li><li>Автоматическая настройка фаз светофоров</li><li>Снижение пробок на 25-30%</li><li>Приоритет для общественного транспорта</li></ul><p>Первые тесты показали сокращение времени в пути на 20% в часы пик.</p>',
                date: '2026-04-08',
                image: 'assets/f.jpg',
                featured: false
            },
            {
                id: 7,
                category: 'safety',
                title: 'Ремни безопасности: новые требования',
                excerpt: 'Все пассажиры такси теперь обязаны пристёгиваться на задних сиденьях. Штраф — 1000 рублей.',
                content: '<p>С 1 апреля 2026 года вступили в силу новые требования к использованию ремней безопасности в такси.</p><p>Ключевые моменты:</p><ul><li>Все пассажиры, включая сидящих сзади, обязаны пристёгиваться</li><li>Водитель такси обязан предупредить пассажиров о необходимости пристегнуться</li><li>Штраф для пассажира — 1000 рублей</li><li>Штраф для водителя за перевозку непристёгнутого пассажира — 3000 рублей</li></ul><p>По статистике, использование ремней на задних сиденьях снижает риск гибели при ДТП на 40%.</p>',
                date: '2026-04-05',
                image: 'assets/j.webp',
                featured: false
            },
            {
                id: 8,
                category: 'events',
                title: 'Автопробег в честь Дня Победы',
                excerpt: '10 мая состоится традиционный автопробег с перекрытием центральных улиц. Схема объезда опубликована.',
                content: '<p>10 мая 2026 года состоится традиционный автопробег, посвящённый Дню Победы.</p><p>Информация для водителей:</p><ul><li>Перекрытие центральных улиц с 8:00 до 14:00</li><li>Схема объезда доступна на сайте ГИБДД</li><li>Рекомендуется использовать общественный транспорт</li></ul><p>В автопробеге примут участие более 500 автомобилей. Маршрут пройдёт от Парка Победы до Кремля.</p>',
                date: '2026-04-03',
                image: 'assets/h.webp',
                featured: false
            },
            {
                id: 9,
                category: 'laws',
                title: 'Новые дорожные знаки в ПДД',
                excerpt: 'В правила добавлены знаки для электромобилей и зарядных станций. Они начнут действовать с июля.',
                content: '<p>В Правила дорожного движения официально добавлены новые дорожные знаки для электромобилей и зарядных станций.</p><p>Новые знаки включают:</p><ul><li>Знак «Зарядная станция для электромобилей»</li><li>Знак «Парковка для электромобилей»</li><li>Знак «Движение электромобилей запрещено» (для пешеходных зон)</li><li>Табличка «Кроме электромобилей»</li></ul><p>Знаки вступят в силу с 1 июля 2026 года. До этого времени будет действовать переходный период.</p>',
                date: '2026-04-01',
                image: 'assets/k.jpeg',
                featured: false
            }
        ];
        
        this.init();
    }

    init() {
        this.updateHeader();
        this.renderNews();
        this.setupFilters();
        this.setupLoadMore();
        this.setupModal();
    }

    setupModal() {
        const closeBtn = document.getElementById('closeNewsModal');
        const modal = document.getElementById('newsModal');
        const modalBg = modal ? modal.querySelector('.modal-bg') : null;

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        if (modalBg) {
            modalBg.addEventListener('click', () => this.closeModal());
        }
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    openModal(newsItem) {
        const modal = document.getElementById('newsModal');
        if (!modal) return;

        document.getElementById('newsModalCategory').textContent = this.getCategoryName(newsItem.category);
        document.getElementById('newsModalTitle').textContent = newsItem.title;
        document.getElementById('newsModalDate').textContent = this.formatDate(newsItem.date);
        document.getElementById('newsModalContent').innerHTML = newsItem.content;

        const imageEl = document.getElementById('newsModalImage');
        if (newsItem.image) {
            imageEl.src = newsItem.image;
            imageEl.alt = newsItem.title;
            imageEl.style.display = 'block';
        } else {
            imageEl.style.display = 'none';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('newsModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    updateHeader() {
        const authSection = document.getElementById('authSection');
        if (!authSection) return;

        if (this.user && this.user.name) {
            authSection.innerHTML = `
                <div class="auth-user">
                    <span class="user-greeting">
                        Привет, <a href="profile.html" class="user-name-link">${this.user.name}</a>
                    </span>
                    <button class="btn-logout" onclick="logout()">Выйти</button>
                </div>
            `;
        }
    }

    setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.displayedCount = 6;
                this.renderNews();
            });
        });
    }

    setupLoadMore() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.displayedCount += this.newsPerLoad;
                this.renderNews();
            });
        }
    }

    getFilteredNews() {
        if (this.currentFilter === 'all') return this.news;
        return this.news.filter(item => item.category === this.currentFilter);
    }

    getCategoryName(category) {
        const names = {
            laws: 'Изменения в законах',
            safety: 'Безопасность',
            technology: 'Технологии',
            events: 'События'
        };
        return names[category] || category;
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    renderNews() {
        const container = document.getElementById('newsGrid');
        const loadMoreBlock = document.getElementById('loadMoreBlock');
        if (!container) return;

        const filtered = this.getFilteredNews();
        const displayed = filtered.slice(0, this.displayedCount);

        if (displayed.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 80px 20px;">
                    <p style="color: #555; font-size: 18px;">Новостей в этой категории пока нет</p>
                </div>
            `;
            loadMoreBlock.style.display = 'none';
            return;
        }

        container.innerHTML = displayed.map((item, index) => {
            const isFeatured = item.featured && this.currentFilter === 'all';
            return `
                <div class="news-card ${isFeatured ? 'featured' : ''}" 
                     style="animation-delay: ${index * 0.1}s" 
                     data-id="${item.id}"
                     onclick="newsPage.openNewsById(${item.id})">
                    ${item.image 
                        ? `<img src="${item.image}" alt="${item.title}" class="news-card-image" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
                        : ''
                    }
                    <div class="news-card-image-placeholder" style="${item.image ? 'display:none' : 'display:flex'}">📰</div>
                    <div class="news-card-content">
                        <span class="news-card-category">${this.getCategoryName(item.category)}</span>
                        <h3 class="news-card-title">${item.title}</h3>
                        <p class="news-card-excerpt">${item.excerpt}</p>
                        <div class="news-card-footer">
                            <span class="news-card-date">${this.formatDate(item.date)}</span>
                            <span class="news-card-read-more">Читать далее →</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        if (loadMoreBlock) {
            loadMoreBlock.style.display = displayed.length < filtered.length ? 'block' : 'none';
        }
    }

    openNewsById(id) {
        const newsItem = this.news.find(item => item.id === id);
        if (newsItem) {
            this.openModal(newsItem);
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

let newsPage;
document.addEventListener('DOMContentLoaded', () => {
    newsPage = new NewsPage();
});