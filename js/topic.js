// topic.js - Логика для работы с темами

async function loadExamsForTopics() {
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/exams`);
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

async function patchTopic(topicId, topicName, examIds) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${window.API_BASE_URL}/api/topics/${topicId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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

    const examIds = Array.from(document.getElementById('exam-ids').selectedOptions).map(option => option.value);
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
        const token = localStorage.getItem('token');
        const response = await fetch(`${window.API_BASE_URL}/api/topics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
        const response = await fetch(`${window.API_BASE_URL}api/topics/${id}`);
        if (response.ok) {
            const topic = await response.json();

            // Загружаем список экзаменов для формы редактирования
            await loadExamsForTopics();

            // Устанавливаем выбранные экзамены для темы
            const examIds = topic.exams ? topic.exams.map(exam => exam.id) : [];
            const examSelect = document.getElementById('exam-ids');

            Array.from(examSelect.options).forEach(option => {
                if (examIds.includes(option.value)) {
                    option.selected = true; // Отмечаем выбранные экзамены
                }
            });

            // Открываем форму с заполненными данными
            showTopicForm(topic.id, topic.name, examIds.join(','));
        } else {
            console.error('Ошибка при загрузке данных темы');
        }
    } catch (error) {
        console.error('Ошибка при загрузке данных темы:', error);
    }
}



async function deleteTopic(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${window.API_BASE_URL}/api/topics/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            loadTopics();
        } else {
            console.error('Ошибка при удалении темы');
        }
    } catch (error) {
        console.error('Ошибка при удалении темы:', error);
    }
}

async function loadTopics() {
    const urlParams = new URLSearchParams(window.location.search);
    const examId = urlParams.get('examId');

    let url = `${window.API_BASE_URL}/api/topics`;
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

                // Отображаем привязанные экзамены, если они есть
                if (topic.exams && topic.exams.length > 0) {
                    const examList = document.createElement('ul'); // Подсписок для экзаменов
                    topic.exams.forEach(exam => {
                        const examLi = document.createElement('li');
                        examLi.textContent = exam.name; // Отображаем имя экзамена
                        examList.appendChild(examLi);
                    });
                    li.appendChild(examList);
                } else {
                    // Если нет экзаменов, отображаем сообщение
                    const noExams = document.createElement('p');
                    noExams.textContent = 'Нет привязанных экзаменов';
                    li.appendChild(noExams);
                }

                // Создаем контейнер для кнопок
                const buttonContainer = document.createElement('div');
                buttonContainer.classList.add('topics-button-container');

                // Кнопка редактирования
                const editButton = document.createElement('button');
                editButton.textContent = 'Изменить';
                editButton.style.marginLeft = '10px';
                editButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    updateTopic(topic.id);
                });

                // Кнопка удаления
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-button');
                deleteButton.textContent = 'Удалить';
                deleteButton.style.marginLeft = '10px';
                deleteButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    if (confirm('Вы уверены, что хотите удалить эту тему?')) {
                        deleteTopic(topic.id);
                    }
                });

                // Добавляем кнопки в контейнер
                buttonContainer.appendChild(editButton);
                buttonContainer.appendChild(deleteButton);

                // Добавляем контейнер с кнопками в элемент списка
                li.appendChild(buttonContainer);

                // Добавляем элемент списка в список тем
                topicList.appendChild(li);

            });
        } else {
            console.error('Ошибка при загрузке тем');
        }
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
