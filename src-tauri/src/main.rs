#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use crate::utils::set_window_shadow;
mod utils;
use std::process::Command;

#[tauri::command]
async fn execute_command(command: String) -> Result<String, String> {
    println!("{}", command);
    let output = Command::new("adb")
        .arg("shell")
        .arg(&command)
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;
    let stdout = String::from_utf8(output.stdout).map_err(|e: std::string::FromUtf8Error| {
        format!("Invalid UTF-8 sequence in output: {}", e)
    })?;

    let stderr = String::from_utf8(output.stderr).map_err(|e: std::string::FromUtf8Error| {
        format!("Invalid UTF-8 sequence in output: {}", e)
    })?;
    let result_str = stdout + "&" + &stderr;
    println!("{}", result_str);
    println!("{}", stderr);
    Ok(result_str)
}

#[tauri::command]
async fn execute_command2(command: String) -> Result<String, String> {
    println!("{}", command);
    let output = Command::new("adb")
        .arg("install")
        .arg(&command)
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;
    let stdout = String::from_utf8(output.stdout).map_err(|e: std::string::FromUtf8Error| {
        format!("Invalid UTF-8 sequence in output: {}", e)
    })?;

    let stderr = String::from_utf8(output.stderr).map_err(|e: std::string::FromUtf8Error| {
        format!("Invalid UTF-8 sequence in output: {}", e)
    })?;
    let result_str = stdout + "&" + &stderr;
    println!("{}", result_str);
    println!("{}", stderr);
    Ok(result_str)
}

#[tauri::command]
async fn execute_command3(command: String) -> Result<String, String> {
    println!("{}", command);
    let output = Command::new("adb")
        .arg("wait-for-device")
        .arg(&command)
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;
    let stdout = String::from_utf8(output.stdout).map_err(|e: std::string::FromUtf8Error| {
        format!("Invalid UTF-8 sequence in output: {}", e)
    })?;

    let stderr = String::from_utf8(output.stderr).map_err(|e: std::string::FromUtf8Error| {
        format!("Invalid UTF-8 sequence in output: {}", e)
    })?;
    let result_str = stdout + "&" + &stderr;
    println!("{}", result_str);
    println!("{}", stderr);
    Ok(result_str)
}
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            set_window_shadow(app);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            execute_command,
            execute_command2,
            execute_command3
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
