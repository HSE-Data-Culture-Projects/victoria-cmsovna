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
        if (response.ok) {
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
                editButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    patch(topic.id, topic.name, topic.exams.map(exam => exam.id).join(','));
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Удалить';
                deleteButton.classList.add('delete-button');
                deleteButton.style.marginLeft = '10px';
                deleteButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    if (confirm('Вы уверены, что хотите удалить эту тему?')) {
                        deleteTopic(topic.id);
                    }
                });

                li.appendChild(editButton);
                li.appendChild(deleteButton);
                topicList.appendChild(li);
            });
        } else {
            console.error('Ошибка при загрузке тем');
        }
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

async function patchTopic(topicId, topicName, examIds) {
    try {
        const response = await fetch(`http://localhost:3000/api/topics/${topicId}`, {
            method: 'PUT',
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

document.getElementById('topic-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const topicName = document.getElementById('topic-name').value;
    const examIdsInput = document.getElementById('exam-ids').value;
    const examIds = examIdsInput.split(',').map(id => id.trim());
    const topicId = document.getElementById('topic-id').value;

    if (topicId) {
        await patchTopic(topicId, topicName, examIds);
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

async function updateTopic(id) {
    try {
        // Запрос на получение данных о теме для редактирования
        const response = await fetch(`http://localhost:3000/api/topics/${id}`);
        if (response.ok) {
            const topic = await response.json();

            // Загружаем список экзаменов для формы редактирования
            await loadExamsForTopics();

            // Получаем ID экзаменов, связанных с темой
            const examIds = topic.exams ? topic.exams.map(exam => exam.id).join(',') : '';

            // Открываем форму с заполненными данными темы
            showTopicForm(topic.id, topic.name, examIds);
        } else {
            console.error('Ошибка при загрузке данных темы');
        }
    } catch (error) {
        console.error('Ошибка при загрузке данных темы:', error);
    }
}


async function deleteTopic(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/topics/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadTopics(); // Перезагрузка списка тем после удаления
        } else {
            console.error('Ошибка при удалении темы');
        }
    } catch (error) {
        console.error('Ошибка при удалении темы:', error);
    }
}

// Обновление функции loadTopics для добавления кнопки удаления
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

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.classList.add('delete-button');
            deleteButton.style.marginLeft = '10px';
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                if (confirm('Вы уверены, что хотите удалить эту тему?')) {
                    deleteTopic(topic.id);
                }
            });

            li.appendChild(editButton);
            li.appendChild(deleteButton);
            topicList.appendChild(li);
        });
    } catch (error) {
        console.error('Ошибка при загрузке тем:', error);
    }
}


// Пример вызова showTopicForm для добавления темы
document.querySelector('.add-button').addEventListener('click', function () {
    loadExamsForTopics();
    showTopicForm();
});

document.addEventListener('DOMContentLoaded', loadTopics);
