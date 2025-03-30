import mongoose from "mongoose";
import ENVIROMENT from "./enviroment.config.js";


const connectToMongoDB = async () => {
    try{
        const response = await mongoose.connect(ENVIROMENT.MONGO_DB_URL)
        console.log('conexion exitosa con MongoDB \nConectados a la base de datos:', response.connection.name)
    }

    catch(error){
        console.log('Error al conectarse a la DB', error)
    }
}


connectToMongoDB() //se debe ejecutar en el server

export default mongoose


