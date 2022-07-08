import { Modal, Form, Input, Button, message, Upload } from 'antd';
import { journalInsert } from '../services/journal';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
interface EditUserFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}
const AddUserForm: React.FC<EditUserFormProps> = (props) => {
  const { modalVisible, onCancel } = props;
  const [goodsAllImage, setGoodsAllImage] = useState([]);
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
  const handleUpload = info => {
    if (info.file.status === 'done') {
      if (info.file.response.code === 0) {
        const imgObject = { uid: info.file.uid, name: info.file.name, url: info.file.response.data }
        goodsAllImage.push(imgObject)
        setGoodsAllImage([...goodsAllImage])
      }
    }
    if (info.file.status === 'removed') {
      const newAllImage = goodsAllImage.filter(item => {
        console.log(item.uid !== info.file.uid)
        return item.uid !== info.file.uid
      })
      setGoodsAllImage([...newAllImage])
    }
  }
  const handleOk = async () => {
    form.journalImg = JSON.stringify(goodsAllImage)
    form.setFieldsValue({ journalImg: JSON.stringify(goodsAllImage) })
    const result = await journalInsert({ ...form.getFieldsValue() });
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
          label="标题"
          name="title"
          rules={[{ required: true, message: '请输入商品名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="内容"
          name="content"
          rules={[{ required: true, message: '请输入价格' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="公告详细图"
          name="journalImg"
        >
          <Upload
            name='file'
            action="http://139.224.53.188:8089/api/upload"
            listType="picture"
            beforeUpload={beforeUpload}
            onChange={handleUpload}
            defaultFileList={[...goodsAllImage]}
          >
            <Button icon={<UploadOutlined />}>上传公告详细图</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserForm;
