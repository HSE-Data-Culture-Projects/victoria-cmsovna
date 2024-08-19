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

            li.addEventListener('click', () => {
                window.location.href = `topics.html?examId=${exam.id}`;
            });

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

async function addExam() {
    const examName = prompt('Введите название экзамена:');
    if (examName) {
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
}

async function updateExam(id) {
    const examName = prompt('Введите новое название экзамена:');
    if (examName) {
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
}

document.addEventListener('DOMContentLoaded', loadExams);
