import workspaceRepository from "./workspace.repository.js";
import Channel from "../models/Channel.model.js";
import { ServerError } from "../utils/errors.util.js";

class ChannelRepository {
    async findChannelById(channel_id) {
        return Channel.findById(channel_id).populate('workspace')
    }

    async createChannel(
        {
            name,
            workspace_id,
            user_id
        }
    ) {
        const workspace_found = await workspaceRepository.findWorkspaceById(workspace_id)
        if(!workspace_found){
            throw new ServerError('Workspace no encontrado', 404)
        }
        if(!workspace_found.members.includes(user_id)){
            throw new ServerError('No eres miembro de este workspace', 403)
        }

            const channel = await Channel.create(
                {
                    name,
                    workspace: workspace_id,
                    created_by: user_id 
                }
            )
        return channel
    }


    async findChannelByWorkspace(workspace_id) {
        return await Channel.find({ workspace: workspace_id })
    }
}

export default new ChannelRepository()