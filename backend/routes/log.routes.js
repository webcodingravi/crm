import { Router } from "express";
import { createLog, deleteLog, fetchLogById, fetchLogs, updateLog } from "../controller/log.controller.js";

const logRouter=Router()

logRouter.post('/', createLog)
logRouter.get('/', fetchLogs)
logRouter.get('/:id', fetchLogById)
logRouter.put('/:id', updateLog)
logRouter.delete('/:id', deleteLog)

export default logRouter