import Channel from "../models/Channel.model.js"
import Workspace from "../models/Workspace.model.js"
import channelRepository from "../repositories/channel.repository.js"
import messageRepository from "../repositories/message.repository.js"

export const createChannelController = async (req, res) => {
    try{
        const { name } = req.body
        const user_id = req.user._id
        const { workspace_id } =  req.params
        const new_channel = await channelRepository.createChannel(
            {
                name,
                workspace_id,
                user_id
            }
        )
        res.json({
            ok: true,
            status: 201,
            message: 'Canal creado con exito',
            payload: {
                new_channel
            }
        })
    }
    catch(error){
        console.log('Error al crear canal: ', error)
        if(error.status){
            return res.send({
                ok: false,
                message: error.message,
                status: error.status
            })
        }
        return res.send({
            ok: false,
            message: 'Interal server error',
            status: 500
        })
    }
}

export const sendMessageToChannelController = async (req, res) => {
    try {
        const { channel_id } = req.params
        const user_id = req.user._id
        const { content } = req.body

        const new_message = await messageRepository.createMessage(
            {
                sender_id: user_id,
                channel_id,
                content
            }
        )
        res.json({
            ok: true,
            message: 'Mensaje enviado con exito',
            status: 201,
            payload: {
                new_message
            }
        })
    }
    catch(error){
        console.log('Error al enviar mensaje al canal: ', error)
        if(error.status){
            return res.send({
                ok: false,
                message: error.message,
                status: error.status
            })
        }
        return res.send({
            ok: false,
            message: 'Interal server error',
            status: 500
        })
    }
}


export const getMessagesListFromChannelController = async (req, res) => {
    try {
        const user_id = req.user._id
        const { channel_id } = req.params
        const messages = await messageRepository.findMessagesFromChannel({channel_id, user_id})
        res.json({
            ok: true,
            message: 'Mensajes obtenidos con exito',
            status: 200,
            payload: {
                messages
            }
        })
    }
    catch(error){
        console.log('Error al obtener la lista de mensajes del canal: ', error)
        if(error.status){
            return res.send({
                ok: false,
                message: error.message,
                status: error.status
            })
        }
        return res.send({
            ok: false,
            message: 'Interal server error',
            status: 500
        })
    }
}

export const getChannelsController = async (req, res) => {
    try {
        const { workspace_id } = req.params
        const channels = await Channel.find({workspace: workspace_id})
        res.json({
            ok: true,
            message: 'Canales obtenidos con exito',
            status: 200,
            payload: {
                channels
            }
        })
    } catch (error) {
        console.log("❌ Error al obtener la lista de canales:", error);
        res.status(500).json({
            ok: false,
            message: 'Internal server error',
            status: 500
        })
    }
}