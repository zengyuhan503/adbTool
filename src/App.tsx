import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ConfigProvider, Layout, Menu } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { routes } from '@/router';

import AppHeader from '@/components/AppHeader'
import AppSider from '@/components/AppSider'
const { Header, Footer, Sider, Content } = Layout;
const LayoutStyle: React.CSSProperties = {
  height: "100%",
  width: '100%'
}
const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 60,
  paddingInline: 0,
  lineHeight: '60',
  backgroundColor: 'rgb(38 43 52)',
};
const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '100%',
  color: '#fff',
  paddingInline: 10,
  width: "80px",
  backgroundColor: 'rgb(38 43 52)',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '90%',
  color: '#fff',
  backgroundColor: 'rgb(38 43 52)',
};
function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={LayoutStyle}>
        <Header style={headerStyle}>
          <AppHeader />
        </Header>
        <Layout>
          <Router>
            <Sider style={siderStyle} trigger={null} collapsible collapsed={true}>
              <AppSider />
            </Sider>
            <Content style={contentStyle}>
              <Routes>
                {routes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<route.component />}
                  />
                ))}
              </Routes>
            </Content>
          </Router>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
