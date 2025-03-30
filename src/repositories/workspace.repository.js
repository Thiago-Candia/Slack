import mongoose from "mongoose";
import Workspace, { WORKSPACE_PROPS } from "../models/Workspace.model.js";
import { ServerError } from "../utils/errors.util.js";



class WorkspaceRepository {
    async createWorkspace(
        {
            [WORKSPACE_PROPS.NAME]: name, 
            [WORKSPACE_PROPS.OWNER]: owner_id,
            [WORKSPACE_PROPS.MEMBERS]: members
        }
    ){
        const workspace = await Workspace.create(
            {
                name,
                owner: owner_id,
                members: [owner_id]
            }
        )
        return workspace
    }

    async findWorkspaceById(id){
        return await Workspace.findById(id)
    }

    async addNewMember({workspace_id, owner_id, invited_id}){
        const workspace_found = await this.findWorkspaceById(workspace_id) 

        if(!workspace_found){
            throw new ServerError('Workspace no encontrado', 404)
        }
        //sea el owner
        if(!workspace_found.owner.equals(owner_id)){
            throw new ServerError('No eres owner de este workspace', 403)
        }
        if(workspace_found.members.includes(invited_id)){
            throw new ServerError('Ya eres miembro de este workspace', 400)
        }


        workspace_found.members.push(invited_id)
        await workspace_found.save()
        return workspace_found
    }

    async findWorkspacesByUser(user_id) {
        return await Workspace.find({members: user_id }).populate('members', 'email username')
    }
}


export default new WorkspaceRepository()