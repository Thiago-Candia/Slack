import express, { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { sendDirectMessageController, getDirectMessagesController } from '../controllers/directmessage.controller.js'


const directmessage_router = Router()


directmessage_router.get('/:receiver_id', authMiddleware, getDirectMessagesController)

directmessage_router.post('/:receiver_id', authMiddleware, sendDirectMessageController)


export default directmessage_router

