const mongoose = require('mongoose');
const Joi = require('joi');


const RecordSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students",
        required: true
    },
    RID: {
        type: String,
        trim: true,
        required: true
    },
    destination: {
        type: String,
        trim: true,
        required: true
    },
    reason: {
        type: String,
        trim: true,
        required: true
    },
    from: {
        type: Date,
        trim: true,
        required: true
    },
    to: {
        type: Date,
        trim: true,
        required: true
    },
    issuedDate: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        enum: ['ACCEPTED', 'DECLINED', 'PROCESS'],
        default: 'PROCESS'
    },
    remark_by_warden: {
        type: {
            msg : String,
            id : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'admin'
            }
        },          
    },    
    approval : {
        type : {      
            // approved if hod accepts the approval request     
            approved : {
                type : Boolean,
                default : false
            },
            // tracking who approved the request
            approved_by : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'admin'
            },
            // flag for approval initiated
            sent_for_approval : {
                type : Boolean,
                default : false
            },
            // approval requested by
            sent_for_approval_by : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'admin'
            },
            // status for approval
            declined : {
                type : Boolean,
                default : false
            },
            // tracking who declined the request
            declined_by : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'admin'
            },
            // adding remark if requset gets declined
            remark : {
                type : String,
            }            
        }        
    }
}, { timestamps: true });

// VALIDATING STUDENT SCHEMA - ON LOGIN
function VALIDATE_RECORD(record) {
    const schema = Joi.object({
        RID: Joi.string().required(),
        student: Joi.required(),
        from: Joi.date().required(),
        to: Joi.date().required(),
        destination: Joi.string().required(),
        reason: Joi.string().max(200).required()
    });
    return schema.validate(record);
}


const RecordModel = new mongoose.model("records", RecordSchema)

module.exports = { RecordModel, VALIDATE_RECORD }