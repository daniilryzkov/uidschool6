class Quiz {
    constructor() {
        this.api = new ApiService();
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || '{}');
        
        this.currentCategory = null;
        this.allQuestions = [];
        this.testQuestions = [];
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.selectedAnswer = null;
        this.timer = null;
        this.timeLeft = 1200;
        
        this.init();
    }

    async init() {
        if (!this.token) {
            window.location.href = 'index.html';
            return;
        }

        try {
            const data = await this.api.getProfile();
            this.user = data.user;
            localStorage.setItem('user', JSON.stringify(data.user));
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error);
            this.logout();
            return;
        }

        this.updateHeader();
        this.loadCategories();

        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        
        if (categoryParam) {
            setTimeout(() => this.startTest(categoryParam), 200);
        }
    }

    updateHeader() {
        const authSection = document.getElementById('authSection');
        if (authSection && this.user.name) {
            authSection.innerHTML = `
                <div class="auth-user">
                    <span class="user-greeting">
                        Привет, <a href="profile.html" class="user-name-link">${this.user.name}</a>
                    </span>
                    <button class="btn-logout" onclick="quiz.logout()">Выйти</button>
                </div>
            `;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }

    loadCategories() {
        const categories = [
            { id: 'driver', title: 'Водитель', description: 'Тест для водителей транспортных средств' },
            { id: 'pedestrian', title: 'Пешеход', description: 'Тест для пешеходов по правилам перехода' },
            { id: 'cyclist', title: 'Велосипедист', description: 'Тест для велосипедистов на дорогах' },
            { id: 'scooter', title: 'Самокатчик', description: 'Тест для пользователей электросамокатов' }
        ];

        const container = document.getElementById('quizCategories');
        if (container) {
            container.innerHTML = categories.map(cat => `
                <div class="quiz-category-card" onclick="quiz.startTest('${cat.id}')">
                    <h3>${cat.title}</h3>
                    <p>${cat.description}</p>
                    <div class="question-count">20 <span>вопросов</span></div>
                </div>
            `).join('');
        }
    }

    async startTest(categoryId) {
        this.currentCategory = categoryId;
        this.allQuestions = await this.loadAllQuestions(categoryId);
        
        if (this.allQuestions.length === 0) {
            alert('Вопросы не найдены');
            return;
        }
        
        this.testQuestions = this.getRandomQuestions(this.allQuestions, 20);
        this.currentQuestionIndex = 0;
        this.answers = new Array(this.testQuestions.length).fill(undefined);
        this.timeLeft = 1200;
        
        const categoryScreen = document.getElementById('categoryScreen');
        const quizScreen = document.getElementById('quizScreen');
        const resultScreen = document.getElementById('resultScreen');
        
        if (categoryScreen) categoryScreen.style.display = 'none';
        if (resultScreen) resultScreen.style.display = 'none';
        if (quizScreen) quizScreen.style.display = 'block';
        
        this.showQuestion();
        this.startTimer();
        
        const nextBtn = document.getElementById('nextBtn');
        const backBtn = document.getElementById('backBtn');
        
        if (nextBtn) nextBtn.onclick = () => this.nextQuestion();
        if (backBtn) backBtn.onclick = () => this.goBack();
    }

    async loadAllQuestions(categoryId) {
        try {
            const response = await fetch('../data/questions.json');
            if (!response.ok) throw new Error('Ошибка загрузки');
            const data = await response.json();
            return data[categoryId] || [];
        } catch (error) {
            console.error('Ошибка загрузки вопросов:', error);
            return [];
        }
    }

    getRandomQuestions(questions, count) {
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    showQuestion() {
        if (!this.testQuestions[this.currentQuestionIndex]) return;
        
        const question = this.testQuestions[this.currentQuestionIndex];
        const questionNum = this.currentQuestionIndex + 1;
        
        const currentEl = document.getElementById('currentQuestion');
        const totalEl = document.getElementById('totalQuestions');
        const titleEl = document.getElementById('questionTitle');
        const answersGrid = document.getElementById('answersGrid');
        const nextBtn = document.getElementById('nextBtn');
        
        if (currentEl) currentEl.textContent = questionNum;
        if (totalEl) totalEl.textContent = this.testQuestions.length;
        if (titleEl) titleEl.textContent = `Вопрос ${questionNum}: ${question.text}`;
        
        if (answersGrid) {
            answersGrid.innerHTML = question.options.map((option, index) => `
                <div class="answer-item" data-index="${index}" onclick="quiz.selectAnswer(${index})">
                    ${option}
                </div>
            `).join('');
        }
        
        if (nextBtn) {
            nextBtn.disabled = true;
            nextBtn.textContent = 'Ответить';
        }
        
        this.selectedAnswer = null;
        
        if (this.answers[this.currentQuestionIndex] !== undefined) {
            this.showAnsweredState();
        }
    }

    selectAnswer(index) {
        if (this.answers[this.currentQuestionIndex] !== undefined) return;
        
        this.selectedAnswer = index;
        
        const items = document.querySelectorAll('.answer-item');
        items.forEach(item => item.classList.remove('selected'));
        items[index].classList.add('selected');
        
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) nextBtn.disabled = false;
    }

    nextQuestion() {
        if (this.selectedAnswer === null && this.answers[this.currentQuestionIndex] === undefined) {
            this.showToast('Выберите ответ', true);
            return;
        }
        
        if (this.answers[this.currentQuestionIndex] === undefined) {
            this.answers[this.currentQuestionIndex] = this.selectedAnswer;
        }
        
        const question = this.testQuestions[this.currentQuestionIndex];
        const userAnswer = this.answers[this.currentQuestionIndex];
        const isCorrect = userAnswer === question.correct;
        
        const items = document.querySelectorAll('.answer-item');
        items.forEach((item, index) => {
            item.classList.add('disabled');
            if (index === question.correct) item.classList.add('correct');
            if (index === userAnswer && !isCorrect) item.classList.add('wrong');
        });
        
        const isLast = this.currentQuestionIndex === this.testQuestions.length - 1;
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) nextBtn.textContent = isLast ? 'Завершить' : 'Далее';
        
        setTimeout(() => {
            if (!isLast) {
                this.currentQuestionIndex++;
                this.showQuestion();
            } else {
                this.finishTest();
            }
        }, 800);
    }

    showAnsweredState() {
        const savedAnswer = this.answers[this.currentQuestionIndex];
        const question = this.testQuestions[this.currentQuestionIndex];
        const items = document.querySelectorAll('.answer-item');
        
        items.forEach((item, index) => {
            item.classList.add('disabled');
            if (index === question.correct) item.classList.add('correct');
            if (index === savedAnswer && savedAnswer !== question.correct) item.classList.add('wrong');
            if (index === savedAnswer && savedAnswer === question.correct) item.classList.add('selected');
        });
        
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.disabled = false;
            const isLast = this.currentQuestionIndex === this.testQuestions.length - 1;
            nextBtn.textContent = isLast ? 'Завершить' : 'Далее';
        }
    }

    startTimer() {
        this.updateTimerDisplay();
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.finishTest();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timerElement = document.getElementById('timer');
        if (!timerElement) return;
        
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        timerElement.classList.remove('warning', 'danger');
        
        if (this.timeLeft <= 60) timerElement.classList.add('danger');
        else if (this.timeLeft <= 300) timerElement.classList.add('warning');
    }

    async finishTest() {
        clearInterval(this.timer);
        
        let correctCount = 0;
        this.testQuestions.forEach((q, i) => {
            if (this.answers[i] === q.correct) correctCount++;
        });
        
        const totalQuestions = this.testQuestions.length;
        const percentage = Math.round((correctCount / totalQuestions) * 100);
        
        await this.saveResult(correctCount, totalQuestions);
        
        const quizScreen = document.getElementById('quizScreen');
        const resultScreen = document.getElementById('resultScreen');
        
        if (quizScreen) quizScreen.style.display = 'none';
        if (resultScreen) resultScreen.style.display = 'block';
        
        const resultScore = document.getElementById('resultScore');
        if (resultScore) {
            resultScore.textContent = `${correctCount}/${totalQuestions}`;
            resultScore.className = 'result-score';
            if (percentage >= 90) resultScore.classList.add('perfect');
            else if (percentage >= 70) resultScore.classList.add('good');
            else if (percentage >= 50) resultScore.classList.add('medium');
            else resultScore.classList.add('bad');
        }
        
        let message = '';
        if (percentage >= 90) message = 'Отлично! Вы прекрасно знаете ПДД!';
        else if (percentage >= 70) message = 'Хороший результат! Есть над чем поработать.';
        else if (percentage >= 50) message = 'Удовлетворительно. Повторите правила.';
        else message = 'Нужно подучить ПДД. Попробуйте еще раз!';
        
        const messageEl = document.getElementById('resultMessage');
        if (messageEl) messageEl.textContent = message;
        
        const retryBtn = document.getElementById('retryBtn');
        const homeBtn = document.getElementById('homeBtn');
        
        if (retryBtn) {
            retryBtn.onclick = () => {
                if (resultScreen) resultScreen.style.display = 'none';
                const categoryScreen = document.getElementById('categoryScreen');
                if (categoryScreen) categoryScreen.style.display = 'block';
            };
        }
        
        if (homeBtn) {
            homeBtn.onclick = () => {
                window.location.href = 'index.html';
            };
        }
    }

    async saveResult(score, total) {
        try {
            const result = await this.api.saveTestResult(this.currentCategory, score, total);
            console.log('Результат сохранен:', result);
            this.showToast('Результат сохранен в профиле');
            return result;
        } catch (error) {
            console.error('Ошибка сохранения:', error);
        }
    }

    showToast(message, isError = false) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast${isError ? ' error' : ''}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    goBack() {
        if (confirm('Прогресс будет потерян. Выйти?')) {
            clearInterval(this.timer);
            const quizScreen = document.getElementById('quizScreen');
            const categoryScreen = document.getElementById('categoryScreen');
            if (quizScreen) quizScreen.style.display = 'none';
            if (categoryScreen) categoryScreen.style.display = 'block';
        }
    }
}

let quiz;
document.addEventListener('DOMContentLoaded', () => {
    quiz = new Quiz();
});