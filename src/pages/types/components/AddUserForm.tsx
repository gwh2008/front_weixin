import { Modal, Form, Input, message, Upload } from 'antd';
import { typeOneInsert } from '../services/types';
import { useState } from 'react';
interface EditUserFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}
const AddUserForm: React.FC<EditUserFormProps> = (props) => {
  const { modalVisible, onCancel } = props;
  const [form] = Form.useForm();
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不超过2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
    }
    if (info.file.status === 'done') {
      if (info.file.response.code === 0) {
        form.rotaUrl = info.file.response.data
        form.setFieldsValue({ rotaUrl: info.file.response.data })
        setLoading(false)
      }
    }
  };
  const handleOk = async () => {
    const result = await typeOneInsert({ ...form.getFieldsValue() });
    if (result.code === 0) {
      onCancel();
      message.success('新增成功');
    } else {
      message.error('新增失败');
    }
  };
  return (
    <Modal title="新增轮播图" visible={modalVisible} onCancel={() => onCancel()} onOk={handleOk}>
      <Form form={form} name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Form.Item
          label="一级分类名"
          name="typeName"
          rules={[{ required: true, message: '请输入一级分类名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="备注"
          name="remark"
          rules={[{ required: true, message: '请输入备注' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserForm;
