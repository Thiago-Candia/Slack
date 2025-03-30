import DirectMessage from "../models/DirectMessage.model.js";

export const sendDirectMessageController = async (req, res) => {
    try {
        const { user_id } = req.user
        const { receiver_id } = req.params
        const { content } = req.body

        if (!content) {
            return res.send({
                status: 400,
                ok: false,
                message: "El contenido del mensaje es obligatorio",
            })
        }

        const newMessage = new DirectMessage({
            sender: user_id,
            receiver: receiver_id,
            content,
        })
        await newMessage.save()

        return res.send({
            status: 201,
            ok: true,
            message: newMessage,
        })
    } 
    catch(error){
        console.log('Error al registrar:', error)
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



export const getDirectMessagesController = async (req, res) => {
    try {
        const { user_id } = req.user._id
        const { receiver_id } = req.params

        const messages = await DirectMessage.find({
            $or: [
                { sender: user_id, receiver: receiver_id },
                { sender: receiver_id, receiver: user_id },
            ],
        }).sort({ createdAt: 1 })

        return res.send({
            ok: true,
            status: 200,
            message: 'Mensajes obtenidos con exito',
            payload: {
                messages
            }
        })
    } 
    catch(error){
        console.log('Error al registrar:', error)
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


