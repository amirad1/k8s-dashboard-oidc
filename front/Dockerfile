FROM nginx:latest

RUN rm -rf /etc/nginx/nginx.conf

COPY conf/nginx.conf /etc/nginx/

RUN mkdir /site

COPY site/. /site

