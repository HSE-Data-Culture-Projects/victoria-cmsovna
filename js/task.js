// task.js - Логика для работы с заданиями

// Добавляем задачу с возможностью загрузки файла
async function addTask() {
    const taskContent = document.getElementById('task-content').value;
    const topicIds = Array.from(document.getElementById('topic-ids').selectedOptions).map(option => option.value);
    const fileInput = document.getElementById('task-file');
    const formData = new FormData();
    formData.append('content', taskContent);
    formData.append('topicIds', topicIds.join(','));

    if (fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]); // Добавляем файл, если он был загружен
    }

    try {
        const response = await fetch('http://localhost:3000/api/tasks', {
            method: 'POST',
            body: formData
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

// Загрузка и отображение всех задач (включая файлы)
async function loadTasks() {
    try {
        const response = await fetch('http://localhost:3000/api/tasks');
        const tasks = await response.json();

        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.content;

            if (task.originalname) {
                const fileLink = document.createElement('a');
                fileLink.href = `http://localhost:3000/uploads/${task.filename}`; // Правильная ссылка на файл
                fileLink.textContent = task.originalname;
                fileLink.download = task.originalname;
                li.appendChild(fileLink);
            }

            const editButton = document.createElement('button');
            editButton.textContent = 'Изменить';
            editButton.addEventListener('click', () => {
                loadTopicsForTasks();
                showTaskForm(task.id, task.content, task.topicIds);
            });
            li.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', () => deleteTask(task.id));
            li.appendChild(deleteButton);

            taskList.appendChild(li);
        });
    } catch (error) {
        console.error('Ошибка при загрузке заданий:', error);
    }
}


// Обновление задачи с возможностью загрузки нового файла
async function updateTask(id) {
    const taskContent = document.getElementById('task-content').value;
    const topicIds = Array.from(document.getElementById('topic-ids').selectedOptions).map(option => option.value);
    const fileInput = document.getElementById('task-file');
    const formData = new FormData();
    formData.append('content', taskContent);
    formData.append('topicIds', topicIds.join(','));

    if (fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]); // Добавляем новый файл, если он был загружен
    }

    try {
        const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
            method: 'PATCH',
            body: formData
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

// Удаление задачи и связанного с ней файла
async function deleteTask(id) {
    if (confirm('Вы уверены, что хотите удалить это задание?')) {
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadTasks(); // Перезагрузка списка задач после удаления
            } else {
                console.error('Ошибка при удалении задания');
            }
        } catch (error) {
            console.error('Ошибка при удалении задания:', error);
        }
    }
}

// Показ формы для добавления или изменения задачи
function showTaskForm(taskId = '', taskContent = '', topicIds = []) {
    document.getElementById('task-content').value = taskContent;
    const topicSelect = document.getElementById('topic-ids');
    topicSelect.value = topicIds;
    document.getElementById('task-id').value = taskId;
    document.getElementById('task-form-container').style.display = 'block';
}

// Скрытие формы
function hideTaskForm() {
    document.getElementById('task-form-container').style.display = 'none';
}

// Отмена формы
function cancelTaskForm() {
    hideTaskForm();
}

// Загрузка списка тем для выбора при создании/обновлении задачи
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

// Обработчик формы создания/обновления задания
document.getElementById('task-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const taskId = document.getElementById('task-id').value;

    if (taskId) {
        await updateTask(taskId);
    } else {
        await addTask();
    }
    hideTaskForm();
});

// Вызов функции для загрузки тем при открытии формы
document.querySelector('.add-button').addEventListener('click', function() {
    loadTopicsForTasks();
    showTaskForm();
});

document.addEventListener('DOMContentLoaded', loadTasks);
