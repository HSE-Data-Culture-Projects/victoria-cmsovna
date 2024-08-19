// import.js - Логика для импорта файлов и редактирования

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

async function loadFiles() {
    try {
        const response = await fetch('http://localhost:3000/api/import');
        const files = await response.json();

        const fileList = document.getElementById('file-list');
        fileList.innerHTML = '';

        files.forEach(file => {
            const li = document.createElement('li');
            li.textContent = file.originalname;

            const downloadLink = document.createElement('a');
            downloadLink.href = `http://localhost:3000/api/import/${file.id}/download`;
            downloadLink.textContent = 'Скачать';
            li.appendChild(downloadLink);

            const editButton = document.createElement('button');
            editButton.textContent = 'Изменить';
            editButton.style.marginLeft = '10px';

            editButton.addEventListener('click', () => updateFile(file.id));

            li.appendChild(editButton);
            fileList.appendChild(li);
        });
    } catch (error) {
        console.error('Ошибка при загрузке файлов:', error);
    }
}

async function updateFile(id) {
    const newName = prompt('Введите новое имя файла:');
    if (newName) {
        try {
            const response = await fetch(`http://localhost:3000/api/import/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ originalname: newName })
            });

            if (response.ok) {
                loadFiles();
            } else {
                console.error('Ошибка при обновлении файла');
            }
        } catch (error) {
            console.error('Ошибка при обновлении файла:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', loadFiles);
