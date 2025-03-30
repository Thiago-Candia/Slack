import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { createWorkspaceController, getWorkspaceByIdController, getWorkspacesController, inviteUserToWorkspaceController, inviteUserWorkspaceController, joinWorkspaceController } from '../controllers/workspace.controller.js'


const workspace_router = express.Router()


//Crear Workspace
workspace_router.post('/', authMiddleware, createWorkspaceController)

//Obtener workspaces
workspace_router.get('/', authMiddleware, getWorkspacesController)

// api/:workspace_id/invite/:invited_id  -> dos parametros de busqueda
workspace_router.post('/:workspace_id/invite/:invited_id', authMiddleware, inviteUserWorkspaceController)

/* GENERAR LINK DE INVITACION */

workspace_router.post('/:workspace_id/generate-invite', authMiddleware, inviteUserToWorkspaceController)

workspace_router.post('/join/:token', authMiddleware, joinWorkspaceController)

//Obtener workspace especifico
workspace_router.get('/', authMiddleware, getWorkspaceByIdController)

export default workspace_router