// ======================
// Утилита проверки токена
// ======================
function isTokenExpired(token) {
    if (!token) return true;

    try {
        // Разделяем JWT: заголовок, payload, подпись
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) return true;

        // Декодируем payload
        const payload = JSON.parse(atob(payloadBase64));

        // Проверяем поле exp (в секундах)
        if (!payload.exp) return true;

        const currentTime = Date.now() / 1000; // текущее время в секундах
        return payload.exp < currentTime;      // если exp меньше текущего времени — токен просрочен
    } catch (err) {
        // Любая ошибка парсинга = считаем токен просроченным
        return true;
    }
}

// ======================
// Логика для auth.html
// ======================
document.addEventListener('DOMContentLoaded', function() {
    // 1) Сначала проверяем, не залогинен ли пользователь уже (валидный токен?)
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
        console.log('[auth.js] Токен уже есть и он валиден → редирект на index.html');
        window.location.href = 'index.html';
        return;
    }

    // 2) Если токена нет / истёк, показываем форму авторизации
    const form = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            // Отправляем запрос на бэкенд
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            // Если статус ответа не 2xx
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Ошибка при авторизации');
            }

            // Парсим JSON, ищем token
            const result = await response.json();
            const { accessToken } = result;

            if (!accessToken) {
                throw new Error('Сервер не вернул поле "token".');
            }

            console.log('[auth.js] Получен токен от сервера:', accessToken);

            // Сохраняем токен в localStorage
            localStorage.setItem('token', accessToken);

            // Перенаправляем на главную страницу
            window.location.href = 'index.html';
        } catch (error) {
            console.error('[auth.js] Ошибка авторизации:', error);
            errorMessage.style.display = 'block';
            errorMessage.textContent = error.message;
        }
    });
});
