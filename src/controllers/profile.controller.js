import User, { USER_PROPS } from "../models/User.model.js"
import userRepository from "../repositories/user.repository.js"
import { ServerError } from "../utils/errors.util.js"

export const getProfileController = async (req, res) => {
    try{
        const user_id = req.user._id
        const user = await User.findById(user_id).select([
            [USER_PROPS.EMAIL],
            [USER_PROPS.USERNAME],
            [USER_PROPS.CREATED_AT],
            [USER_PROPS.ACTIVE],
            [USER_PROPS.PROFILE_AVATAR_BASE64]
        ])
        if(!user){
            throw new ServerError('User not found', 404)
        }
        res.json({
            ok: true,
            status: 200,
            payload: {
                user
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

export const updateProfileController = async (req, res) => {
    try{
        const user_id = req.user._id
        const {username, profile_avatar_base64} = req.body

        const updateData = {
            ...(username && {[USER_PROPS.USERNAME]: username}),
            ...(profile_avatar_base64 && {[USER_PROPS.PROFILE_AVATAR_BASE64]: profile_avatar_base64})
        }

        const updateUser = await userRepository.updateUser(user_id, updateData)

        if(!updateUser){
            throw new ServerError('User not found', 404)
        }

        res.json({
            ok: true,
            status: 200,
            payload: {
                user: updateUser
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