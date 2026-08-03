import mongoose from "mongoose"

export const WORKSPACE_PROPS = {
    NAME: 'name',
    IMAGE_BASE64: 'workspace_image_base64',
    OWNER: 'owner',
    MEMBERS: 'members',
    CREATED_AT: 'created_at'
}


const workspace_schema = new mongoose.Schema(
    {
        [WORKSPACE_PROPS.NAME]: {
            type: String, 
            required: true,
            trim: true,
            maxlength: 80
        },
        [WORKSPACE_PROPS.IMAGE_BASE64]: {
            type: String,
            default: null
        },
        [WORKSPACE_PROPS.OWNER]: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        },
        [WORKSPACE_PROPS.MEMBERS]: [{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }],
        [WORKSPACE_PROPS.CREATED_AT]: {
            type: Date, 
            default: Date.now
        }
    }
)

const Workspace = mongoose.model('Workspace', workspace_schema)
export default Workspace
