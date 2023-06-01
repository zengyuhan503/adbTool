/* eslint-disable indent */
import { invoke } from '@tauri-apps/api/tauri';

export const runAdbCommand = async (command: string) => {
   try {
      const output: string = await invoke('execute_command', { command: command });
      return output;
   } catch (error) {
      return null;
   }
}

export const runOtherCommand = async (command: string) => {
   try {
      const output:string = await invoke('execute_command2', { command: command });
      return output;
   } catch (error) {
      return null;
   }
}

export const runOtherCommand2 = async (command: string) => {
   try {
      const output:string = await invoke('execute_command3', { command: command });
      return output;
   } catch (error) {
      return null;
   }
}