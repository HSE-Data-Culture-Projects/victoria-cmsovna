// exam.js - Логика для работы с экзаменами

async function loadExams() {
    try {
        const response = await fetch('http://localhost:3000/api/exams'); // Запрос к вашему бэкенду
        const exams = await response.json();

        const examList = document.getElementById('exam-list');
        examList.innerHTML = '';

        exams.forEach(exam => {
            const li = document.createElement('li');
            li.textContent = exam.name;
            li.setAttribute('data-id', exam.id);

            const editButton = document.createElement('button');
            editButton.textContent = 'Изменить';
            editButton.style.marginLeft = '10px'; // Отступ для кнопки

            editButton.addEventListener('click', (event) => {
                event.stopPropagation();
                updateExam(exam.id);
            });

            li.appendChild(editButton);

            examList.appendChild(li);
        });
    } catch (error) {
        console.error('Ошибка при загрузке экзаменов:', error);
    }
}

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
        const response = await fetch('http://localhost:3000/api/exams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
        const response = await fetch(`http://localhost:3000/api/exams/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
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
        const response = await fetch(`http://localhost:3000/api/exams/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadExams(); // Перезагрузка списка экзаменов после удаления
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
        const response = await fetch('http://localhost:3000/api/exams');
        const exams = await response.json();

        const examList = document.getElementById('exam-list');
        examList.innerHTML = '';

        exams.forEach(exam => {
            const li = document.createElement('li');
            li.textContent = exam.name;
            li.setAttribute('data-id', exam.id);

            li.addEventListener('click', () => {
                window.location.href = `topics.html?examId=${exam.id}`;
            });

            const editButton = document.createElement('button');
            editButton.textContent = 'Изменить';
            editButton.style.marginLeft = '10px';
            editButton.addEventListener('click', (event) => {
                event.stopPropagation();
                showForm(exam.id, exam.name);
            });

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

            li.appendChild(editButton);
            li.appendChild(deleteButton);
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
