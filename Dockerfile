FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
# Копируем HTML-файлы в корень
COPY views/*.html /usr/share/nginx/html/
# Остальные ресурсы в поддиректории
COPY assets/ /usr/share/nginx/html/assets/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY data/ /usr/share/nginx/html/data/

EXPOSE 80