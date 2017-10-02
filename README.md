# game-of-war
Program your own soldier and start a war!

# How to run it locally
1. npm run-script build:worker
2. npm run build
3. npm start

# How to run it in Docker
docker run \
-d \
-p 80:4200 \
--net=host \
--restart=always \
--name game-of-war \
guojing/game-of-war:latest