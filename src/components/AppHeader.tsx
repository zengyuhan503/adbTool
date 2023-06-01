import { Button } from 'antd';
import { appWindow } from '@tauri-apps/api/window';
import '@/assets/styles/pages/customization-page.less';
import VrIcon from '../assets/image/vr.png'
import headerIcon1 from '../assets/image/header-icon (1).png'
import headerIcon2 from '../assets/image/header-icon (2).png'
import headerIcon3 from '../assets/image/header-icon (3).png'
import headerIcon4 from '../assets/image/header-icon (4).png'
import headerIcon5 from '../assets/image/header-icon (5).png'
import headerIcon6 from '../assets/image/header-icon (6).png'
let headerInfo = {
  name: "半成品测试"
}
const AppHeader = () => {
  return (
    <div className="customization-page" data-tauri-drag-region>
      <div className='headerName' data-tauri-drag-region>
        {/* <img src={VrIcon} alt="" /> */}
        {/* {headerInfo.name} */}
        创维VR-ADB桌面端工具
      </div>
      <div className="titlebar" data-tauri-drag-region>
        {/* <div
          className="titlebar-sys-button"
          id="titlebar-minimize"
        >
          <Button>系统配置</Button>
        </div> */}
        <div
          className="titlebar-button"
          id="titlebar-minimize"
          onClick={() => appWindow.minimize()}>
          <img
            src={headerIcon4}
            alt="minimize"
          />
        </div>
        <div
          className="titlebar-button"
          id="titlebar-maximize"
          onClick={() => appWindow.toggleMaximize()}>
          <img
            src={headerIcon5}
            alt="maximize"
          />
        </div>
        <div
          className="titlebar-button"
          id="titlebar-close"
          onClick={() => appWindow.hide()}>
          <img
            src={headerIcon6}
            alt="close" />
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
