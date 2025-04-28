async function addTask() {
    const taskContent = document.getElementById('task-content').value;
    const topicIds = Array.from(document.getElementById('topic-ids').selectedOptions)
        .map(opt => opt.value);
    const fileInput = document.getElementById('task-file');

    const formData = new FormData();
    formData.append('content', taskContent);
    formData.append('topicIds', topicIds.join(','));

    if (fileInput.files.length) {
        formData.append('file', fileInput.files[0]);
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (response.ok) loadTasks();
        else console.error('Ошибка при добавлении задания');
    } catch (err) {
        console.error('Ошибка при добавлении задания:', err);
    }
}

function createTaskElement(task) {
    const li = document.createElement('li');

    try {
        const xml = new DOMParser().parseFromString(task.content, 'text/xml');
        const name = xml.querySelector('name > text');
        const questionEl = xml.querySelector('questiontext > text');

        if (name && questionEl) {
            const nameP = document.createElement('p');
            nameP.textContent = 'Название: ' + name.textContent;
            li.appendChild(nameP);

            const textDiv = document.createElement('div');
            textDiv.innerHTML = questionEl.innerHTML;
            li.appendChild(textDiv);
        } else {
            li.textContent = task.content;
        }
    } catch (e) {
        console.error('Ошибка парсинга XML:', e);
        li.textContent = task.content;
    }

    if (task.topics?.length) {
        const tUl = document.createElement('ul');
        task.topics.forEach(t => {
            const tLi = document.createElement('li');
            tLi.textContent = t.name;
            tUl.appendChild(tLi);
        });
        li.appendChild(tUl);
    }

    if (task.originalname) {
        const dlBtn = document.createElement('button');
        dlBtn.textContent = 'Скачать';
        dlBtn.classList.add('download-button');
        dlBtn.addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = `/uploads/${task.filename}`;
            a.download = task.originalname;
            a.click();
        });
        li.appendChild(dlBtn);
    }

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('tasks-button-container');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Изменить';
    editBtn.classList.add('edit-button');
    editBtn.addEventListener('click', () => {
        loadTopics();
        showTaskForm(task.id, task.content, task.topicIds);
    });
    btnWrap.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Удалить';
    delBtn.classList.add('delete-button');
    delBtn.addEventListener('click', () => deleteTask(task.id));
    btnWrap.appendChild(delBtn);

    li.appendChild(btnWrap);

    return li;
}

async function loadTasks() {
    try {
        const res = await fetch('/api/tasks');
        if (!res.ok) throw new Error('Не удалось получить список заданий');

        const tasks = await res.json();

        const groups = {};

        tasks.forEach(task => {
            const key = task.topics?.length ? task.topics[0].name : 'Без темы';
            (groups[key] ??= []).push(task);
        });

        const wrapper = document.getElementById('topic-list');
        wrapper.innerHTML = '';

        Object.entries(groups).forEach(([topicName, topicTasks]) => {
            const details = document.createElement('details');
            const summary = document.createElement('summary');
            summary.textContent = `${topicName} (${topicTasks.length})`;
            details.appendChild(summary);

            const ul = document.createElement('ul');
            ul.classList.add('task-ul');
            topicTasks.forEach(t => ul.appendChild(createTaskElement(t)));

            details.appendChild(ul);
            wrapper.appendChild(details);
        });
    } catch (err) {
        console.error('Ошибка при загрузке заданий:', err);
    }
}

async function updateTask(id) {
    const taskContent = document.getElementById('task-content').value;
    const topicIds = Array.from(document.getElementById('topic-ids').selectedOptions)
        .map(opt => opt.value);
    const fileInput = document.getElementById('task-file');

    const formData = new FormData();
    formData.append('content', taskContent);
    formData.append('topicIds', topicIds.join(','));

    if (fileInput.files.length) {
        formData.append('file', fileInput.files[0]);
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (response.ok) loadTasks();
        else console.error('Ошибка при обновлении задания');
    } catch (err) {
        console.error('Ошибка при обновлении задания:', err);
    }
}

async function deleteTask(id) {
    if (!confirm('Вы уверены, что хотите удалить это задание?')) return;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) loadTasks();
        else console.error('Ошибка при удалении задания');
    } catch (err) {
        console.error('Ошибка при удалении задания:', err);
    }
}

function showTaskForm(taskId = '', taskContent = '', topicIds = []) {
    document.getElementById('task-content').value = taskContent;

    const topicSelect = document.getElementById('topic-ids');
    Array.from(topicSelect.options).forEach(opt => {
        opt.selected = topicIds.includes(opt.value);
    });

    document.getElementById('task-id').value = taskId;
    document.getElementById('task-form-container').style.display = 'block';
}
function hideTaskForm() { document.getElementById('task-form-container').style.display = 'none'; }
function cancelTaskForm() { hideTaskForm(); }

async function loadTopicsForImport() {
    try {
        const res = await fetch('/api/topics');
        if (!res.ok) throw new Error('Не удалось получить темы');

        const topics = await res.json();
        const select = document.getElementById('import-topic');
        select.innerHTML = '<option value="">Выберите тему</option>';

        topics.forEach(t => {
            const o = document.createElement('option');
            o.value = t.id;
            o.textContent = t.name;
            select.appendChild(o);
        });
    } catch (err) {
        console.error('Ошибка при загрузке тем для импорта:', err);
    }
}

async function importXmlQuestions() {
    const filesInput = document.getElementById('multi-files');
    const topicSelect = document.getElementById('import-topic');

    if (!filesInput.files.length) { alert('Выберите хотя бы один файл'); return; }
    if (!topicSelect.value) { alert('Выберите тему'); return; }

    const formData = new FormData();
    [...filesInput.files].forEach(f => formData.append('files', f));
    formData.append('topicIds', JSON.stringify([topicSelect.value]));

    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/tasks/import-xml', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        const json = await res.json();
        if (res.ok) {
            alert(`Импортировано: ${json.message}`);
            loadTasks();
        } else {
            alert(`Ошибка импорта: ${json.error || JSON.stringify(json)}`);
        }
    } catch (err) {
        console.error('Ошибка импорта XML‑файлов:', err);
        alert('Ошибка импорта файлов');
    }
}

document.getElementById('multi-import-form')
    .addEventListener('submit', e => { e.preventDefault(); importXmlQuestions(); });

document.querySelector('.add-button')
    .addEventListener('click', () => { loadTopics(); showTaskForm(); });

/* при загрузке страницы */
document.addEventListener('DOMContentLoaded', () => {
    loadTopicsForImport();
    loadTasks();
});
