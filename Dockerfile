FROM node:carbon

# Create app directory
WORKDIR /home/enqueuer

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY tsconfig.json ./tsconfig.json
COPY src ./src
COPY scripts ./scripts
COPY schemas ./schemas
COPY conf/enqueuerExample.yml /home/enqueuer/enqueuer.yml

RUN npm install typescript -g
RUN npm install
RUN ./scripts/generate-injectables-list.sh src/injectable-files-list.ts src
RUN tsc
RUN npm link
#EXPOSE 8080

CMD [ "enqueuer" ]
