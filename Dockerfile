FROM node:11

COPY . .

RUN yarn

RUN yarn docs:build

FROM nginx

EXPOSE 8080

COPY docs/.vuepress/dist /usr/share/nginx/html