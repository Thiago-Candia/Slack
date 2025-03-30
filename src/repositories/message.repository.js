import Message from "../models/Message.model.js"
import { ServerError } from "../utils/errors.util.js"
import channelRepository from "./channel.repository.js"

class MessageRepository{
    async createMessage(
        {
            sender_id, 
            channel_id, 
            content
        }
    ){
        const channel_found = await channelRepository.findChannelById(channel_id)
        if(!channel_found){
            throw new ServerError('Canal no encontrado', 404)
        }

        if(!channel_found.workspace.members.includes(sender_id)){
            throw new ServerError('No eres miembro de este workspace', 403)
        }
        const new_message = await Message.create(
            {
                sender: sender_id,
                channel: channel_id,
                content
            }
        )
        const populatedMessage = await new_message.populate('sender', 'email username')

        return populatedMessage
    }

    async findMessagesFromChannel ({channel_id, user_id}){
        const channel_found = await channelRepository.findChannelById(channel_id)
        console.log(channel_found)
        if(!channel_found){
            throw new ServerError('Canal no encontrado', 404)
        }
        if(!channel_found.workspace.members.includes(user_id)){
            throw new ServerError('No eres miembro de este workspace', 403)
        }
        const messages_list = await Message.find({channel: channel_id}).populate('sender', 'email username')
        return messages_list
    }
}

export default new MessageRepository()