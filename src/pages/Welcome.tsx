import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import styles from './Welcome.less';

const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

const Welcome: React.FC = () => {
  const intl = useIntl();

  return (
    <PageContainer>
      <Card>
        <div className={styles.fontBack}>系统制作人： QQ243436318</div>
        <div className={styles.fontBack}>关于系统任何问题可以加微信：LiN771998</div>
        <div className={styles.fontBack}>希望提供宝贵的系统的意见。</div>
        <div className={styles.fontBack}>系统采用的技术</div>
        <div className={styles.fontBack}>前端技术：React、AntdesignPro、umi、ES6、TypeScript、小程序</div>
        <div className={styles.fontBack}>后端技术：Springboot、Mybatis、Spring、Mysql</div>
        <div className={styles.fontBack}>服务器：阿里云服务器、Linux操作系统、ngnix进行部署</div>
      </Card>
    </PageContainer >
  );
};

export default Welcome;
