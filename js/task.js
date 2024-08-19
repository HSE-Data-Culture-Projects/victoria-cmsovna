// task.js - Логика для работы с заданиями

async function loadTasks() {
    const urlParams = new URLSearchParams(window.location.search);
    const topicId = urlParams.get('topicId');

    let url = 'http://localhost:3000/api/tasks';
    if (topicId) {
        url += `/${topicId}`;
    }

    try {
        const response = await fetch(url);
        const tasks = await response.json();

        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.content;

            const editButton = document.createElement('button');
            editButton.textContent = 'Изменить';
            editButton.style.marginLeft = '10px';

            editButton.addEventListener('click', (event) => {
                event.stopPropagation();
                updateTask(task.id);
            });

            li.appendChild(editButton);

            taskList.appendChild(li);
        });
    } catch (error) {
        console.error('Ошибка при загрузке заданий:', error);
    }
}

async function addTask() {
    const taskContent = prompt('Введите XML содержимое задания:');
    const topicIdsInput = prompt('Введите идентификаторы тем через запятую:');
    const topicIds = topicIdsInput.split(',').map(id => id.trim());

    if (taskContent && topicIds.length > 0) {
        try {
            const response = await fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: taskContent, topicIds: topicIds })
            });

            if (response.ok) {
                loadTasks();
            } else {
                console.error('Ошибка при добавлении задания');
            }
        } catch (error) {
            console.error('Ошибка при добавлении задания:', error);
        }
    }
}

async function updateTask(id) {
    const taskContent = prompt('Введите новое содержимое задания:');
    if (taskContent) {
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: taskContent })
            });

            if (response.ok) {
                loadTasks();
            } else {
                console.error('Ошибка при обновлении задания');
            }
        } catch (error) {
            console.error('Ошибка при обновлении задания:', error);
        }
    }
}

document.getElementById('task-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const taskContent = document.getElementById('task-content').value;
    const topicIds = Array.from(document.getElementById('topic-ids').selectedOptions).map(option => option.value);
    const taskId = document.getElementById('task-id').value;

    if (taskId) {
        await updateTask(taskId, taskContent, topicIds);
    } else {
        await addTask(taskContent, topicIds);
    }
    hideTaskForm();
});

function showTaskForm(taskId = '', taskContent = '', topicIds = []) {
    document.getElementById('task-content').value = taskContent;
    const topicSelect = document.getElementById('topic-ids');
    topicSelect.value = topicIds;
    document.getElementById('task-id').value = taskId;
    document.getElementById('task-form-container').style.display = 'block';
}

function hideTaskForm() {
    document.getElementById('task-form-container').style.display = 'none';
}

function cancelTaskForm() {
    hideTaskForm();
}

async function loadTopicsForTasks() {
    try {
        const response = await fetch('http://localhost:3000/api/topics');
        if (response.ok) {
            const topics = await response.json();
            const topicSelect = document.getElementById('topic-ids');
            topicSelect.innerHTML = ''; // Очистка текущих опций
            topics.forEach(topic => {
                const option = document.createElement('option');
                option.value = topic.id;
                option.textContent = topic.name;
                topicSelect.appendChild(option);
            });
        } else {
            console.error('Ошибка при загрузке тем');
        }
    } catch (error) {
        console.error('Ошибка при загрузке тем:', error);
    }
}

// Вызов функции для загрузки тем при открытии формы
document.querySelector('.add-button').addEventListener('click', function() {
    loadTopics();
    showTaskForm();
});
document.addEventListener('DOMContentLoaded', loadTasks);
