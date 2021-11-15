FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./proxy.conf /etc/nginx/conf.d/proxy.conf
CMD /bin/bash -c "envsubst '\$PORT \$BACKEND_HOSTNAME' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'

