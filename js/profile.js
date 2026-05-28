class Profile {
    constructor() {
        this.api = new ApiService();
        this.token = localStorage.getItem('token');
        this.user = null;
        this.history = [];
        
        this.init();
    }

    async init() {
        if (!this.token) {
            window.location.href = 'index.html';
            return;
        }

        try {
            const profileData = await this.api.getProfile();
            this.user = profileData.user;
            console.log('Профиль загружен:', this.user.name);
        
            try {
                const historyData = await this.api.getTestHistory();
                this.history = historyData.results || [];
                console.log('История загружена:', this.history.length, 'тестов');
            } catch (historyError) {
                console.warn('История не загружена:', historyError.message);
                this.history = [];
            }
            
            this.renderProfile();
            this.renderStats();
            this.renderCategoryStats();
            this.renderHistory();
            this.updateHeader();
            
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error);
            // Если токен недействителен — выходим
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        }
    }

    updateHeader() {
        const authSection = document.getElementById('authSection');
        if (authSection && this.user) {
            authSection.innerHTML = `
                <span style="color: #2ecc71; font-weight: 600; margin-right: 15px;">${this.user.name}</span>
                <button class="btn-login" onclick="logout()">Выход</button>
            `;
        }
    }

    renderProfile() {
        if (!this.user) return;
        
        const avatar = document.getElementById('profileAvatar');
        if (avatar) avatar.textContent = this.user.name.charAt(0).toUpperCase();
        
        const nameEl = document.getElementById('profileName');
        if (nameEl) nameEl.textContent = this.user.name;
        
        const emailEl = document.getElementById('profileEmail');
        if (emailEl) emailEl.textContent = this.user.email;
        
        const dateEl = document.getElementById('profileDate');
        if (dateEl && this.user.created_at) {
            const createdDate = new Date(this.user.created_at);
            dateEl.textContent = `На сайте с ${createdDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}`;
        }
    }

    renderStats() {
        if (!this.history || this.history.length === 0) {
            this.setText('totalTests', '0');
            this.setText('avgScore', '0%');
            this.setText('bestScore', '0/0');
            this.setText('lastTest', '-');
            return;
        }

        this.setText('totalTests', this.history.length.toString());

        const avgPercentage = Math.round(
            this.history.reduce((sum, test) => sum + (test.score / test.total_questions * 100), 0) / this.history.length
        );
        this.setText('avgScore', `${avgPercentage}%`);

        const best = this.history.reduce((best, test) => {
            const percentage = test.score / test.total_questions * 100;
            return percentage > best.percentage ? { score: test.score, total: test.total_questions, percentage } : best;
        }, { score: 0, total: 0, percentage: 0 });
        this.setText('bestScore', `${best.score}/${best.total}`);

        const lastTest = this.history[0];
        const categoryNames = { driver: 'Водитель', pedestrian: 'Пешеход', cyclist: 'Велосипедист', scooter: 'Самокатчик' };
        this.setText('lastTest', `${categoryNames[lastTest.category] || lastTest.category}: ${lastTest.score}/${lastTest.total_questions}`);
    }

    renderCategoryStats() {
        const container = document.getElementById('categoryBars');
        if (!container) return;

        const categoryNames = { driver: 'Водитель', pedestrian: 'Пешеход', cyclist: 'Велосипедист', scooter: 'Самокатчик' };

        const categoryStats = {};
        if (this.history && this.history.length > 0) {
            this.history.forEach(test => {
                if (!categoryStats[test.category]) {
                    categoryStats[test.category] = { total: 0, count: 0 };
                }
                categoryStats[test.category].total += (test.score / test.total_questions * 100);
                categoryStats[test.category].count++;
            });
        }

        if (Object.keys(categoryStats).length === 0) {
            container.innerHTML = '<p style="color: #555; text-align: center; padding: 20px;">Нет данных для отображения</p>';
            return;
        }

        container.innerHTML = Object.entries(categoryNames).map(([key, name]) => {
            const stats = categoryStats[key];
            const percentage = stats ? Math.round(stats.total / stats.count) : 0;
            const count = stats ? stats.count : 0;
            
            return `
                <div class="category-bar-item">
                    <div class="bar-label">${name} <span style="color: #555; font-size: 12px;">(${count})</span></div>
                    <div class="bar-track">
                        <div class="bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="bar-value">${percentage}%</div>
                </div>
            `;
        }).join('');
    }

    renderHistory() {
        const container = document.getElementById('historyList');
        if (!container) return;

        if (!this.history || this.history.length === 0) {
            container.innerHTML = '<p class="empty-text">У вас пока нет завершенных тестов</p>';
            return;
        }

        const categoryNames = { driver: 'Водитель', pedestrian: 'Пешеход', cyclist: 'Велосипедист', scooter: 'Самокатчик' };

        container.innerHTML = this.history.slice(0, 20).map(test => {
            const percentage = Math.round((test.score / test.total_questions) * 100);
            const date = new Date(test.completed_at);
            
            let scoreClass = 'history-score';
            if (percentage >= 90) scoreClass += ' perfect';
            else if (percentage >= 70) scoreClass += ' good';
            else if (percentage >= 50) scoreClass += ' medium';
            else scoreClass += ' bad';
            
            return `
                <div class="history-item">
                    <div>
                        <div class="history-category">${categoryNames[test.category] || test.category}</div>
                        <div class="history-date">${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div class="${scoreClass}">${test.score}/${test.total_questions} (${percentage}%)</div>
                </div>
            `;
        }).join('');
    }

    setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }
}

let profile;
document.addEventListener('DOMContentLoaded', () => {
    profile = new Profile();
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}