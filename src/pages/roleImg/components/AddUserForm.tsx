import { Modal, Select, Form, Input, Button, message, Upload } from 'antd';
import { roleImgInsert } from '../services/roleImg';
import { useState } from 'react';
interface EditUserFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}
const AddUserForm: React.FC<EditUserFormProps> = (props) => {
  const { modalVisible, onCancel } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const uploadButton = (
    <div>
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
        form.rotaUrl = info.file.response.data
        form.setFieldsValue({ rotaUrl: info.file.response.data })
        setLoading(false)
      }
    }
  };
  const handleOk = async () => {
    const result = await roleImgInsert({ ...form.getFieldsValue() });
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
          label="轮播图名字"
          name="rotaName"
          rules={[{ required: true, message: '请输入轮播图名字' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="轮播图顺序"
          name="rotaSort"
          rules={[{ required: true, message: '请输入轮播图顺序' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="轮播图片" valuePropName="rotaUrl" name="rotaUrl">
          <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="http://139.224.53.188:8089/api/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {form.rotaUrl ? <img src={form?.rotaUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserForm;
