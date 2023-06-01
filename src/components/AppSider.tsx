import '@/assets/styles/components/app-sider.less';
import { createFromIconfontCN } from '@ant-design/icons';
import {
  FolderOpenOutlined,
  AppstoreOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom'
const AppSider = () => {
  const navigate = useNavigate()
  const location = useLocation();
  let [pathName, setPathName] = useState('')
  useEffect(() => {
    setPathName(location.pathname)
  }, [location]);
  return (
    <div className='app-sider'>
      <div className='sider-items'>
        <div className='sider-item'>
          <span className={pathName == '/' ? "active-item" : ""} onClick={() => navigate('/')}> <AppstoreOutlined /></span>
        </div>
        <div className='sider-item'>
          <span className={pathName == '/filePage' ? "active-item" : ""} onClick={() => navigate('/filePage')}>  <FolderOpenOutlined /></span>
        </div>
        <div className='sider-item'>
          <span>  <ProfileOutlined /></span>
        </div>
      </div>
    </div>
  );
};

export default AppSider;
