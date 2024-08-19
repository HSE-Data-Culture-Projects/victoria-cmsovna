// topic.js - Логика для работы с темами

async function loadTopics() {
    const urlParams = new URLSearchParams(window.location.search);
    const examId = urlParams.get('examId');

    let url = 'http://localhost:3000/api/topics';
    if (examId) {
        url += `/${examId}`;
    }

    try {
        const response = await fetch(url);
        const topics = await response.json();

        const topicList = document.getElementById('topic-list');
        topicList.innerHTML = '';

        topics.forEach(topic => {
            const li = document.createElement('li');
            li.textContent = topic.name;
            li.setAttribute('data-id', topic.id);

            li.addEventListener('click', () => {
                window.location.href = `tasks.html?topicId=${topic.id}`;
            });

            const editButton = document.createElement('button');
            editButton.textContent = 'Изменить';
            editButton.style.marginLeft = '10px';

            editButton.addEventListener('click', (event) => {
                event.stopPropagation();
                updateTopic(topic.id);
            });

            li.appendChild(editButton);
            topicList.appendChild(li);
        });
    } catch (error) {
        console.error('Ошибка при загрузке тем:', error);
    }
}

async function addTopic() {
    const topicName = prompt('Введите название темы:');
    const examIdsInput = prompt('Введите идентификаторы экзаменов через запятую:');
    const examIds = examIdsInput.split(',').map(id => id.trim());

    if (topicName && examIds.length > 0) {
        try {
            const response = await fetch('http://localhost:3000/api/topics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: topicName, examIds: examIds })
            });

            if (response.ok) {
                loadTopics();
            } else {
                console.error('Ошибка при добавлении темы');
            }
        } catch (error) {
            console.error('Ошибка при добавлении темы:', error);
        }
    }
}

async function updateTopic(id) {
    const topicName = prompt('Введите новое название темы:');
    if (topicName) {
        try {
            const response = await fetch(`http://localhost:3000/api/topics/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: topicName })
            });

            if (response.ok) {
                loadTopics();
            } else {
                console.error('Ошибка при обновлении темы');
            }
        } catch (error) {
            console.error('Ошибка при обновлении темы:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', loadTopics);
