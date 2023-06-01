use std::process::Output;
use std::string::String;

pub struct Adb;

impl Adb {
    pub fn execute(&self, command: &str) -> Result<Output, std::io::Error> {
        let output = std::process::Command::new("adb")
            .arg("shell")
            .arg(command)
            .output()?;

        Ok(output)
    }
}

impl Default for Adb {
    fn default() -> Self {
        Adb
    }
}
