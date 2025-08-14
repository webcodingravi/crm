
import { mutate } from 'swr'
import apiUrl from '../../../lib/useHttp';
import axios from 'axios'
import { Button, Divider, Form, Input, Modal } from 'antd'
import { UserAddOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import PhoneInput from 'react-phone-input-2'
import toast from 'react-hot-toast';

import * as XLS from "xlsx"

axios.defaults.baseURL=apiUrl;

const Create=({ open, setOpen, page, limit, query, importModel, setImportModal }) => {

    const addCustomer=async (values) => {
        try {
            const { data }=await axios.post('/customer', values)
            if (data.success==true) {
                toast.success(data.message)
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


    return (
        <>
            {/* create coustomer model */}
            <Modal open={open} footer={null} title="Add Customer" onCancel={() => setOpen(false)} maskClosable={false}>
                <Divider />
                <Form layout='vertical' onFinish={addCustomer}>
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
                        <Button icon={<UserAddOutlined />} type='primary' htmlType="submit" size="large">Add Now</Button>
                    </Form.Item>
                </Form>
            </Modal>



            {/* import model */}
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

export default Create;