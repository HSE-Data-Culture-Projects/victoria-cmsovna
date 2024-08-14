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
                loadTasks(); // Перезагружаем список заданий после добавления нового
            } else {
                console.error('Ошибка при добавлении задания');
            }
        } catch (error) {
            console.error('Ошибка при добавлении задания:', error);
        }
    }
}

// Вызываем loadTasks при загрузке страницы
document.addEventListener('DOMContentLoaded', loadTasks);
