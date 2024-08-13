// task.js - Логика для работы с заданиями

function loadTasks() {
    const urlParams = new URLSearchParams(window.location.search);
    const topicId = urlParams.get('topicId');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.topicId == topicId);

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.name;
        taskList.appendChild(li);
    });
}

function addTask() {
    const taskName = prompt('Введите название задания:');
    if (taskName) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const urlParams = new URLSearchParams(window.location.search);
        const topicId = urlParams.get('topicId');

        const newTask = { id: Date.now(), name: taskName, topicId: topicId };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }
}
