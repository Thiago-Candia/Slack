
import mongoose from "mongoose";

export const DIRECT_MESSAGE_PROPS = {
    RECEIVER: 'receiver',
    SENDER: 'sender',
    CONTENT: 'content',
    CREATED_AT: 'created_at',
}   

const directMessageSchema = new mongoose.Schema(
    {
        [DIRECT_MESSAGE_PROPS.RECEIVER]: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        [DIRECT_MESSAGE_PROPS.SENDER]: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        [DIRECT_MESSAGE_PROPS.CONTENT]: {
            type: String,
            required: true
        },
        [DIRECT_MESSAGE_PROPS.CREATED_AT]: {
            type: Date,
            default: Date.now
        }
    }
)

export const DirectMessage = mongoose.model('DirectMessage', directMessageSchema)
export default DirectMessage

