use std::borrow::Cow;
use tauri::regex::Regex;
use tauri::Manager;
use std::env;
static mut  CONFIG_PATH: &'static str = "";
#[tauri::command]

fn mt_chang(str: Cow<str>) -> String {
    let re_ch = Regex::new("\r\n").unwrap();
    let new_strr = re_ch.replace_all(&*str, "");
    new_strr.into_owned()
}
pub fn stop_all_test(app_handle: tauri::AppHandle) {
    println!("{}", "停止服务");

    let cmd_str: String;
    cmd_str = "adb shell ssnwtmmi stop".to_string();
    use std::process::Command;
    let stop_serve = Command::new("cmd")
        .arg("/c")
        .arg(cmd_str)
        .output()
        .expect("cmd exec error!");

    println!("{:?}", stop_serve);

    let output_stdout = String::from_utf8_lossy(&stop_serve.stdout);
    let output_stderr = String::from_utf8_lossy(&stop_serve.stderr);
    let stdout = mt_chang(output_stdout);
    let stderr = mt_chang(output_stderr);
    app_handle
        .emit_all("clear_all_err", stderr)
        .map_err(|e| eprintln!("Failed to emit error: {}", e))
        .ok();
}
