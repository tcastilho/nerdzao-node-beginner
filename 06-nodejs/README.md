docker run \
  --name postgres \
  -e POSTGRES_USER=thiagocastilho \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=HEROES \
  -p 5432:5432 \
  -d \
  postgres

docker ps

docker exec -it postgres /bin/bash

docker run \
  --name adminer \
  -p 8080:8080 \
  --link postgres:postgres \
  -d \
  adminer

docker run \
  --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin \
  -p 27017:27017 \
  -d \
  mongo:4

docker run \
  --name mongoclient \
  -p 3000:3000 \
  --link mongodb:mongodb \
  -d \
  mongoclient/mongoclient

docker exec -it mongodb \
  mongo --host localhost -u admin -p senhaadmin --authenticationDatabase admin \
  --eval "db.getSiblingDB('herois').createUser({user: 'thiagocastilho', pwd: 'admin', roles: [{role: 'readWrite', db: 'herois'}]})"