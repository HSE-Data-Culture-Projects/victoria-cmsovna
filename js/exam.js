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
                loadExams(); // Перезагружаем список экзаменов после добавления нового
            } else {
                console.error('Ошибка при добавлении экзамена');
            }
        } catch (error) {
            console.error('Ошибка при добавлении экзамена:', error);
        }
    }
}

// Вызываем loadExams при загрузке страницы
document.addEventListener('DOMContentLoaded', loadExams);
