FROM keymetrics/pm2:18-alpine

EXPOSE 8000

WORKDIR /app

# Bundle APP files
COPY . .
COPY package.json .
COPY pm2.json .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install

# Show current folder structure in logs
RUN ls -al -R

CMD [ "pm2-runtime", "start", "pm2.json" ]