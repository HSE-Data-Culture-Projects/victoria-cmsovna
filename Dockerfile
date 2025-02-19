FROM nginx:alpine

# Копируем наш кастомный конфиг Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# Удаляем дефолтные файлы Nginx
RUN rm -rf /usr/share/nginx/html/*

# Копируем статические файлы
COPY views/ /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY data/ /usr/share/nginx/html/data/

EXPOSE 80

# # Добавляем том, если нужно (не обязательно)
# VOLUME ["/usr/share/nginx/html"]
CMD ["nginx", "-g", "daemon off;"]