FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY views/ /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY data/ /usr/share/nginx/html/data/

EXPOSE 80
