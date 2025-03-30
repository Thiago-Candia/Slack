/* Los archivos cuando los importamos ademas de traer el valor SE EJECUTAN, indirectamente estamos actuvando dotenv.config()  */
import authRouter from "./routes/auth.router.js";
import ENVIROMENT from "./config/enviroment.config.js";
import express from 'express'
import mongoose from "./config/mongoDB.config.js";
import cors from 'cors'
import { authMiddleware } from "./middlewares/authMiddleware.js";
import workspace_router from "./routes/workspace.router.js";
import channel_router from "./routes/channel.router.js";
import profile_router from "./routes/profile.router.js";
import directmessage_router from "./routes/directmessage.router.js";



console.log(ENVIROMENT.PORT)

const app = express()

app.use(cors())

app.use(
    cors({
        oirign: ENVIROMENT.URL_FRONTEND,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    })
) 

app.use(express.json(
    {
        limit: '2mb'
    }
))

app.use('/api/auth', authRouter)

app.use('/api/workspaces', workspace_router)

app.use('/api/channels', channel_router)

app.use('/api/profile', profile_router)

app.use('/api/dm', directmessage_router)


app.listen(ENVIROMENT.PORT, () => {
    console.log(`El servidor se esta ejecutando en el puerto ${ENVIROMENT.PORT}`)
})
