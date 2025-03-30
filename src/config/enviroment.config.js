
import doteenv from "dotenv";


doteenv.config() //Metodo que activa metodo config. Este metodo busca el archivo .env en la raiz del proyecto y carga una variable global llamada process. Carga las variables de entorno en process.env

//Process tiene informacion de entorno del sistema, informacion de la aplicacion, computadora, sistema operativo..
process.env // objeto con todas las variables de entorno configurada en pc, sumado a variables de entorno en .env 

const ENVIROMENT = {
    PORT: process.env.PORT,
    MONGO_DB_URL: process.env.MONGO_DB_URL,
    SECRET_KEY_JWT: process.env.SECRET_KEY_JWT,
    GMAIL_USERNAME: process.env.GMAIL_USERNAME,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    URL_BACKEND: process.env.URL_BACKEND || 'http://localhost:3000',
    URL_FRONTEND: process.env.URL_FRONTEND || 'http://localhost:5173'
}



//NO NECESARIO. For que verifique que todas las variables de entorno esten configuradas
for(let key in ENVIROMENT){
    if(ENVIROMENT[key] === undefined){
        console.log('La variable de entorno ' + key + ' no esta configurada')
    }
}

export default ENVIROMENT
