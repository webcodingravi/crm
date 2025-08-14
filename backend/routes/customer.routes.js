import { Router } from "express"
import { createCustomer, deleteCustomer, fetchCustomerById, fetchCustomers, updateCustomer } from "../controller/customer.controller.js";

const customerRouter=Router();

customerRouter.post('/', createCustomer)
customerRouter.get('/', fetchCustomers)
customerRouter.get('/:id', fetchCustomerById)
customerRouter.put('/:id', updateCustomer)
customerRouter.delete('/:id', deleteCustomer)


export default customerRouter