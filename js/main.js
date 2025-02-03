document.addEventListener('DOMContentLoaded', function() {
    loadPage();
});

function loadPage() {
    const page = document.body.getAttribute('data-page');
    switch(page) {
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
    switch(page) {
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
