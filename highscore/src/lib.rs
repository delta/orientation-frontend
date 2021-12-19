use std::collections::HashMap;

use reqwest;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Debug, Serialize, Deserialize)]
pub struct JsonRes {
    pub status: bool,
}

static BACKEND_URL: &str = "http://localhost:3001";

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
/* #[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT; */

#[wasm_bindgen]
pub async fn send_score(game_name: String, score: u32) -> Result<JsValue, JsValue> {
    let mut map = HashMap::new();
    map.insert("game", game_name);
    map.insert("score", score.to_string());
    let res = reqwest::Client::new()
        .post(format!("{}/api/addscore", BACKEND_URL))
        .header("Accept", "application/json")
        .fetch_credentials_include()
        .json(&map)
        .send()
        .await?;

    let text = res.text().await?;
    let result: JsonRes = serde_json::from_str(&text).unwrap();

    Ok(JsValue::from_serde(&result).unwrap())
}
