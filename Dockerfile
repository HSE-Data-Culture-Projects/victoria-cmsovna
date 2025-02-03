FROM nginx:alpine

# Копируем наш кастомный конфиг Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# Удаляем файлы по умолчанию из каталога раздачи
RUN rm -rf /usr/share/nginx/html/*

# Копируем содержимое папки views в корень раздачи
COPY views/ /usr/share/nginx/html/

# Копируем остальные каталоги (assets, css, js, data)
COPY assets/ /usr/share/nginx/html/assets/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY data/ /usr/share/nginx/html/data/

EXPOSE 80

# Добавляем VOLUME, чтобы задать том в конфигурации образа
VOLUME ["/usr/share/nginx/html"]
