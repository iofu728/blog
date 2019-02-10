FROM node:11
#FROM nginx:latest

WORKDIR /usr/local/www/

#COPY . .
#
##RUN npm install yarn@latest
#
## yarn 1.9.4 have bug for yarn install
#RUN yarn
#
#EXPOSE 8080
#
## RUN yarn doc:dev
#
#CMD [ "yarn", "doc:dev" ]
