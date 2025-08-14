import CustomerModel from "../model/customer.model.js"

export const createCustomer=async (req, res) => {
    try {

        await CustomerModel.create(req.body)
        res.json({ success: true, message: "New Customer Created" })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message })
    }

}

export const fetchCustomers=async (req, res) => {
    const searchQuery=req.query.search;
    try {
        const page=req.query.page||1
        const limit=req.query.limit||12
        const skip=(page-1)*limit

        const [customers, total]=await Promise.all([
            CustomerModel.find({
                $or: [
                    { fullname: { $regex: searchQuery, $options: 'i' } },
                ]
            }).skip(skip).limit(limit).sort({ createdAt: -1 }),
            CustomerModel.countDocuments()
        ])

        res.json({ customers, total })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message })
    }
}

export const fetchCustomerById=async (req, res) => {
    try {
        const customer=await CustomerModel.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer Not Found' })
        }
        res.json(customer)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message })
    }
}

export const updateCustomer=async (req, res) => {
    try {
        const customer=await CustomerModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer Not Found' })
        }
        res.json({ success: true, message: "Customer Successfully Updated" })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message })
    }

}

export const deleteCustomer=async (req, res) => {
    try {
        const customer=await CustomerModel.findByIdAndDelete(req.params.id)
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer Not Found' })
        }
        res.json({ success: true, message: 'Customer Successfully Deleted' })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message })
    }
}