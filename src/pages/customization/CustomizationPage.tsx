import { Button } from 'antd';
import { WebviewWindow } from '@tauri-apps/api/window';
import { appWindow } from '@tauri-apps/api/window';
import '@/assets/styles/pages/customization-page.less';

const CustomizationPage = () => {
  const createWindow = () => {
    const window = new WebviewWindow('bilibili', {
      url: 'https://www.bilibili.com/',
      title: '窗口定制',
      fullscreen: false,
      width: 800,
      height: 600,
      center: true,
      resizable: true,
      skipTaskbar: false,
      visible: false,
      decorations: true,
    });
    // window.once('tauri://created', () => {
    //   window.show();
    // });

    window.once('tauri://error', () => {
      console.error('window create failed');
    });
  };
  return (
    <div className="customization-page">
      
      <div data-tauri-drag-region className="titlebar">
        <div
          className="titlebar-button"
          id="titlebar-minimize"
          onClick={() => appWindow.minimize()}>
          <img
            src="https://api.iconify.design/mdi:window-minimize.svg"
            alt="minimize"
          />
        </div>
        <div
          className="titlebar-button"
          id="titlebar-maximize"
          onClick={() => appWindow.toggleMaximize()}>
          <img
            src="https://api.iconify.design/mdi:window-maximize.svg"
            alt="maximize"
          />
        </div>
        <div
          className="titlebar-button"
          id="titlebar-close"
          onClick={() => appWindow.hide()}>
          <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
        </div>
      </div>
      <Button onClick={createWindow}>JS API 创建窗口</Button>
    </div>
  );
};

export default CustomizationPage;
