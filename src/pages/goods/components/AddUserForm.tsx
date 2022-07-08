import { Modal, Select, Form, Input, Button, message, Upload } from 'antd';
import { goodsInsert } from '../services/goods';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
interface EditUserFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}
const AddUserForm: React.FC<EditUserFormProps> = (props) => {
  const { modalVisible, onCancel, typeArray } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [goodsAllImage, setGoodsAllImage] = useState([]);
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
        form.firstImg = info.file.response.data
        form.setFieldsValue({ firstImg: info.file.response.data })
        setLoading(false)
      }
    }
  };
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
    form.goodsImg = JSON.stringify(goodsAllImage)
    form.setFieldsValue({ goodsImg: JSON.stringify(goodsAllImage) })
    const result = await goodsInsert({ ...form.getFieldsValue() });
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
        <Form.Item label="一级分类名" name="typeId">
          <Select>
            {
              typeArray.map(item => {
                return (
                  <Select.Option key={item.id} value={item.id}>{item.typeName}</Select.Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label="商品封面图" valuePropName="firstImg" name="firstImg">
          <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="http://139.224.53.188:8089/api/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {form.firstImg ? <img src={form?.firstImg} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item
          label="商品名"
          name="goodName"
          rules={[{ required: true, message: '请输入商品名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="价格"
          name="price"
          rules={[{ required: true, message: '请输入价格' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="商品描述"
          name="describe"
          rules={[{ required: true, message: '请输入商品描述' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="供应商"
          name="supplier"
          rules={[{ required: true, message: '请输入供应商' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="店家留言"
          name="message"
          rules={[{ required: true, message: '请输入店家留言' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="商品详细图"
          name="goodsImg"
        >
          <Upload
            name='file'
            action="http://139.224.53.188:8089/api/upload"
            listType="picture"
            beforeUpload={beforeUpload}
            onChange={handleUpload}
            defaultFileList={[...goodsAllImage]}
          >
            <Button icon={<UploadOutlined />}>上传商品图片</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserForm;
