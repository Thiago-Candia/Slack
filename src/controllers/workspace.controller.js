import ENVIRONMENT from "../config/environment.config.js"
import Workspace, { WORKSPACE_PROPS } from "../models/Workspace.model.js"
import workspaceRepository from "../repositories/workspace.repository.js"
import jwt from 'jsonwebtoken'
import { ServerError } from '../utils/errors.util.js'

const MAX_WORKSPACE_IMAGE_LENGTH = 1_500_000
const BASE64_IMAGE_PATTERN = /^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+/=\s]+$/i

const getWorkspacePayload = (body) => {
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const workspace_image_base64 = body.workspace_image_base64 || null

    if (!name) {
        throw new ServerError('El nombre del espacio de trabajo es obligatorio', 400)
    }

    if (name.length > 80) {
        throw new ServerError('El nombre no puede superar los 80 caracteres', 400)
    }

    if (
        workspace_image_base64 &&
        (typeof workspace_image_base64 !== 'string' ||
            workspace_image_base64.length > MAX_WORKSPACE_IMAGE_LENGTH ||
            !BASE64_IMAGE_PATTERN.test(workspace_image_base64))
    ) {
        throw new ServerError('La imagen debe ser JPG, PNG, WEBP o GIF y pesar menos de 1 MB', 400)
    }

    return { name, workspace_image_base64 }
}

export const createWorkspaceController = async (req, res) => {
    try{
        const { name, workspace_image_base64 } = getWorkspacePayload(req.body)
        const owner_id = req.user._id
        const new_workspace = await workspaceRepository.createWorkspace(
            { 
                [WORKSPACE_PROPS.NAME]: name,
                [WORKSPACE_PROPS.OWNER]: owner_id,
                [WORKSPACE_PROPS.IMAGE_BASE64]: workspace_image_base64
            }
        ) 

        res.status(201).json({
            ok: true,
            status: 201,
            message: 'Workspace created',
            payload: {
                new_workspace
            }
        })
    }
    catch(error){
        if(error.status){
            return res.status(error.status).json({
                ok: false,
                message: error.message,
                status: error.status
            })
        }
        return res.status(500).json({
            ok: false,
            message: 'Interal server error',
            status: 500
        })
    }
}


export const inviteUserWorkspaceController = async (req, res) => {
    try{
        const user_id = req.user._id
        const { invited_id, workspace_id } = req.params 
        const workspace_found = await workspaceRepository.addNewMember(
            {
                workspace_id, 
                owner_id: user_id, 
                invited_id
            }
        )
        res.json({
            ok: true,
            status: 201,
            message: 'Nuevo miembro',
            payload: { 
                workspace_found 
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

/* USUARIO VEA LISTA DE WORKSPACES */

export const getWorkspacesController = async (req, res) => {
    try{
        const user_id = req.user._id
        const workspaces = await workspaceRepository.findWorkspacesByUser(user_id)
        res.json({
            ok: true,
            status: 200,
            payload: { 
                user: req.user, workspaces 
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

/* WORKSPACE POR ID A PARAM */


export const getWorkspaceByIdController = async (req, res) => {
    try{
        const { workspace_id } = req.params
        const workspace = await Workspace.findById(workspace_id)
        if(!workspace) {
            return res.status(404).json({ message: 'Workspace no encontrado' });
        }
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


export const inviteUserToWorkspaceController = async (req, res) => {
    try{
        const { workspace_id } = req.params
        const workspace = await Workspace.findById(workspace_id)
        if(!workspace) {
            return res.status(404).json({ message: 'Workspace no encontrado' });
        }
        //token de invitacion con vencimiento
        const inviteToken = jwt.sign({ workspace_id }, ENVIRONMENT.SECRET_KEY_JWT , { expiresIn: '7d' });
        const invite_link = `${ENVIRONMENT.URL_FRONTEND}/workspace/join/${inviteToken}`
        res.json({
            ok: true,
            status: 200,
            payload: { 
                invite_link
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

export const joinWorkspaceController = async (req, res) => {
    try{
        const { token } = req.params
        const user_id = req.user._id

        const decoded = jwt.verify(token, ENVIRONMENT.SECRET_KEY_JWT);
        const { workspace_id } = decoded

        const workspace = await Workspace.findById(workspace_id)

        if(!workspace) {
            return res.status(404).json({ message: 'Workspace no encontrado' });
        }

        if(workspace.members.includes(user_id)) {
            return res.status(400).json({ message: 'Ya eres miembro de este workspace' });
        }

        workspace.members.push(user_id)
        await workspace.save()

        res.json({
            ok: true,
            status: 200,
            message: 'Te has unido con exito',
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




