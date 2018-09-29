FROM node:10

WORKDIR /usr/local/www/

COPY . .
# RUN npm install yarn@latest

# yarn 1.9.4 have bug for yarn install
# RUN ./node_modules/.bin/yarn

COPY . .

EXPOSE ${app_port}

# RUN yarn doc:dev

CMD [ "yarn", "doc:dev" ]
