import { useState, useEffect } from 'react';
import { Form, Button, Card, Table, Switch, message, Space, Avatar } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { sendDataType, typeOneType } from './services/types';
import { updateTypeOneShow, typeOneList } from './services/types';
import EditUserForm from './components/EditUserForm';
import AddUserForm from './components/AddUserForm';
import styles from './index.less';

const userManage: React.FC = () => {
  const [form] = Form.useForm();
  const [sendData, setSendData] = useState<sendDataType>({
    pageSize: 10,
    pageNum: 1,
    total: 10
  });
  const [dataSource, setDataSource] = useState<typeOneType[]>([]); // 用户列表
  const [editModalVisible, editIsModalVisible] = useState<boolean>(false); // 编辑弹窗判断
  const [addModalVisible, addIsModalVisible] = useState<boolean>(false); // 编辑弹窗判断
  const [roleImgCurrentData, setRoleImgCurrentData] = useState<typeOneType>(); // 轮播信息
  const columns = [
    {
      title: '一级分类名',
      dataIndex: 'typeName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '分类隐藏/显示',
      dataIndex: 'show',
      render: (text: boolean, record: typeOneType) => {
        return (
          <div>
            <Switch
              key={text}
              checkedChildren="开启"
              unCheckedChildren="关闭"
              defaultChecked={text}
              onChange={(check) => {
                changeState(check, record);
              }}
            />
          </div>
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
      render: (text: any, record: typeOneType) => {
        return (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setRoleImgCurrentData(record);
                editIsModalVisible(true);
              }}
            >
              编辑
            </Button>
          </Space>
        );
      },
    },
  ];
  useEffect(() => {
    getList();
  }, [sendData.pageNum]);
  const changeState = async (check: boolean, record: typeOneType) => {
    const { code } = await updateTypeOneShow({ id: record.id, show: check });
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
  // 获取分类列表
  const getList = () => {
    typeOneList(sendData).then((res) => {
      console.log('aaa')
      setDataSource([...res.data.data.list]);
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
          roleImgCurrentData={roleImgCurrentData}
        />
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
              新增一级分类
            </Button>
          </div>
        </Form>
      </Card>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(record) => record.id}
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
