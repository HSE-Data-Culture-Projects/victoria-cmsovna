// import.js - Логика для импорта заданий из XML

document.getElementById('import-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('xml-file');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const xmlContent = e.target.result;
            parseAndStoreTasks(xmlContent);
        };
        reader.readAsText(file);
    } else {
        alert('Пожалуйста, выберите файл для импорта.');
    }
});

function parseAndStoreTasks(xmlContent) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "application/xml");
    const tasks = xmlDoc.getElementsByTagName('question');
    let existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const taskType = task.getAttribute('type');
        const taskName = task.getElementsByTagName('name')[0].textContent;
        const taskId = Date.now() + i;

        existingTasks.push({
            id: taskId,
            name: taskName,
            type: taskType,
            content: task.innerHTML,
            topicId: null // Здесь можно добавить логику привязки к теме
        });
    }

    localStorage.setItem('tasks', JSON.stringify(existingTasks));
    alert('Задания успешно импортированы!');
    window.location.href = 'tasks.html';
}
