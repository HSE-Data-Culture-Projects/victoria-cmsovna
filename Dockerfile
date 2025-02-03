FROM nginx:alpine

# Копируем наш кастомный конфиг, чтобы переопределить дефолтный
COPY default.conf /etc/nginx/conf.d/default.conf

# Удаляем все файлы по умолчанию, если они есть
RUN rm -rf /usr/share/nginx/html/*

# Создаем папку views в корне раздачи
RUN mkdir -p /usr/share/nginx/html/views

# Копируем содержимое папки views в папку views внутри раздачи
COPY views/ /usr/share/nginx/html/views/

# Также копируем остальные каталоги (assets, css, js, data)
COPY assets/ /usr/share/nginx/html/assets/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY data/ /usr/share/nginx/html/data/

EXPOSE 80
