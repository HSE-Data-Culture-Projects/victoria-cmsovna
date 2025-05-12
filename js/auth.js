function isTokenExpired(token) {
    if (!token) return true;

    try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) return true;

        const payload = JSON.parse(atob(payloadBase64));

        if (!payload.exp) return true;

        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
    } catch (err) {
        return true;
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
        console.log('[auth.js] Токен уже есть и он валиден → редирект на index.html');
        window.location.href = 'index.html';
        return;
    }

    const form = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Ошибка при авторизации');
            }

            const result = await response.json();
            const { accessToken } = result;

            if (!accessToken) {
                throw new Error('Сервер не вернул поле "token".');
            }

            console.log('[auth.js] Получен токен от сервера:', accessToken);
            localStorage.setItem('token', accessToken);

            window.location.href = 'index.html';
        } catch (error) {
            console.error('[auth.js] Ошибка авторизации:', error);
            errorMessage.style.display = 'block';
            errorMessage.textContent = error.message;
        }
    });
});
