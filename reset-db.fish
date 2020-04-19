#!/bin/fish

./node_modules/.bin/sequelize db:migrate:undo:all --debug
./node_modules/.bin/sequelize db:migrate --debug
./node_modules/.bin/sequelize db:seed:all --debug
