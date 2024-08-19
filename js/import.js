// import.js - Логика для импорта заданий из XML

// import.js
document.getElementById('import-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const fileInput = document.getElementById('xml-file');
    const file = fileInput.files[0];

    if (!file) {
        alert('Пожалуйста, выберите файл для импорта.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:3000/api/import', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert('Файл успешно загружен!');
            document.getElementById('importModal').style.display = 'none';
        } else {
            alert('Ошибка при загрузке файла.');
        }
    } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
        alert('Ошибка при загрузке файла.');
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
