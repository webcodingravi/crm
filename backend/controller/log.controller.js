import logModel from "../model/log.model.js"

export const createLog=async (req, res) => {
    try {
        await logModel.create(req.body)
        res.json({ success: true, message: "Log Successfully Created" })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message })
    }
}

export const fetchLogs=async (req, res) => {
    try {
        const logs=await logModel.find()
        res.json(logs)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message })
    }
}

export const fetchLogById=async (req, res) => {
    try {
        const log=await logModel.findById(req.params.id)
        if (!log) {
            return res.status(404).json({ success: false, message: "log not found" })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message })
    }
}

export const updateLog=async (req, res) => {
    try {
        const log=await logModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!log) {
            return res.status(404).json({ success: false, message: "log not found" })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message })
    }
}

export const deleteLog=async (req, res) => {
    try {
        const log=await logModel.findByIdAndDelete(req.params.id)
        if (!log) {
            return res.status(404).json({ success: false, message: "log not found" })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message })
    }
}