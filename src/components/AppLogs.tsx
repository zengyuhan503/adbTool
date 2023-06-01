/* eslint-disable indent */
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Drawer } from 'antd';
import '@/assets/styles/components/app-logs.less';
export default forwardRef((props: any, ref: any) => {
	const [visible, setVisible] = useState(false);
	let [logs, setLogs] = useState([
		{
			name: "关机",
			adb: "例 adb shell reboot -p",
			time: "2021-10-11 12:10:10",
			stdout: "",
			stderr: "例 adb.exe: no devices/emulators found",
			status: 1,
		},
		{
			name: "关机",
			adb: "例 adb shell reboot -p",
			time: "2021-10-11 12:10:10",
			stdout: "例 设备已经关机",
			stderr: "例 adb.exe: no devices/emulators found",
			status: -1,
		}
	])
	//隐藏弹窗
	const hideDrawer = () => {
		setVisible(false);
	};

	const pushLogs = (obj?: { name: string, adb: string; time: string; stdout: string; status: number; stderr: string; }) => {
		// obj && logs.unshift(obj);
		obj && setLogs([obj, ...logs])
	}
	//监听props.openModel值的变化
	//打开弹窗
	useImperativeHandle(ref, () => ({
		openDrawer: (obj?: { name: string, adb: string; time: string; stdout: string; stderr: string; status: number }) => {
			obj && pushLogs(obj);
			setVisible(true);
		}
	}));

	return (
		<>
			<Drawer title="操作记录" placement="bottom" className='logs-drawer' mask={false} onClose={hideDrawer} open={visible}>
				<div className='logs-items'>
					{
						logs.map((item, index) => {
							let logsBody;
							if (item.status === 1) {
								logsBody = (
									<div className='logs-body'>
										<p>
											结果：<span className='logs-pass'>成功</span>
										</p>
										<p>
											信息：<span className='logs-pass'>{item.stdout}</span>
										</p>
									</div>
								)
							} else {
								logsBody = (<div className='logs-body'>
									<p>
										结果：<span className='logs-err'>失败</span>
									</p>
									<p>
										原因：<span className='logs-err'>{item.stderr}</span>
									</p>
								</div>)
							}
							return (
								<div className='logs_item' key={index}>
									<p className='logs_title'>
										<span>操作：{item.name}</span>
										<span>命令：{item.adb}</span>
										<span>时间：{item.time}</span>
									</p>
									{logsBody}
								</div>
							)
						})
					}
				</div>

			</Drawer>
		</>
	);
});
