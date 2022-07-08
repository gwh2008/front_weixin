import { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Card, Table, Switch, message, Space, Modal, Avatar } from 'antd';
import { UserOutlined, LockOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { sendDataType, UserListType } from './services/userManage';
import { userList, userUpdateState, userDelete } from './services/userManage';
import EditUserForm from './components/EditUserForm';
import AddUserForm from './components/AddUserForm';
import styles from './index.less';

const userManage: React.FC = () => {
  const [form] = Form.useForm();
  const [sendData, setSendData] = useState<sendDataType>({
    pageSize: 10,
    pageNum: 1,
    total: 10,
    userName: '',
    nickName: '',
  });
  const [dataSource, setDataSource] = useState<UserListType[]>([]); // 用户列表
  const [editModalVisible, editIsModalVisible] = useState<boolean>(false); // 编辑弹窗判断
  const [addModalVisible, addIsModalVisible] = useState<boolean>(false); // 编辑弹窗判断
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false); // 删除弹窗
  const [userCurrentData, setUserCurrentData] = useState<UserListType>(); // 用户信息
  const columns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      render: (text: string, record: UserListType) => {
        return (
          <Avatar size={50} src={text} />
        );
      },
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '用户状态',
      dataIndex: 'status',
      render: (text: boolean, record: UserListType) => {
        return (
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            defaultChecked={text}
            onChange={(check) => {
              changeState(check, record);
            }}
          />
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: 'address',
      render: (text: any, record: UserListType) => {
        return (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setUserCurrentData(record);
                editIsModalVisible(true);
              }}
            >
              编辑
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => {
                setUserCurrentData(record);
                setDeleteVisible(true);
              }}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];
  useEffect(() => {
    getList();
  }, [sendData.pageNum, sendData.nickName, sendData.userName]);
  // }, [sendData.pageNum, sendData.userName, sendData.nickName]);
  // 更改用户状态
  const changeState = async (check: boolean, record: UserListType) => {
    const { code } = await userUpdateState({ userId: record.userId, status: check });
    if (code === 0) {
      message.success('更新成功');
    } else {
      message.error('更新失败');
    }
  };
  // 搜索按钮
  const onFinish = async (values: any = sendData) => {
    await setSendData({ ...sendData, ...values });
  };
  // 获取用户列表
  const getList = () => {
    userList(sendData).then((res) => {
      setDataSource(res.data.data.list);
      setSendData({
        ...sendData,
        total: res.data.data.total,
      });
    });
  };
  // 改变页码
  const changePage = (pageNum: number) => {
    setSendData({
      ...sendData,
      pageNum: pageNum,
    });
  };
  // 删除用户
  const handleDeleteOk = async () => {
    const { code } = await userDelete({ userId: userCurrentData?.userId });
    if (code === 0) {
      message.success('删除成功');
      getList();
      setDeleteVisible(false);
    } else {
      message.error('删除失败');
    }
  };
  return (
    <PageContainer>
      {/* 弹窗 （修改/新增） */}
      {editModalVisible && (
        <EditUserForm
          onCancel={() => {
            editIsModalVisible(false);
            getList();
          }}
          modalVisible={editModalVisible}
          userCurrentData={userCurrentData}
        />
      )}
      {/* 弹窗删除 */}
      {deleteVisible && (
        <Modal
          title="删除用户"
          visible={deleteVisible}
          onOk={() => {
            handleDeleteOk();
          }}
          onCancel={() => setDeleteVisible(false)}
        >
          是否删除该用户名:{userCurrentData?.userName}？
        </Modal>
      )}
      {/* 新增弹窗 */}
      {addModalVisible && (
        <AddUserForm
          modalVisible={addModalVisible}
          onCancel={() => {
            addIsModalVisible(false);
            getList();
          }}
        />
      )}
      <Card>
        <Form
          form={form}
          name="search"
          layout="inline"
          onFinish={onFinish}
          initialValues={{ ...sendData }}
        >
          <Form.Item name="userName">
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="请输入用户名"
            />
          </Form.Item>
          <Form.Item name="nickName">
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="请输入用户昵称"
            />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => (
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
            )}
          </Form.Item>
          <Button type="primary" htmlType="submit" onClick={() => { getList() }}>刷新</Button>
          <div className={styles.rightAdd}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              onClick={() => {
                addIsModalVisible(true);
              }}
            >
              新增用户
            </Button>
          </div>
        </Form>
      </Card>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(record) => record.userId}
        pagination={{
          pageSize: sendData.pageSize,
          total: sendData.total,
          onChange: changePage,
        }}
      />
    </PageContainer>
  );
};

export default userManage;
