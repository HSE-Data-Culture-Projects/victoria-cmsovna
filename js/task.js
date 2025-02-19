// task.js - Логика для работы с заданиями

// Функция для добавления одного задания (существующий функционал)
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
        const response = await fetch(`/api/tasks`, {
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

// Функция для загрузки и отображения всех заданий (существующий функционал)
async function loadTasks() {
    try {
        const response = await fetch(`/api/tasks`);
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
                    link.href = `/uploads/${task.filename}`;
                    link.download = task.originalname;
                    link.click();
                });
                downloadButton.classList.add('download-button');
                li.appendChild(downloadButton);
            }

            // Контейнер для кнопок "Изменить" и "Удалить"
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
            buttonContainer.appendChild(editButton);

            // Кнопка удаления
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => deleteTask(task.id));
            buttonContainer.appendChild(deleteButton);

            li.appendChild(buttonContainer);
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error('Ошибка при загрузке заданий:', error);
    }
}

// Функция для обновления задания (существующий функционал)
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
        const response = await fetch(`/api/tasks/${id}`, {
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

// Функция для удаления задания (существующий функционал)
async function deleteTask(id) {
    if (confirm('Вы уверены, что хотите удалить это задание?')) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/tasks/${id}`, {
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

// Функция для показа формы редактирования/добавления задания (существующий функционал)
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

// Загрузка списка тем для формы (существующий функционал)
async function loadTopicsForTasks() {
    try {
        const response = await fetch('/api/topics');
        if (response.ok) {
            const topics = await response.json();
            const topicSelect = document.getElementById('topic-ids');
            topicSelect.innerHTML = '';
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

// Новая функция для множественной загрузки XML файлов
async function importMultipleTasks() {
    const filesInput = document.getElementById('multi-files');
    if (filesInput.files.length === 0) {
        alert('Выберите хотя бы один XML файл для импорта.');
        return;
    }
    const formData = new FormData();
    // Добавляем все выбранные файлы в FormData
    for (let i = 0; i < filesInput.files.length; i++) {
        formData.append('files', filesInput.files[i]);
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/tasks/import-multiple', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            alert(`Импортировано: ${result.message}`);
            loadTasks();
        } else {
            alert(`Ошибка импорта: ${result.error || JSON.stringify(result)}`);
        }
    } catch (error) {
        console.error('Ошибка импорта множественных файлов:', error);
        alert('Ошибка импорта файлов');
    }
}

// Обработчик формы создания/редактирования задания (существующий функционал)
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

// Обработчик формы для множественной загрузки XML файлов
document.getElementById('multi-import-form').addEventListener('submit', function (event) {
    event.preventDefault();
    importMultipleTasks();
});

// Загрузка тем при нажатии на кнопку "Добавить задание"
document.querySelector('.add-button').addEventListener('click', function () {
    loadTopicsForTasks();
    showTaskForm();
});

// Загрузка заданий при загрузке страницы
document.addEventListener('DOMContentLoaded', loadTasks);
