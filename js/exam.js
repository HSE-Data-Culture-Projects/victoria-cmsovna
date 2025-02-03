// exam.js - Логика для работы с экзаменами

document.getElementById('exam-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const examName = document.getElementById('exam-name').value;
    const examId = document.getElementById('exam-id').value;

    if (examId && examName) {
        await updateExam(examId, examName);
    } else if (examName) {
        await addExam(examName);
    }
    hideForm();
});

function showForm(examId = '', examName = '') {
    document.getElementById('exam-name').value = examName;
    document.getElementById('exam-id').value = examId;
    document.getElementById('exam-form-container').style.display = 'block';
}

function hideForm() {
    document.getElementById('exam-form-container').style.display = 'none';
}

function cancelForm() {
    hideForm();
}

async function addExam(examName) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/exams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: examName })
        });

        if (response.ok) {
            loadExams();
        } else {
            console.error('Ошибка при добавлении экзамена');
        }
    } catch (error) {
        console.error('Ошибка при добавлении экзамена:', error);
    }
}

async function updateExam(id, examName) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/exams/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: examName })
        });

        if (response.ok) {
            loadExams();
        } else {
            console.error('Ошибка при обновлении экзамена');
        }
    } catch (error) {
        console.error('Ошибка при обновлении экзамена:', error);
    }
}

async function deleteExam(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/exams/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            loadExams();
        } else {
            console.error('Ошибка при удалении экзамена');
        }
    } catch (error) {
        console.error('Ошибка при удалении экзамена:', error);
    }
}

// Обновление функции loadExams для добавления кнопки удаления
async function loadExams() {
    try {
        const response = await fetch(`/api/exams`);
        const exams = await response.json();

        const examList = document.getElementById('exam-list');
        examList.innerHTML = '';

        exams.forEach(exam => {
            const li = document.createElement('li');
            li.textContent = exam.name;
            li.setAttribute('data-id', exam.id);

            // Создаем контейнер для кнопок
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('exam-button-container');

            // Создаем кнопку "Изменить"
            const editButton = document.createElement('button');
            editButton.textContent = 'Изменить';
            editButton.style.marginLeft = '10px';
            editButton.addEventListener('click', (event) => {
                event.stopPropagation();
                showForm(exam.id, exam.name);
            });

            // Создаем кнопку "Удалить"
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.classList.add('delete-button');
            deleteButton.style.marginLeft = '10px';
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                if (confirm('Вы уверены, что хотите удалить этот экзамен?')) {
                    deleteExam(exam.id);
                }
            });

            // Добавляем кнопки в контейнер
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);

            // Добавляем контейнер с кнопками в элемент списка
            li.appendChild(buttonContainer);

            // Добавляем элемент списка в список экзаменов
            examList.appendChild(li);

        });
    } catch (error) {
        console.error('Ошибка при загрузке экзаменов:', error);
    }
}


// Пример вызова showForm для добавления экзамена
document.querySelector('.add-button').addEventListener('click', function () {
    showForm();
});

document.addEventListener('DOMContentLoaded', loadExams);