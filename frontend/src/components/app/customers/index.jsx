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
import Create from './Create'
import Edit from './Edit'


axios.defaults.baseURL=apiUrl;

const Customers=() => {
    const [importModel, setImportModal]=useState(false)
    const [open, setOpen]=useState(false)
    const [editOpen, setEditOpen]=useState(false)
    const [page, setPage]=useState(1)
    const [limit, setLimit]=useState(10)
    const [editData, setEditData]=useState({})
    const [query, setQuery]=useState('');

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
                        editCustomer(item._id);
                        setEditOpen(true);
                    }} icon={<EditOutlined />} className='!text-violet-600 !border-violet-600 !border-2' />
                    <Button onClick={() => deleteCustomer(item._id)} icon={<DeleteOutlined />} className='!text-rose-600 !border-rose-600 !border-2' />
                </div>
            )
        }

    ]

    const editCustomer=async (id) => {
        try {
            const { data }=await axios.get(`/customer/${id}`)
            if (data.success==false) {
                toast.message(data.message)
            }
            setEditData(data)
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
            <Create open={open} setOpen={setOpen} page={page} limit={limit} query={query} importModel={importModel} setImportModal={setImportModal} />



            {/* Edit coustomer model */}
            <Edit editOpen={editOpen} setEditOpen={setEditOpen} page={page} limit={limit} query={query} editData={editData} />
        </>
    )
}

export default Customers