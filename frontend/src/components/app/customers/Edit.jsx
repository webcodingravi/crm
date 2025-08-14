import { mutate } from 'swr'
import apiUrl from '../../../lib/useHttp';
import axios from 'axios'
import { Button, Divider, Form, Input, Modal } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import PhoneInput from 'react-phone-input-2'
import toast from 'react-hot-toast';
import { useEffect } from 'react';


axios.defaults.baseURL=apiUrl;

const Edit=({ editOpen, setEditOpen, page, limit, query, editData }) => {
    const [form]=Form.useForm();
    useEffect(() => {
        form.setFieldsValue({
            fullname: editData.fullname,
            email: editData.email,
            mobile: editData.mobile,
        });
    }, [editData, form]);


    const updateCustomer=async (values) => {
        try {
            const { data }=await axios.put(`/customer/${editData._id}`, values)
            if (data.success==true) {
                toast.success(data.message)
                setEditOpen(false)
                mutate(`/customer?page=${page}&limit=${limit}&search=${query}`)
            } else {
                toast.error(data.message)
            }
        }

        catch (err) {
            toast.error(err.message)
        }

    }


    return (
        <Modal open={editOpen} footer={null} title="Edit Customer" onCancel={() => setEditOpen(false)} maskClosable={false} forceRender>
            <Divider />
            <Form
                form={form}
                layout='vertical' onFinish={updateCustomer}>
                <Form.Item
                    label="Customer's Name"
                    rules={[{ required: true }]}
                    name="fullname"

                >
                    <Input size='large'></Input>
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: "email" }]}>

                    <Input size='large'></Input>
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
                    <Button icon={<UserAddOutlined />} type='primary' htmlType="submit" size="large">Update Now</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default Edit