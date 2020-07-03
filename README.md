# [Heroku App](https://eva-cursos-netz.herokuapp.com/)
# Cuentas
* `admin@uc.cl`: `pass`
* `student@uc.cl`: `pass`
* `professor@uc.cl`: `pass`

# Aplicación
## Requisitos:
* PostgreSQL
* Node.js versión>=v12.16
* Yarn

## Configuración
* Clonar el repositorio
* Instalar las dependencias con `yarn install`
* Instalar postgresql y craer una base de datos
* Agregar los datos de las base de datos a `src/config/database.js`
* Correr las migraciones con `./node_modules/.bin/sequelize db:migrate`
* Correr las seeds con `./node_modules/.bin/sequelize db:seed:all`

## Ejecutar la App
* Para ejecutar de forma normal usar el comando `yarn start`
* Para ejecutar en modo dev usar el comando `yarn dev`
* Abrir `http://localhost:3000` en el navegador
