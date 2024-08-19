// topic.js - Логика для работы с темами

async function loadExamsForTopics() {
    try {
        const response = await fetch('http://localhost:3000/api/exams');
        if (response.ok) {
            const exams = await response.json();
            const examSelect = document.getElementById('exam-ids');
            examSelect.innerHTML = '';
            exams.forEach(exam => {
                const option = document.createElement('option');
                option.value = exam.id;
                option.textContent = exam.name;
                examSelect.appendChild(option);
            });
        } else {
            console.error('Ошибка при загрузке экзаменов');
        }
    } catch (error) {
        console.error('Ошибка при загрузке экзаменов:', error);
    }
}

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

document.getElementById('topic-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const topicName = document.getElementById('topic-name').value;
    const examIdsInput = document.getElementById('exam-ids').value;
    const examIds = examIdsInput.split(',').map(id => id.trim());
    const topicId = document.getElementById('topic-id').value;

    if (topicId) {
        await updateTopic(topicId, topicName, examIds);
    } else {
        await addTopic(topicName, examIds);
    }
    hideTopicForm();
});

function showTopicForm(topicId = '', topicName = '', examIds = '') {
    document.getElementById('topic-name').value = topicName;
    document.getElementById('exam-ids').value = examIds;
    document.getElementById('topic-id').value = topicId;
    document.getElementById('topic-form-container').style.display = 'block';
}

function hideTopicForm() {
    document.getElementById('topic-form-container').style.display = 'none';
}

function cancelTopicForm() {
    hideTopicForm();
}

async function addTopic(topicName, examIds) {
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

async function updateTopic(id, topicName, examIds) {
    try {
        const response = await fetch(`http://localhost:3000/api/topics/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: topicName, examIds: examIds })
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

// Пример вызова showTopicForm для добавления темы
document.querySelector('.add-button').addEventListener('click', function () {
    loadExamsForTopics();
    showTopicForm();
});

document.addEventListener('DOMContentLoaded', loadTopics);
