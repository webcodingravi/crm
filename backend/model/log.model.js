import mongoose, { Schema, model } from "mongoose";

const logSchema=new Schema({
    customer: {
        type: mongoose.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    startsAt: {
        type: Date,
    },
    endsAt: {
        type: Date
    },
    followUp: {
        type: Date
    },
    status: {
        type: String,
        enum: ['calling', 'busy', 'waiting', 'not received', 'switched off', 'not reachable'],
        default: 'calling'
    }
}, { timestamps: true })

logSchema.pre('save', function (next) {
    this.startsAt=new Date()
    this.endsAt=new Date()
    next()
})
const logModel=model("Log", logSchema)
export default logModel