FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf
CMD /bin/bash -c "envsubst '\$PORT \$BACKEND_V1_HOSTNAME \$BACKEND_V2_HOSTNAME' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'

