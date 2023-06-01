import '@/assets/styles/pages/appContent.less';
import { Divider, message } from 'antd';
import Reboot_P from '@/assets/image/reboot_p.png'
import Reboot from '@/assets/image/reboot.png'
import Sncode from '@/assets/image/sncode.png'
import Vcode from '@/assets/image/vcode.png'
import Vname from '@/assets/image/version.png'
import Iname from '@/assets/image/internal.png'
import Battery from '@/assets/image/battery.png'
import CloseWifi from '@/assets/image/closeWifi.png'
import Wifi from '@/assets/image/wifi.png'
import ClearBind from '@/assets/image/clearBind.png'
import Reset from '@/assets/image/Reset.png'
import CleaerAll from '@/assets/image/cleaerAll.png'
import Imu from '@/assets/image/imu.png'
import Bind from '@/assets/image/bind.png'
import Serverlog from '@/assets/image/serverlog.png'
import { runAdbCommand, runOtherCommand, runOtherCommand2 } from '@/utils/SendADB'
import AppLogs from '@/components/AppLogs'
import { useRef, useState, RefObject } from 'react';
import moment from 'moment';
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Spin, Modal, Input, Tooltip } from 'antd';
const { TextArea } = Input;
interface AppLogsProps {
  // 其他属性...
  openDrawer: (arg0: any) => void;
}
let stdouts: string[] = []
const HomePage = () => {
  let appLogsRef: RefObject<AppLogsProps> = useRef(null)
  const handleError = (err: string) => {
    const regex = /no devices|device '\(null\)' not found|device not found/;
    if (regex.test(err)) {
      message.error('设备不存在');
    }
  }
  const handleSendAdb = (str: string, name: string, fun: (stdout: string) => void) => {
    runAdbCommand(str).then(res => {
      const res_struct = {
        stdout: (res?.split('&')[0]?.replace(/\r\n/g, '') ?? ''),
        stderr: (res?.split('&')[1]?.replace(/\r\n/g, '') ?? ''),
      };

      if (res_struct.stderr !== '') {
        handleError(res_struct.stderr);
      }
      if (res_struct.stderr.indexOf('Warning') !== -1) {
        res_struct.stderr = ''
        res_struct.stdout = '操作成功'
      }
      fun(res_struct.stdout || "");
      if (str === 'dumpsys battery') {
        res_struct.stdout = res_struct.stdout?.match(/level: (\d+)/)?.[1] + "%" || "";
      }
      console.log( res_struct.stderr !== '' )
      let adbCommand = {
        name: name,
        adb: `adb shell ${str}`,
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        status: res_struct.stderr !== '' ? -1 : 1,
        ...res_struct
      }
      appLogsRef.current?.openDrawer(adbCommand)
    });
  };
  let [systemOptions, setSystemOptions] = useState([
    {
      name: "关机",
      icon: Reboot_P,
      loading: false,
      adb: 'reboot -p',
    },
    {
      name: "重启",
      icon: Reboot,
      loading: false,
      adb: 'reboot',
    },

    {
      name: "获取SN号",
      icon: Sncode,
      loading: false,
      adb: 'getprop ro.serialno',
    },

    {
      name: "获取版本号",
      icon: Vcode,
      loading: false,
      adb: 'getprop persist.sys.hwconfig.soft_ver',
    },
    {
      name: "获取版本名称",
      icon: Vname,
      loading: false,
      adb: 'getprop ro.build.display.id',
    },
    {
      name: "获取刷机包名",
      icon: Iname,
      loading: false,
      adb: 'getprop ro.internal.display.id',
    },
    {
      name: "获取电量",
      icon: Battery,
      loading: false,
      adb: 'dumpsys battery',
    },
    {
      name: "关闭WiFi",
      icon: CloseWifi,
      loading: false,
      adb: 'svc wifi disable',
    },
    {
      name: "打开WiFi",
      icon: Wifi,
      loading: false,
      adb: 'svc wifi enable',
    },
    {
      name: "复位",
      icon: Reset,
      loading: false,
      adb: 'dumpsys battery reset',
    },
    {
      name: "清除launcher缓存",
      icon: CleaerAll,
      loading: false,
      adb: 'pm clear com.ssnwt.newskyui',
    },
  ])
  const handleSystemActions = (_item: any, index: number) => {
    const newSystemOptions = [...systemOptions];
    newSystemOptions[index] = {
      ..._item,
      loading: true,
    };
    setSystemOptions(newSystemOptions)
    handleSendAdb(_item.adb, _item.name, () => {
      const updatedSystemOptions = [...newSystemOptions];
      updatedSystemOptions[index] = { ..._item, loading: false };
      setSystemOptions(updatedSystemOptions)
    })
  }
  let bindCount = 0
  let handleGetLeftStatus = (resolve: { (): void; (): void; }, reject: { (arg0: string): void; }) => {
    bindCount++
    if (bindCount === 50) {
      reject('绑定超时');
      bindCount = 0
      return false;
    }
    runAdbCommand('getprop ssnwt.factory.mmi.hand.lbond').then(res => {
      const res_struct = {
        stdout: (res?.split('&')[0]?.replace(/\r\n/g, '') ?? ''),
        stderr: (res?.split('&')[1]?.replace(/\r\n/g, '') ?? ''),
      };
      if (res_struct.stderr !== '') {
        handleError(res_struct.stderr);
        bindCount = 0
        reject(res_struct.stderr);
      }
      if (parseInt(res_struct.stdout) === 0) {
        setTimeout(() => {
          handleGetLeftStatus(resolve, reject)
        }, 1000);
      } else {
        resolve()
      }
    })
  }


  let handleGetRightStatus = (resolve: { (): void; (): void; }, reject: { (arg0: string): void; }) => {
    bindCount++
    if (bindCount === 50) {
      reject('绑定超时');
      bindCount = 0
      return false;
    }
    runAdbCommand('getprop ssnwt.factory.mmi.hand.rbond').then(res => {
      const res_struct = {
        stdout: (res?.split('&')[0]?.replace(/\r\n/g, '') ?? ''),
        stderr: (res?.split('&')[1]?.replace(/\r\n/g, '') ?? ''),
      };
      if (res_struct.stderr !== '') {
        handleError(res_struct.stderr);
        bindCount = 0
        reject(res_struct.stderr);
      }
      if (parseInt(res_struct.stdout) === 0) {
        setTimeout(() => {
          handleGetRightStatus(resolve, reject)
        }, 1000);
      } else {
        resolve()
      }
    })
  }
  let [lHandleOptions, setlhandleOptions] = useState([
    {
      name: "左手柄绑定",
      icon: Bind,
      loading: false,
      adb: 'ssnwtmmi hand --bind 0',
      action: (_item: any, index: number) => {
        let newHandleOptions = [...lHandleOptions];
        newHandleOptions[index] = {
          ..._item,
          loading: true,
        };
        setlhandleOptions(newHandleOptions)
        let str = _item.adb;
        runAdbCommand(str).then(res => {
          handleGetLeftStatus(() => {
            let adbCommand = {
              name: _item.name,
              adb: `adb shell ${str}`,
              time: moment().format('YYYY-MM-DD HH:mm:ss'),
              status: 1,
              stdout: '左手柄绑定成功',
              stderr: ''
            }
            appLogsRef.current?.openDrawer(adbCommand)
            let newHandleOptions = [...lHandleOptions];
            newHandleOptions[index] = {
              ..._item,
              loading: false,
            };
            setlhandleOptions(newHandleOptions)
          }, (err) => {
            let adbCommand = {
              name: _item.name,
              adb: `adb shell ${str}`,
              time: moment().format('YYYY-MM-DD HH:mm:ss'),
              stdout: '',
              status: -1,
              stderr: err
            }
            appLogsRef.current?.openDrawer(adbCommand)
            let newHandleOptions = [...lHandleOptions];
            newHandleOptions[index] = {
              ..._item,
              loading: false,
            };
            setlhandleOptions(newHandleOptions)
          })
        })
      }
    },
    {
      name: "左手柄解绑",
      icon: ClearBind,
      loading: false,
      adb: 'ssnwtmmi hand --clear 0',
      action: (_item: any, index: number) => {
        let newHandleOptions = [...lHandleOptions];
        newHandleOptions[index] = {
          ..._item,
          loading: true,
        };
        setlhandleOptions(newHandleOptions)
        let str = _item.adb
        runAdbCommand(str).then(_res => {
          const res_struct = {
            stdout: (_res?.split('&')[0]?.replace(/\r\n/g, '') ?? ''),
            stderr: (_res?.split('&')[1]?.replace(/\r\n/g, '') ?? ''),
          };

          if (res_struct.stderr !== '') {
            handleError(res_struct.stderr);
          }
          let newHandleOptions = [...lHandleOptions];
          newHandleOptions[index] = {
            ..._item,
            loading: false,
          };
          setlhandleOptions(newHandleOptions)
          let adbCommand = {
            name: _item.name,
            adb: `adb shell ${_item.adb}`,
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            stdout: res_struct.stderr === '' ? '左手柄解绑成功' : '',
            status: 1,
            stderr: res_struct.stderr
          }
          appLogsRef.current?.openDrawer(adbCommand)
        })
      }
    },

    {
      name: "左手固件号",
      icon: Vcode,
      loading: false,
      adb: 'getprop ssnwt.factory.mmi.hand.lversion',
      action: (_item: any, index: number) => {
        let newHandleOptions = [...lHandleOptions];
        newHandleOptions[index] = {
          ..._item,
          loading: true,
        };
        setlhandleOptions(newHandleOptions)
        handleSendAdb(_item.adb, _item.name, () => {
          const updateaHewHandleOptions = [...newHandleOptions];
          updateaHewHandleOptions[index] = { ..._item, loading: false };
          setlhandleOptions(updateaHewHandleOptions)
        })
      }
    },

  ])


  let [rHandleOptions, setrhandleOptions] = useState([
    {
      name: "右手柄绑定",
      icon: Bind,
      loading: false,
      adb: 'ssnwtmmi hand --bind 1',
      action: (_item: any, index: number) => {
        let newHandleOptions = [...rHandleOptions];
        newHandleOptions[index] = {
          ..._item,
          loading: true,
        };
        setrhandleOptions(newHandleOptions)
        let str = _item.adb;
        runAdbCommand(str).then(res => {
          handleGetRightStatus(() => {
            let adbCommand = {
              name: _item.name,
              adb: `adb shell ${str}`,
              time: moment().format('YYYY-MM-DD HH:mm:ss'),
              status: 1,
              stdout: '右手柄绑定成功',
              stderr: ''
            }
            appLogsRef.current?.openDrawer(adbCommand)
            let newHandleOptions = [...rHandleOptions];
            newHandleOptions[index] = {
              ..._item,
              loading: false,
            };
            setrhandleOptions(newHandleOptions)
          }, (err) => {
            let adbCommand = {
              name: _item.name,
              adb: `adb shell ${str}`,
              time: moment().format('YYYY-MM-DD HH:mm:ss'),
              stdout: '',
              status: -1,
              stderr: err
            }
            appLogsRef.current?.openDrawer(adbCommand)
            let newHandleOptions = [...rHandleOptions];
            newHandleOptions[index] = {
              ..._item,
              loading: false,
            };
            setrhandleOptions(newHandleOptions)
          })
        })
      }
    },
    {
      name: "右手柄解绑",
      icon: ClearBind,
      loading: false,
      adb: 'ssnwtmmi hand --clear 1',
      action: (_item: any, index: number) => {
        let newHandleOptions = [...rHandleOptions];
        newHandleOptions[index] = {
          ..._item,
          loading: true,
        };
        setrhandleOptions(newHandleOptions)
        let str = _item.adb
        runAdbCommand(str).then(_res => {
          const res_struct = {
            stdout: (_res?.split('&')[0]?.replace(/\r\n/g, '') ?? ''),
            stderr: (_res?.split('&')[1]?.replace(/\r\n/g, '') ?? ''),
          };

          if (res_struct.stderr !== '') {
            handleError(res_struct.stderr);
          }
          let newHandleOptions = [...rHandleOptions];
          newHandleOptions[index] = {
            ..._item,
            loading: false,
          };
          setrhandleOptions(newHandleOptions)
          let adbCommand = {
            name: _item.name,
            adb: `adb shell ${_item.adb}`,
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            stdout: res_struct.stderr === '' ? '左手柄解绑成功' : '',
            status:1,
            stderr: res_struct.stderr
          }
          appLogsRef.current?.openDrawer(adbCommand)
        })
      }
    },

    {
      name: "右手固件号",
      icon: Vcode,
      loading: false,
      adb: 'getprop ssnwt.factory.mmi.hand.rversion',
      action: (_item: any, index: number) => {
        let newHandleOptions = [...rHandleOptions];
        newHandleOptions[index] = {
          ..._item,
          loading: true,
        };
        setrhandleOptions(newHandleOptions)
        handleSendAdb(_item.adb, _item.name, () => {
          const updateaHewHandleOptions = [...newHandleOptions];
          updateaHewHandleOptions[index] = { ..._item, loading: false };
          setrhandleOptions(updateaHewHandleOptions)
        })
      }
    },

  ])

  const handleSendAdbOrther = (str: string, fun: (arg0: { stdout: string; stderr: string; }) => void) => {
    runOtherCommand2(str).then(res => {
      const res_struct = {
        stdout: (res?.split('&')[0]?.replace(/\r\n/g, '') ?? ''),
        stderr: (res?.split('&')[1]?.replace(/\r\n/g, '') ?? ''),

      };
      fun(res_struct);
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  let index = 0;
  const handleCustomADB = (adbArr: string[], resolve: { (_str: any): void; (arg0: string): void; }, reject: { (err: any): void; (arg0: string): void; }) => {
    let str = adbArr[index]
    console.log(adbArr.length)
    if (index === adbArr.length) {
      resolve(stdouts.join(';'))
      return false
    } else {
      handleSendAdbOrther(str.replace(/\s*adb\s*/, ''), (res) => {
        let { stdout, stderr } = res;
        if (stderr) {
          reject(stderr)
          return false;
        }
        stdouts.push(stdout)
        index++
        if (index === adbArr.length) {
          resolve(stdouts.join(';'))
          return false
        }
        setTimeout(() => {
          handleCustomADB(adbArr, resolve, reject)
        }, 1000);
      })
    }

  }
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleOk = () => {
    let value = customValue;
    let adbArr = value.split(';')
    index = 0;
    setConfirmLoading(true)
    handleCustomADB(adbArr, (_str: string) => {
      setConfirmLoading(false)
      setIsModalOpen(false)
      let adbCommand = {
        name: '自定义命令',
        adb: customValue,
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        stdout: "操作成功：" + _str,
        status:1,
        stderr: ""
      }
      appLogsRef.current?.openDrawer(adbCommand)
    }, (err: any) => {
      setConfirmLoading(false)
      setIsModalOpen(false)
      let adbCommand = {
        name: '自定义命令',
        adb: customValue,
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        stdout: "",
        status:-1,
        stderr: err
      }
      appLogsRef.current?.openDrawer(adbCommand)
    })
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [customValue, setCustomValue] = useState('');

  let [orterOtpions, setOrtherOptions] = useState([
    {
      name: "自定义命令",
      icon: Bind,
      loading: false,
      action: () => {
        setIsModalOpen(true);

      }
    },
  ])


  return (
    <div className='appContent'>
      <div className='pageContainer'>
        <div className='action-container'>
          <Divider orientation="left" className='action-title'>系统相关</Divider>
          <div className='action-items'>
            {
              systemOptions.map((item, index) => {
                return (
                  <div className='action-item' key={index}>
                    <Spin spinning={item.loading}>
                      <span className='action-item-image' onClick={handleSystemActions.bind(null, item, index)}>
                        <img src={item.icon} alt="" />
                        <p>{item.name}</p>
                      </span>
                    </Spin>
                  </div>
                )
              })
            }
          </div>

          <div className='action-items'>
            {
              lHandleOptions.map((item, index) => {
                return (

                  <div className='action-item' key={index}>
                    <Spin spinning={item.loading}>
                      <span className='action-item-image' onClick={item.action.bind(null, item, index)}>
                        <img src={item.icon} alt="" />
                        <p>{item.name}</p>
                      </span>
                    </Spin>
                  </div>
                )
              })
            }
          </div>

          <div className='action-items'>
            {
              rHandleOptions.map((item, index) => {
                return (

                  <div className='action-item' key={index}>
                    <Spin spinning={item.loading}>
                      <span className='action-item-image' onClick={item.action.bind(null, item, index)}>
                        <img src={item.icon} alt="" />
                        <p>{item.name}</p>
                      </span>
                    </Spin>
                  </div>
                )
              })
            }
          </div>

          <div className='action-items'>
            {
              orterOtpions.map((item, index) => {
                return (

                  <div className='action-item' key={index}>
                    <Spin spinning={item.loading}>
                      <span className='action-item-image' onClick={item.action.bind(null, item, index)}>
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
        <Modal title="自定义命令" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} confirmLoading={confirmLoading}>

          <div className='ortherOptions'>
            <span>
              <Tooltip title="自定义adb命令，多条命令需要以“;”隔开；按照步骤写入；注意 wait-for-device是不用写入的，在命令执行的时候默认添加">
                <InfoCircleOutlined style={{ color: '#FF9800' }} />
              </Tooltip></span>
            <TextArea
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              placeholder="如：adb shell root; adb shell disable-verity;adb reboot;adb root;adb remount"
              autoSize={{ minRows: 6, maxRows: 6 }}
            />
          </div>
        </Modal>
        <AppLogs ref={appLogsRef} />
      </div>
    </div >
  );
};

export default HomePage;
