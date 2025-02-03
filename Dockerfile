FROM nginx:alpine

# Копируем наш кастомный конфиг, чтобы переопределить дефолтный
COPY default.conf /etc/nginx/conf.d/default.conf

# Удаляем все файлы по умолчанию, если они есть
RUN rm -rf /usr/share/nginx/html/*

# Копируем содержимое папки views в корень раздачи
COPY views/ /usr/share/nginx/html/

# Также копируем остальные каталоги (assets, css, js, data)
COPY assets/ /usr/share/nginx/html/assets/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY data/ /usr/share/nginx/html/data/

EXPOSE 80
