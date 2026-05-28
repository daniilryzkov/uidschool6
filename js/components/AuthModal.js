class AuthModal {
    constructor() {
        this.api = new ApiService();
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        this.modal = document.getElementById('authModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.loginForm = document.getElementById('loginForm');
        this.regForm = document.getElementById('regForm');
        this.closeBtn = document.getElementById('closeModalBtn');
        this.currentMode = 'register';
        
        this.init();
    }

    init() {
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.hide());
        if (this.modal) this.modal.querySelector('.modal-bg').addEventListener('click', () => this.hide());

        document.getElementById('switchToRegister').addEventListener('click', () => this.switchMode('register'));
        document.getElementById('switchToLogin').addEventListener('click', () => this.switchMode('login'));

        if (this.loginForm) this.loginForm.addEventListener('submit', (e) => { e.preventDefault(); this.handleLogin(); });
        if (this.regForm) this.regForm.addEventListener('submit', (e) => { e.preventDefault(); this.handleRegister(); });

        document.addEventListener('showRegister', () => { this.switchMode('register'); this.show(); });
        document.addEventListener('showLogin', () => { this.switchMode('login'); this.show(); });

        this.checkAuthAndUpdateHeader();
    }

    async checkAuthAndUpdateHeader() {
        const token = localStorage.getItem('token');
        if (!token) { this.updateHeaderForGuest(); return; }

        try {
            const data = await this.api.getProfile();
            this.user = data.user;
            localStorage.setItem('user', JSON.stringify(data.user));
            this.updateHeaderForUser();
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.user = null;
            this.updateHeaderForGuest();
        }
    }

    updateHeaderForUser() {
        const authSection = document.getElementById('authSection');
        if (!authSection || !this.user) return;

        authSection.innerHTML = `
            <div class="auth-user">
                <span class="user-greeting">
                    Привет, <a href="profile.html" class="user-name-link">${this.user.name}</a>
                </span>
                <button class="btn-logout" onclick="window.authModal.logout()">Выйти</button>
            </div>
        `;
    }

    updateHeaderForGuest() {
        const authSection = document.getElementById('authSection');
        if (!authSection) return;

        authSection.innerHTML = `
            <button class="btn-login" id="loginBtn">Вход</button>
            <button class="btn-reg" id="registerBtn">Регистрация</button>
        `;

        document.getElementById('loginBtn').addEventListener('click', () => { this.switchMode('login'); this.show(); });
        document.getElementById('registerBtn').addEventListener('click', () => { this.switchMode('register'); this.show(); });
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.user = null;
        this.updateHeaderForGuest();
        window.location.href = 'index.html';
    }

    show() { if (this.modal) this.modal.classList.add('active'); }
    hide() { if (this.modal) this.modal.classList.remove('active'); this.resetForms(); }

    switchMode(mode) {
        this.currentMode = mode;
        this.resetForms();
        if (mode === 'login') {
            this.loginForm.style.display = 'block';
            this.regForm.style.display = 'none';
            this.modalTitle.textContent = 'Вход';
        } else {
            this.loginForm.style.display = 'none';
            this.regForm.style.display = 'block';
            this.modalTitle.textContent = 'Регистрация';
        }
    }

    resetForms() {
        if (this.loginForm) this.loginForm.reset();
        if (this.regForm) this.regForm.reset();
        // Сбрасываем чекбокс согласия
        const consentCheck = document.getElementById('consentCheck');
        if (consentCheck) consentCheck.checked = false;
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        if (!email || !password) { this.showToast('Заполните все поля', true); return; }

        try {
            const data = await this.api.login(email, password);
            this.api.setToken(data.token);
            this.user = data.user;
            localStorage.setItem('user', JSON.stringify(data.user));
            this.updateHeaderForUser();
            this.showToast('Вход выполнен');
            this.hide();
            setTimeout(() => window.location.href = 'quiz.html', 1000);
        } catch (error) {
            this.showToast(error.message, true);
        }
    }

    async handleRegister() {
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const password = document.getElementById('userPassword').value.trim();
        const consentCheck = document.getElementById('consentCheck');

        if (!name || !email || !password) { 
            this.showToast('Заполните все поля', true); 
            return; 
        }

        // Проверка согласия на обработку данных
        if (!consentCheck || !consentCheck.checked) {
            this.showToast('Необходимо согласие на обработку персональных данных', true);
            return;
        }

        // Проверка пароля
        if (password.length < 6) {
            this.showToast('Пароль должен быть не менее 6 символов', true);
            return;
        }

        try {
            const data = await this.api.register(name, email, password);
            this.api.setToken(data.token);
            this.user = data.user;
            localStorage.setItem('user', JSON.stringify(data.user));
            this.updateHeaderForUser();
            this.showToast('Регистрация успешна!');
            this.hide();
            setTimeout(() => window.location.href = 'quiz.html', 1000);
        } catch (error) {
            this.showToast(error.message, true);
        }
    }

    showToast(message, isError = false) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = `toast${isError ? ' error' : ''}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

window.authModal = new AuthModal();