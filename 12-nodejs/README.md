Heroku - Postgres

rm -rf node_modules
npm i
npm run prod

heroku login
heroku apps:list
heroku apps:create cursonode-thiago
git remote -v
heroku git:remote --app cursonode-thiago


IstanbulJS

npm i nyc
