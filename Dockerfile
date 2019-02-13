FROM node:11 as node

MAINTAINER gunjianpan '<iofu728@163.com>'

WORKDIR /usr/local/www/wyydsb/blog

COPY . .

RUN yarn

RUN yarn docs:build

FROM nginx

EXPOSE 80

COPY --from=node /usr/local/www/wyydsb/blog/docs/.vuepress/dist /usr/share/nginx/html