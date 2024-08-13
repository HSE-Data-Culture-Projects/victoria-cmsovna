// topic.js - Логика для работы с темами

function loadTopics() {
    const urlParams = new URLSearchParams(window.location.search);
    const examId = urlParams.get('examId');

    let topics = JSON.parse(localStorage.getItem('topics')) || [];
    topics = topics.filter(topic => topic.examId == examId);

    const topicList = document.getElementById('topic-list');
    topicList.innerHTML = '';

    topics.forEach(topic => {
        const li = document.createElement('li');
        li.textContent = topic.name;
        li.setAttribute('data-id', topic.id);
        li.addEventListener('click', () => {
            window.location.href = `tasks.html?topicId=${topic.id}`;
        });
        topicList.appendChild(li);
    });
}

function addTopic() {
    const topicName = prompt('Введите название темы:');
    if (topicName) {
        let topics = JSON.parse(localStorage.getItem('topics')) || [];
        const urlParams = new URLSearchParams(window.location.search);
        const examId = urlParams.get('examId');

        const newTopic = { id: Date.now(), name: topicName, examId: examId };
        topics.push(newTopic);
        localStorage.setItem('topics', JSON.stringify(topics));
        loadTopics();
    }
}
