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
        formData.append('file', fileInput.files[0]);
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${window.API_BASE_URL}/api/tasks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
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
        const response = await fetch(`${window.API_BASE_URL}api/tasks`);
        const tasks = await response.json();

        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.content;

            // Отображаем привязанные темы
            if (task.topics && task.topics.length > 0) {
                const topicList = document.createElement('ul');
                task.topics.forEach(topic => {
                    const topicLi = document.createElement('li');
                    topicLi.textContent = topic.name;
                    topicList.appendChild(topicLi);
                });
                li.appendChild(topicList);
            }

            // Кнопка скачивания, если есть оригинальное имя файла
            if (task.originalname) {
                const downloadButton = document.createElement('button');
                downloadButton.textContent = 'Скачать';
                downloadButton.addEventListener('click', () => {
                    const link = document.createElement('a');
                    link.href = `${window.API_BASE_URL}/uploads/${task.filename}`;
                    link.download = task.originalname;
                    link.click();
                });
                downloadButton.classList.add('download-button');
                li.appendChild(downloadButton);
            }

            // Создаем контейнер для кнопок "Изменить" и "Удалить"
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('tasks-button-container');

            // Кнопка редактирования
            const editButton = document.createElement('button');
            editButton.textContent = 'Изменить';
            editButton.classList.add('edit-button');
            editButton.addEventListener('click', () => {
                loadTopicsForTasks();
                showTaskForm(task.id, task.content, task.topicIds);
            });
            buttonContainer.appendChild(editButton); // Добавляем кнопку в контейнер

            // Кнопка удаления
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => deleteTask(task.id));
            buttonContainer.appendChild(deleteButton); // Добавляем кнопку в контейнер

            // Добавляем контейнер с кнопками в элемент списка
            li.appendChild(buttonContainer);

            // Добавляем элемент списка в список задач
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
        formData.append('file', fileInput.files[0]);
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${window.API_BASE_URL}/api/tasks/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            },
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
            const token = localStorage.getItem('token');
            const response = await fetch(`${window.API_BASE_URL}/api/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                loadTasks();
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
        const response = await fetch('${window.API_BASE_URL}/api/topics');
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
document.getElementById('task-form').addEventListener('submit', async function (event) {
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
document.querySelector('.add-button').addEventListener('click', function () {
    loadTopicsForTasks();
    showTaskForm();
});

document.addEventListener('DOMContentLoaded', loadTasks);
