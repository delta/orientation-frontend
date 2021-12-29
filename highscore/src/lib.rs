use std::collections::HashMap;

use reqwest;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Debug, Serialize, Deserialize)]
pub struct JsonRes {
    pub status: bool,
    pub message: String
}

static SALT: &str = "+U-;/E&z9cMcf'wEO/Ro";

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
/* #[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT; */

#[wasm_bindgen]
pub async fn send_score(url: String, game_name: String, score: u32) -> Result<JsValue, JsValue> {
    let mut map = HashMap::new();
    let data = base64::encode(format!("{}${}${}", SALT, game_name, score.to_string()).as_bytes());
    // println!("{}", score);
    map.insert("data", data);
    let res = reqwest::Client::new()
        .post(url)
        .header("Accept", "application/json")
        .fetch_credentials_include()
        .json(&map)
        .send()
        .await?;

    let text = res.text().await?;
    let result: JsonRes = serde_json::from_str(&text).unwrap();

    Ok(JsValue::from_serde(&result).unwrap())
}
