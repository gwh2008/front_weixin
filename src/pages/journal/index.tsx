import { useState, useEffect } from 'react';
import { Form, Button, Card, Table, Switch, message, Space, Avatar } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { sendDataType, journalType } from './services/journal';
import {  journalUpdateShow, journalList } from './services/journal';
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
  const [dataSource, setDataSource] = useState<journalType[]>([]); // 用户列表
  const [editModalVisible, editIsModalVisible] = useState<boolean>(false); // 编辑弹窗判断
  const [addModalVisible, addIsModalVisible] = useState<boolean>(false); // 编辑弹窗判断
  const [journalData, setJournalDataData] = useState<journalType>(); // 轮播信息
  const columns = [
    {
      title: '标题',
      dataIndex: 'title'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '内容',
      dataIndex: 'content',
    },
    {
      title: '显示/隐藏',
      dataIndex: 'show',
      render: (text: boolean, record: journalType) => {
        return (
          <Switch
            key={text}
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
      title: '操作',
      dataIndex: 'address',
      render: (text: any, record: journalType) => {
        return (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setJournalDataData(record);
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
  const changeState = async (check: boolean, record: journalType) => {
    const { code } = await journalUpdateShow({ id: record.id, show: check });
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
  // 获取日志列表
  const getList = () => {
    journalList(sendData).then((res) => {
      setDataSource(res.data.data.list.map((item: journalType) => {
        return { ...item, journalImg: item.journalImg === "" || item.journalImg === null ? [] : JSON.parse(item.journalImg) }
      }));
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
          journalData={journalData}
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
              新增公告
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
