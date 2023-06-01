import '@/assets/styles/pages/appContent.less';
import { Divider, message } from 'antd';
import Appimg from '@/assets/image/app.png'
import { runAdbCommand, runOtherCommand } from '@/utils/SendADB'
import AppLogs from '@/components/AppLogs'
import { useRef, useState, RefObject } from 'react';
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { open } from "@tauri-apps/api/dialog"
import { Spin } from 'antd';
import moment from 'moment';
interface AppLogsProps {
  // 其他属性...
  openDrawer: (arg0: any) => void;
}
const HomePage = () => {
  let appLogsRef: RefObject<AppLogsProps> = useRef(null)
  const handleError = (err: string) => {
    const regex = /no devices|device '\(null\)' not found|device not found/;
    if (regex.test(err)) {
      message.error('设备不存在');
    }
  }

  const handleSendAdb = (str: string, name: string, fun: (stdout: string) => void) => {
    runOtherCommand(str).then(res => {
      const res_struct = {
        stdout: (res?.split('&')[0]?.replace(/\r\n/g, '') ?? ''),
        stderr: (res?.split('&')[1]?.replace(/\r\n/g, '') ?? ''),
      };
      if (res_struct.stderr !== '') {
        handleError(res_struct.stderr);
      }
      fun(res_struct.stdout || "");
      let adbCommand = {
        name: "应用安装",
        adb: `adb ${str}`,
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        ...res_struct
      }
      appLogsRef.current?.openDrawer(adbCommand)
    });
  };
  let [systemOptions, setSystemOptions] = useState([
    {
      name: "应用安装",
      icon: Appimg,
      loading: false,
      action: async (_item: { name: string; icon: string; loading: boolean; action: (_item: any, index: any) => Promise<void>; }, index: number) => {
        const newSystemOptions = [...systemOptions];
        newSystemOptions[index] = {
          ..._item,
          loading: true,
        };
        setSystemOptions(newSystemOptions)
        let files = await open({ multiple: false }) as string
        const fileName = files.replace(/^.*[\\\/]/, '');
        const folderPath = files.substring(0, files.lastIndexOf('/'));

        handleSendAdb(files, fileName, (res) => {
          console.log(res)
          const newSystemOptions = [...systemOptions];
          newSystemOptions[index] = {
            ..._item,
            loading: false,
          };
          setSystemOptions(newSystemOptions)
        })
      }
    },
  ])

  return (
    <div className='appContent'>
      <div className='pageContainer'>
        <div className='action-container'>
          <Divider orientation="left" className='action-title'>文件相关</Divider>
          <div className='action-items'>
            {
              systemOptions.map((item, index) => {
                return (
                  <div className='action-item' key={index}>
                    <Spin spinning={item.loading}>
                      <span className='action-item-image' onClick={() => item.action(item, index)}>
                        <img src={item.icon} alt="" />
                        <p>{item.name}</p>
                      </span>
                    </Spin>
                  </div>
                )
              })
            }
          </div>
        </div>
        <AppLogs ref={appLogsRef} />
      </div>
    </div >
  );
};

export default HomePage;
