import { Modal, Switch, Form, Input, message, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { journalType } from '../services/journal';
import { journalUpdate, journalUpdateShow } from '../services/journal';
import { useState, useEffect } from 'react';
interface EditUserFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  journalData: journalType | any;
}
const EditUserForm: React.FC<EditUserFormProps> = (props) => {
  const { modalVisible, onCancel, journalData } = props;
  const [goodsAllImage, setGoodsAllImage] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    setGoodsAllImage(journalData.journalImg)
  }, []);
  const handleOk = async () => {
    journalData.journalImg = JSON.stringify(goodsAllImage)
    const result = await journalUpdate({ ...journalData, ...form.getFieldsValue() });
    if (result.code === 0) {
      onCancel();
      message.success('更新成功');
    } else {
      message.error('更新失败');
    }
  };
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
         console.log(imgObject)
        goodsAllImage.push(imgObject)
        setGoodsAllImage([...goodsAllImage])
      }
    }
    if (info.file.status === 'removed') {
      const newAllImage = goodsAllImage.filter(item => {
        return item.uid !== info.file.uid
      })
      setGoodsAllImage([...newAllImage])
    }
  }
  const changeState = async (check: boolean) => {
    const { code } = await journalUpdateShow({ id: journalData.id, show: check });
    if (code === 0) {
      message.success('更新成功');
    } else {
      message.error('更新失败');
    }
  };
  return (
    <Modal title="编辑轮播图信息" visible={modalVisible} onCancel={() => onCancel()} onOk={handleOk}>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={journalData}
      >
        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="创建时间"
        >
          {journalData.createTime}
        </Form.Item>
        <Form.Item
          label="内容"
          name="content"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="显示/隐藏"
          valuePropName='show'
        >
          <Switch
            key={journalData.show}
            checkedChildren="开启"
            unCheckedChildren="关闭"
            defaultChecked={journalData.show}
            onChange={(check) => {
              changeState(check);
            }}
          />
        </Form.Item>
        <Form.Item
          label="公告详细图"
        >
          <Upload
            name='file'
            action="http://139.224.53.188:8089/api/upload"
            listType="picture"
            beforeUpload={beforeUpload}
            onChange={handleUpload}
            defaultFileList={[...journalData.journalImg]}
          >
            <Button icon={<UploadOutlined />}>公告详细图</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserForm;
