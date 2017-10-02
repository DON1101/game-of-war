FROM node:latest

ENV ROOT=/service/game-of-war/

WORKDIR ${ROOT}
COPY ./src ${ROOT}/src
COPY ./helper.js ${ROOT}/helper.js
COPY ./karma.conf.js ${ROOT}/karma.conf.js
COPY ./package.json ${ROOT}/package.json
COPY ./protractor.conf.js ${ROOT}/protractor.conf.js
COPY ./tsconfig.json ${ROOT}/tsconfig.json
COPY ./tslint.json ${ROOT}/tslint.json
COPY ./webpack.config.js ${ROOT}/webpack.config.js
COPY ./webpack.worker.js ${ROOT}/webpack.worker.js

RUN npm install
RUN npm run build
RUN npm run-script build:worker
ENTRYPOINT ["npm", "start"]
EXPOSE 4200