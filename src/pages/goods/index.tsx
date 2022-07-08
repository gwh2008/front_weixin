import { useState, useEffect } from 'react';
import { Form, Button, Card, Table, Switch, message, Space, Avatar } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { sendDataType, goodsType, typeOneType } from './services/goods';
import { typeName, goodsUpdateRecommend, goodsUpdateShow, goodsList } from './services/goods';
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
  const [dataSource, setDataSource] = useState<goodsType[]>([]); // 用户列表
  const [editModalVisible, editIsModalVisible] = useState<boolean>(false); // 编辑弹窗判断
  const [addModalVisible, addIsModalVisible] = useState<boolean>(false); // 编辑弹窗判断
  const [goodsCurrentData, setGoodsCurrentData] = useState<goodsType>(); // 轮播信息
  const [typeArray, setTypeArray] = useState<typeOneType[]>([]);
  const columns = [
    {
      title: '一级分类',
      dataIndex: 'type'
    },
    {
      title: '封面图',
      dataIndex: 'firstImg',
      render: (text: string, record: goodsType) => {
        return (
          <Avatar shape="square" size={64} src={text} />
        );
      },
    },
    {
      title: '商品名',
      dataIndex: 'goodName',
    },
    {
      title: '价格',
      dataIndex: 'price',
    },
    {
      title: '商品描述',
      dataIndex: 'describe',
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
    },
    {
      title: '店家留言',
      dataIndex: 'message',
    },
    {
      title: '推荐',
      dataIndex: 'recommend',
      render: (text: boolean, record: goodsType) => {
        return (
          <Switch
            key={text}
            checkedChildren="开启"
            unCheckedChildren="关闭"
            defaultChecked={text}
            onChange={(check) => {
              changeRecommend(check, record);
            }}
          />
        );
      },
    },
    {
      title: '显示/隐藏',
      dataIndex: 'goodsShow',
      render: (text: boolean, record: goodsType) => {
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
      render: (text: any, record: goodsType) => {
        return (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setGoodsCurrentData(record);
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
  useEffect(async () => {
    const result = await typeName()
    setTypeArray(result.data)
  }, []);
  useEffect(() => {
    getList();
  }, [sendData.pageNum]);
  const changeState = async (check: boolean, record: goodsType) => {
    const { code } = await goodsUpdateShow({ id: record.id, goodsShow: check });
    if (code === 0) {
      message.success('更新成功');
    } else {
      message.error('更新失败');
    }
  };
  const changeRecommend = async (check: boolean, record: goodsType) => {
    const { code } = await goodsUpdateRecommend({ id: record.id, recommend: check });
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
    goodsList(sendData).then((res) => {
      setDataSource(res.data.data.list.map((item: goodsType) => {
        // return { ...item, goodsImg: JSON.parse(item.goodsImg) }
        return { ...item, goodsImg: item.goodsImg === "" || item.goodsImg === null ? [] : JSON.parse(item.goodsImg) }
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
          typeArray={typeArray}
          modalVisible={editModalVisible}
          goodsCurrentData={goodsCurrentData}
        />
      )}
      {/* 新增弹窗 */}
      {addModalVisible && (
        <AddUserForm
          typeArray={typeArray}
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
              新增商品
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
