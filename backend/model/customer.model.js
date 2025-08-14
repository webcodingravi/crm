import { Schema, model } from "mongoose";

const customerSchema=new Schema({
    fullname: {
        type: String,

    },
    email: {
        type: String,
        required: true,

    },
    mobile: {
        type: String,
        required: true,


    },
    status: {
        type: String,
        enum: ['pending', 'cold', 'colsed', 'denied'],
        default: 'pending'
    }

}, { timestamps: true })

const CustomerModel=model("Customer", customerSchema)
export default CustomerModel