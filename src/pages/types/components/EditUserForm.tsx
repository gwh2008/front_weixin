import { Modal, Form, Input, message, Switch } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { typeOneType } from '../services/types';
import { typeOneUpdate } from '../services/types';
import { useState } from 'react';
interface EditUserFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  roleImgCurrentData: typeOneType | undefined;
}
const EditUserForm: React.FC<EditUserFormProps> = (props) => {
  const { modalVisible, onCancel, roleImgCurrentData } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const handleOk = async () => {
    const result = await typeOneUpdate({ ...roleImgCurrentData, ...form.getFieldsValue() });
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
          label="一级分类名"
          name="typeName"
          rules={[{ required: true, message: '请输入轮播图名字' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="备注"
          name="remark"
          rules={[{ required: false, message: '请输入rotaSort' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="创建时间">{roleImgCurrentData?.createTime}</Form.Item>
        <Form.Item
          label="分类显示/隐藏"
          valuePropName="show"
        >
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            defaultChecked={roleImgCurrentData?.show}
            onChange={() => { roleImgCurrentData.show = !roleImgCurrentData.show }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserForm;
