FROM nginx
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*
COPY /build /usr/share/nginx/html

EXPOSE 3000
ENTRYPOINT ["nginx", "-g", "daemon off;"]
