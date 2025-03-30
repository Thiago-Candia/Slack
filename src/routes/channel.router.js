import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createChannelController, getChannelsController, getMessagesListFromChannelController, sendMessageToChannelController } from "../controllers/channel.controller.js";


const channel_router = Router()


//Obtener canales de ese workspace
channel_router.get('/:workspace_id/channels', authMiddleware, getChannelsController)

// Crear canal
channel_router.post('/:workspace_id', authMiddleware, createChannelController)

//Controlador para enviar un mensaje
channel_router.post('/:channel_id/messages', authMiddleware, sendMessageToChannelController)

//controlador obtienee la lista de contendio de mensajes
channel_router.get('/:channel_id/messages', authMiddleware, getMessagesListFromChannelController)


export default channel_router