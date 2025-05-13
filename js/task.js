async function addTask() {
    const taskContent = document.getElementById('task-content').value;
    const topicIds = Array.from(document.getElementById('topic-ids').selectedOptions).map(o => o.value);
    const formData = new FormData();
    formData.append('content', taskContent);
    formData.append('topicIds', topicIds.join(','));
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/tasks', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
        if (res.ok) loadTasks();
    } catch (err) { console.error('Ошибка при добавлении задания:', err) }
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.classList.add('task-card');
    try {
        const xml = new DOMParser().parseFromString(task.content, 'text/xml');
        const name = xml.querySelector('name > text');
        const questionEl = xml.querySelector('questiontext > text');
        if (name) {
            const h4 = document.createElement('h4');
            h4.textContent = name.textContent;
            li.appendChild(h4);
        }
        if (questionEl) {
            const div = document.createElement('div');
            div.innerHTML = questionEl.innerHTML;
            li.appendChild(div);
        }
    } catch { li.textContent = task.content }

    if (task.topics?.length) {
        const wrap = document.createElement('div');
        task.topics.forEach(t => {
            const s = document.createElement('span');
            s.textContent = t.name;
            s.classList.add('badge');
            wrap.appendChild(s);
        });
        li.appendChild(wrap);
    }

    if (task.originalname) {
        const b = document.createElement('button');
        b.textContent = 'Скачать';
        b.classList.add('download-button');
        b.addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = `/uploads/${task.filename}`;
            a.download = task.originalname;
            a.click();
        });
        li.appendChild(b);
    }

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('tasks-button-container');

    const edit = document.createElement('button');
    edit.textContent = 'Изменить';
    edit.classList.add('edit-button');
    edit.addEventListener('click', () => {
        showTaskForm(task.id, task.content, task.topics?.map(t => t.id) ?? []);
    });
    btnWrap.appendChild(edit);

    const del = document.createElement('button');
    del.textContent = 'Удалить';
    del.classList.add('delete-button');
    del.addEventListener('click', () => deleteTask(task.id));
    btnWrap.appendChild(del);

    li.appendChild(btnWrap);
    return li;
}

async function loadTasks() {
    try {
        const res = await fetch('/api/tasks');
        if (!res.ok) throw new Error();
        const tasks = await res.json();
        const groups = {};
        tasks.forEach(t => {
            const key = t.topics?.length ? t.topics[0].name : 'Без темы';
            (groups[key] ??= []).push(t);
        });
        const wrapper = document.getElementById('topic-list');
        wrapper.innerHTML = '';
        Object.entries(groups).forEach(([name, list]) => {
            const details = document.createElement('details');
            const summary = document.createElement('summary');
            summary.textContent = `${name} (${list.length})`;
            details.appendChild(summary);
            const ul = document.createElement('ul');
            ul.classList.add('task-ul');
            list.forEach(t => ul.appendChild(createTaskElement(t)));
            details.appendChild(ul);
            wrapper.appendChild(details);
        });
    } catch (err) { console.error('Ошибка при загрузке заданий:', err) }
}

async function updateTask(id) {
    const taskContent = document.getElementById('task-content').value;
    const topicIds = Array.from(document.getElementById('topic-ids').selectedOptions).map(o => o.value);
    const formData = new FormData();
    formData.append('content', taskContent);
    formData.append('topicIds', topicIds.join(','));
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/tasks/${id}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: formData });
        if (res.ok) loadTasks();
    } catch (err) { console.error('Ошибка при обновлении задания:', err) }
}

async function deleteTask(id) {
    if (!confirm('Вы уверены, что хотите удалить это задание?')) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) loadTasks();
    } catch (err) { console.error('Ошибка при удалении задания:', err) }
}

function showTaskForm(taskId = '', taskContent = '', topicIds = []) {
    document.getElementById('task-form-title').textContent = taskId ? 'Редактирование задания' : 'Новое задание';
    document.getElementById('task-id').value = taskId;
    document.getElementById('task-content').value = taskContent;
    loadTopics().then(() => {
        const sel = document.getElementById('topic-ids');
        Array.from(sel.options).forEach(o => o.selected = topicIds.includes(o.value));
    });
    document.getElementById('task-form-container').style.display = 'flex';
}

function hideTaskForm() {
    document.getElementById('task-form-container').style.display = 'none';
}

async function loadTopics() {
    try {
        const res = await fetch('/api/topics');
        if (!res.ok) throw new Error();
        const topics = await res.json();

        const importSelect = document.getElementById('import-topic');
        if (importSelect) {
            importSelect.innerHTML = '<option value="">Выберите тему</option>';
            topics.forEach(t => {
                const o = document.createElement('option');
                o.value = t.id;
                o.textContent = t.name;
                importSelect.appendChild(o);
            });
        }

        const formSelect = document.getElementById('topic-ids');
        if (formSelect) {
            formSelect.innerHTML = '';
            topics.forEach(t => {
                const o = document.createElement('option');
                o.value = t.id;
                o.textContent = t.name;
                formSelect.appendChild(o);
            });
        }

        return topics;
    } catch (err) { console.error('Ошибка при загрузке тем:', err) }
}

async function loadTopicsForImport() {
    try {
        const res = await fetch('/api/topics');
        if (!res.ok) throw new Error();
        const topics = await res.json();
        const select = document.getElementById('import-topic');
        select.innerHTML = '<option value="">Выберите тему</option>';
        topics.forEach(t => {
            const o = document.createElement('option');
            o.value = t.id;
            o.textContent = t.name;
            select.appendChild(o);
        });
    } catch (err) { console.error('Ошибка при загрузке тем для импорта:', err) }
}

async function importXmlQuestions() {
    const filesInput = document.getElementById('multi-files');
    const topicSelect = document.getElementById('import-topic');
    if (!filesInput.files.length) { alert('Выберите хотя бы один файл'); return }
    if (!topicSelect.value) { alert('Выберите тему'); return }
    const formData = new FormData();
    [...filesInput.files].forEach(f => formData.append('files', f));
    formData.append('topicIds', JSON.stringify([topicSelect.value]));
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/tasks/import-xml', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
        const json = await res.json();
        if (res.ok) {
            alert(`Импортировано: ${json.message}`);
            loadTasks();
        } else alert(`Ошибка импорта: ${json.error || JSON.stringify(json)}`);
    } catch (err) {
        console.error('Ошибка импорта XML-файлов:', err);
        alert('Ошибка импорта файлов');
    }
}

document.getElementById('multi-import-form').addEventListener('submit', e => { e.preventDefault(); importXmlQuestions() });
document.getElementById('task-form').addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('task-id').value;
    if (id) updateTask(id); else addTask();
    hideTaskForm();
});
document.getElementById('task-cancel-btn').addEventListener('click', hideTaskForm);

document.addEventListener('DOMContentLoaded', () => {
    loadTopics();
    loadTopicsForImport();
    loadTasks();
});
