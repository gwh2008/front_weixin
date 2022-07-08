import { Modal, Select, Form, Input, Button, message, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { UserListType } from '../services/userManage';
import { userUpdate } from '../services/userManage';
import { useState } from 'react';
interface EditUserFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  userCurrentData: UserListType | undefined;
}
const EditUserForm: React.FC<EditUserFormProps> = (props) => {
  const { modalVisible, onCancel, userCurrentData } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const handleOk = async () => {
    const result = await userUpdate({ ...userCurrentData, ...form.getFieldsValue() });
    if (result.code === 0) {
      onCancel();
      message.success('更新成功');
    } else {
      message.error('更新失败');
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
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
        userCurrentData.avatar = info.file.response.data
        setLoading(false)
      }
    }
  };

  return (
    <Modal title="编辑用户信息" visible={modalVisible} onCancel={() => onCancel()} onOk={handleOk}>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={userCurrentData}
      >
        <Form.Item label="用户名">{userCurrentData?.userName}</Form.Item>
        <Form.Item
          label="用户昵称"
          name="nickName"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="性别" name="sex" rules={[{ required: true, message: '请选择性别' }]}>
          <Select>
            <Select.Option value="0">男</Select.Option>
            <Select.Option value="1">女</Select.Option>
            <Select.Option value="2">未知</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="创建时间">{userCurrentData?.createTime}</Form.Item>
        <Form.Item label="头像">
          <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="http://139.224.53.188:8089/api/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {userCurrentData?.avatar ? <img src={userCurrentData?.avatar} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserForm;
