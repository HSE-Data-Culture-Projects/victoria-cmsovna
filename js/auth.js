// Функция проверки токена на истечение
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
        // Если что-то пошло не так при декодировании — считаем токен просроченным
        return true;
    }
}

// 1) Сразу при загрузке скрипта проверяем, не истёк ли токен.
// Если токен валиден, перенаправляем на главную страницу.
(function checkTokenOnLoad() {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
        window.location.href = 'index.html';
    }
})();

// 2) Логика отправки формы для логина
// js/auth.js
// Убедитесь, что этот скрипт подключается после js/config.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            const response = await fetch(`${window.API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Ошибка при авторизации');
            }

            const result = await response.json();
            const { token } = result;

            // Сохраняем токен в localStorage
            localStorage.setItem('token', token);

            // Перенаправляем на главную страницу
            window.location.href = 'index.html';
        } catch (error) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = error.message;
        }
    });
});
