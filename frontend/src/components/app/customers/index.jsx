import React, { createElement, useCallback, useState } from 'react'
import useSWR, { mutate } from "swr"
import fetcher from '../../../lib/fetcher'
import apiUrl from '../../../lib/useHttp'
import { Button, Divider, Form, Input, Modal, Pagination, Skeleton, Table } from 'antd'
import { DeleteOutlined, DownloadOutlined, EditOutlined, ImportOutlined, PlusOutlined, SearchOutlined, UploadOutlined, UserAddOutlined } from '@ant-design/icons'
import axios from 'axios'
import toast from 'react-hot-toast'
import 'react-phone-input-2/lib/material.css'
import moment from 'moment'
import lodash from 'lodash'
import PhoneInput from 'react-phone-input-2'

import * as XLS from "xlsx"


axios.defaults.baseURL=apiUrl;

const Customers=() => {
    const [importModel, setImportModal]=useState(false)
    const [open, setOpen]=useState(false)
    const [page, setPage]=useState(1)
    const [limit, setLimit]=useState(10)
    const [query, setQuery]=useState('');
    const [CurrentEditId, setCurrentEditId]=useState(null)
    const [form]=Form.useForm();

    const { data, error, isLoading }=useSWR(`/customer?page=${page}&limit=${limit}&search=${query}`, fetcher)

    const columns=[
        {
            key: 'fullname',
            title: 'Full name',
            dataIndex: 'fullname'
        },

        {
            key: 'email',
            title: 'Email',
            dataIndex: 'email'
        },

        {
            key: 'mobile',
            title: 'Mobile',
            dataIndex: 'mobile'
        },

        {
            key: 'created',
            title: 'Created',
            render: (item) => (
                <label>{moment(item.createAt).format('DD MMM YYYY, hh:mm A')}</label>
            )

        },

        {
            key: 'action',
            title: 'Actions',
            render: (item) => (
                <div className='space-x-3'>
                    <Button onClick={() => {
                        editCustomer(item);
                        setOpen(true);
                    }} icon={<EditOutlined />} className='!text-violet-600 !border-violet-600 !border-2' />
                    <Button onClick={() => deleteCustomer(item._id)} icon={<DeleteOutlined />} className='!text-rose-600 !border-rose-600 !border-2' />
                </div>
            )
        }

    ]



    const addCustomer=async (values) => {
        try {
            const { data }=await axios.post('/customer', values)
            if (data.success==true) {
                toast.success(data.message)
                form.resetFields()
                setOpen(false)
                setImportModal(false)
                mutate(`/customer?page=${page}&limit=${limit}&search=${query}`)
            } else {
                toast.error(data.message)
            }
        }
        catch (err) {
            toast.error(err.message)
        }

    }

    const editCustomer=(item) => {
        form.setFieldsValue(item)

        setCurrentEditId(item._id)
    }

    const updateCustomer=async (values) => {
        try {
            const { data }=await axios.put(`/customer/${CurrentEditId}`, values)
            if (data.success==true) {
                form.resetFields()
                toast.success(data.message)
                setOpen(false)
                setCurrentEditId(null)
                mutate(`/customer?page=${page}&limit=${limit}&search=${query}`)
            } else {
                toast.error(data.message)
            }
        }

        catch (err) {
            toast.error(err.message)
        }

    }

    const deleteCustomer=async (id) => {
        if (confirm("Are you sure you want to deleted record?")) {
            try {
                const { data }=await axios.delete(`/customer/${id}`)
                if (data.success==true) {
                    toast.success(data.message)
                    mutate(`/customer?page=${page}&limit=${limit}&search=${query}`)

                } else {
                    toast.success(data.message)
                }
            }
            catch (err) {
                toast.error(err.message)
            }
        }

    }

    const downloadSample=() => {
        const a=document.createElement("a")
        a.href="/sample.xlsx"
        a.sample="sample.xls"
        a.click()
        a.remove()
    }



    const importXlsFile=(e) => {
        const input=e.target;
        const file=input.files[0]
        const ext=file.name.split(".").pop()
        if (ext!=="xlsx"&&ext!=="xls") {
            return toast.error("Invalid file format please upload xls or xlsx format file")
        }

        const reader=new FileReader()
        reader.readAsArrayBuffer(file)

        reader.onload=(e) => {
            const tmp=[]
            const result=new Uint8Array(e.target.result)
            const excelFile=XLS.read(result, { type: "array" })
            const key=excelFile.SheetNames[0]
            const sheet=excelFile.Sheets[key]
            const data=XLS.utils.sheet_to_json(sheet)

            if (!data.length)
                return toast.error("Your file is empty.")

            for (let item of data) {
                if (item.email&&item.fullname&&item.mobile) {
                    tmp.push({
                        fullname: item.fullname,
                        email: item.email,
                        mobile: item.mobile
                    })


                }
            }

            addCustomer(tmp)


        }

    }



    const onPaginate=(pageNo, pageSize) => {
        setPage(pageNo)
        setLimit(pageSize)


    }


    const onSearch=lodash.debounce((e) => {
        const key=e.target.value.trim()
        setPage(1)
        setQuery(key)
    }, 1200)



    if (isLoading)
        return <Skeleton active />


    return (
        <>
            <div className='space-y-6'>
                <div className='flex justify-between items-center'>
                    <Input size='large' onChange={onSearch}
                        placeholder='Search Customer'
                        className='!w-[350px]'
                        prefix={<SearchOutlined className='!text-gray-300' />} />

                    <div className='space-x-5'>
                        <Button size="large" onClick={() => setImportModal(true)} icon={<ImportOutlined />}>
                            Import Customer</Button>


                        <Button size="large" type='primary' className='!bg-violet-500' icon={<PlusOutlined />} onClick={() => setOpen(true)}>
                            Add Customer</Button>
                    </div>
                </div>

                <div className='overflow-auto'>
                    <Table
                        columns={columns}
                        dataSource={data.customers}
                        rowKey="_id"
                        pagination={false}
                    />

                    <div className='flex justify-end'>
                        <Pagination
                            total={data.total}
                            onChange={onPaginate}
                            current={page}
                            pageSize={limit}
                            hideOnSinglePage

                        />
                    </div>
                </div>


            </div>

            {/* create coustomer model */}
            <Modal open={open} footer={null} title={CurrentEditId? 'Edit Customer':'Add Customer'} onCancel={() => { setOpen(false), setCurrentEditId(null), form.resetFields() }} maskClosable={false} forceRender>
                <Divider />
                <Form form={form} layout='vertical' onFinish={CurrentEditId? updateCustomer:addCustomer}>
                    <Form.Item
                        label="Customer's Name"
                        rules={[{ required: true }]}
                        name="fullname"
                    >
                        <Input size='large' placeholder='Mr. Ravi'></Input>
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: "email" }]}>

                        <Input size='large' placeholder='mail@gmail.com'></Input>
                    </Form.Item>

                    <Form.Item
                        name="mobile"
                        rules={[{ required: true }]}
                    >
                        <PhoneInput
                            country={'in'}
                            containerClass='!w-full'
                            inputClass='!w-full'
                        />
                    </Form.Item>


                    <Form.Item>
                        <Button icon={<UserAddOutlined />} type='primary' htmlType="submit" size="large">{CurrentEditId? 'Save':'Add Now'}</Button>
                    </Form.Item>
                </Form>
            </Modal>


            <Modal open={importModel} footer={null} title="Import Customers Record" onCancel={() => setImportModal(false)}>
                <Divider />
                <div className="grid grid-cols-2">
                    <div className="space-y-4">
                        <h1 className='text-xl font-semibold'>
                            Sample .XLSX File format
                        </h1>
                        <Button icon={<DownloadOutlined />} size='large' onClick={downloadSample}>Download Sample</Button>
                    </div>
                    <div className='flex justify-center'>
                        <Button className='!w-[100px] !h-[100px] flex flex-col !text-gray-500 relative'>
                            <UploadOutlined className='text-3xl' />
                            <span>Upload<br />.xls or .xlsx</span>
                            <input type="file" accept='.xls,.xlsx' className='w-full h-full absolute top-0 left-0 opacity-0' onChange={importXlsFile} />
                        </Button>
                    </div>
                </div>

            </Modal>


        </>
    )
}

export default Customers