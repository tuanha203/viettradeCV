FROM node:18.0.0
LABEL maintainer="hungnb@cs-soft.jp"
WORKDIR /app

COPY package.json .
RUN yarn install
COPY . . 
EXPOSE 3001
CMD ["yarn","run","start"]