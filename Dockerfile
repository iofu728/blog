FROM node:10

WORKDIR /usr/local/www/

COPY . .

#RUN npm install yarn@latest

# yarn 1.9.4 have bug for yarn install
RUN yarn

EXPOSE 8848

# RUN yarn doc:dev

CMD [ "yarn", "doc:dev" ]
