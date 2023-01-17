FROM nginx:1.23.3-alpine

COPY conf/nginx.conf /etc/nginx/

CMD [ "-g", "daemon off;" ]

ENTRYPOINT ["nginx", "-g", "daemon off;"]
