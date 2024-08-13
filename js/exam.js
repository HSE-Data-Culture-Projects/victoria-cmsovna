// exam.js - Логика для работы с экзаменами

function loadExams() {
    let exams = JSON.parse(localStorage.getItem('exams')) || [];
    
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
}

function addExam() {
    const examName = prompt('Введите название экзамена:');
    if (examName) {
        let exams = JSON.parse(localStorage.getItem('exams')) || [];
        const newExam = { id: Date.now(), name: examName };
        exams.push(newExam);
        localStorage.setItem('exams', JSON.stringify(exams));
        loadExams();
    }
}
