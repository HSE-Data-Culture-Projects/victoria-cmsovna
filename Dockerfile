FROM nginx:alpine

# Копируем наш кастомный конфиг, чтобы переопределить дефолтный
COPY default.conf /etc/nginx/conf.d/default.conf

# Удаляем файлы по умолчанию из папки раздачи
RUN rm -rf /usr/share/nginx/html/*

# Копируем содержимое папки views в корень раздачи (т.е. в /usr/share/nginx/html)
COPY views/ /usr/share/nginx/html/

# Копируем остальные каталоги (assets, css, js, data)
COPY assets/ /usr/share/nginx/html/assets/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY data/ /usr/share/nginx/html/data/

EXPOSE 80
