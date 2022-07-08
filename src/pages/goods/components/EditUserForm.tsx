import { Modal, Select, Form, Input, message, Upload, Button } from 'antd';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { goodsType, typeOneType } from '../services/goods';
import { goodsUpdate } from '../services/goods';
import { useState, useEffect } from 'react';
interface EditUserFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  goodsCurrentData: goodsType | any;
  typeArray: typeOneType[];
}
const EditUserForm: React.FC<EditUserFormProps> = (props) => {
  const { modalVisible, onCancel, goodsCurrentData, typeArray } = props;
  const [goodsAllImage, setGoodsAllImage] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  useEffect(() => {
    setGoodsAllImage(goodsCurrentData.goodsImg)
  }, []);
  const handleOk = async () => {
    goodsCurrentData.goodsImg = JSON.stringify(goodsAllImage)
    const result = await goodsUpdate({ ...goodsCurrentData, ...form.getFieldsValue() });
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
        goodsCurrentData.firstImg = info.file.response.data
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
  return (
    <Modal title="编辑轮播图信息" visible={modalVisible} onCancel={() => onCancel()} onOk={handleOk}>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={goodsCurrentData}
      >
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
        <Form.Item label="封面图片">
          <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="http://139.224.53.188:8089/api/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {goodsCurrentData?.firstImg ? <img src={goodsCurrentData?.firstImg} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
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
        >
          <Upload
            name='file'
            action="http://139.224.53.188:8089/api/upload"
            listType="picture"
            beforeUpload={beforeUpload}
            onChange={handleUpload}
            defaultFileList={[...goodsCurrentData.goodsImg]}
          >
            <Button icon={<UploadOutlined />}>上传商品图片</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserForm;
