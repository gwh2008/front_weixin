import { Modal, Select, Form, Input, Button, message, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { RoleImgListType } from '../services/roleImg';
import { roleImgUpdate } from '../services/roleImg';
import { useState } from 'react';
interface EditUserFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  roleImgCurrentData: RoleImgListType | undefined;
}
const EditUserForm: React.FC<EditUserFormProps> = (props) => {
  const { modalVisible, onCancel, roleImgCurrentData } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const handleOk = async () => {
    const result = await roleImgUpdate({ ...roleImgCurrentData, ...form.getFieldsValue() });
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
        roleImgCurrentData.rotaUrl = info.file.response.data
        setLoading(false)
      }
    }
  };

  return (
    <Modal title="编辑轮播图信息" visible={modalVisible} onCancel={() => onCancel()} onOk={handleOk}>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={roleImgCurrentData}
      >
        <Form.Item
          label="轮播图名字"
          name="rotaName"
          rules={[{ required: true, message: '请输入轮播图名字' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="轮播顺序"
          name="rotaSort"
          rules={[{ required: false, message: '请输入rotaSort' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="创建时间">{roleImgCurrentData?.createTime}</Form.Item>
        <Form.Item label="轮播图片">
          <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="http://139.224.53.188:8089/api/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {roleImgCurrentData?.rotaUrl ? <img src={roleImgCurrentData?.rotaUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserForm;
