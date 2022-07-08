import { Modal, Select, Form, Input, Button, message } from 'antd';
import { userInsert } from '../services/userManage';
interface EditUserFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}
const AddUserForm: React.FC<EditUserFormProps> = (props) => {
  const { modalVisible, onCancel } = props;
  const [form] = Form.useForm();
  const handleOk = async () => {
    const result = await userInsert({ ...form.getFieldsValue() });
    if (result.code === 0) {
      onCancel();
      message.success('新增成功');
    } else {
      message.error('新增失败');
    }
  };
  return (
    <Modal title="新增用户信息" visible={modalVisible} onCancel={() => onCancel()} onOk={handleOk}>
      <Form form={form} name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Form.Item
          label="用户名(登录名)"
          name="userName"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="昵称"
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
        <Form.Item label="备注" name="remark">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserForm;
