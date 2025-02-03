document.addEventListener('DOMContentLoaded', function () {
    loadPage();
});

function isTokenExpired(token) {
    if (!token) return true;
    try {
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        return payload.exp < Date.now() / 1000;
    } catch (err) {
        return true;
    }
}

(function checkAuth() {
    const token = localStorage.getItem('token');
    const isAuthPage = window.location.pathname.endsWith('auth.html');

    if (!token && !isAuthPage) {
        window.location.href = 'auth.html';
        return;
    }

    if (token && isTokenExpired(token)) {
        localStorage.removeItem('token');
        window.location.href = 'auth.html';
        return;
    }

    if (token && isAuthPage) {
        window.location.href = 'index.html';
    }
})();

function loadPage() {
    const page = document.body.getAttribute('data-page');
    switch (page) {
        case 'index':
            // На главной странице не нужно загружать дополнительные данные
            break;
        case 'exams':
            loadExams();
            break;
        case 'topics':
            loadTopics();
            break;
        case 'tasks':
            loadTasks();
            break;
        default:
            console.error('Неизвестная страница: ' + page);
    }
}

function navigateTo(page) {
    switch (page) {
        case 'index':
        case '':
            window.location.href = 'index.html';
            break;
        case 'exams':
            window.location.href = 'exams.html';
            break;
        case 'topics':
            window.location.href = 'topics.html';
            break;
        case 'tasks':
            window.location.href = 'tasks.html';
            break;
        default:
            console.error('Неизвестная страница для навигации: ' + page);
    }
}
