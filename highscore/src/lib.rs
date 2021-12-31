use rand::distributions::Alphanumeric;
use rand::{thread_rng, Rng};
use std::collections::HashMap;

use reqwest;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Debug, Serialize, Deserialize)]
pub struct JsonRes {
    pub status: bool,
    pub message: String,
}

#[wasm_bindgen]
pub async fn send_score(url: String, game_name: String, score: u32) -> Result<JsValue, JsValue> {
    let max_len = 75;
    let score_string = score.to_string();
    let extra_len = max_len - url.chars().count() - score_string.chars().count();
    let data = if extra_len > 0 {
        let left = extra_len / 2;
        base64::encode(
            format!(
                "{}${}${}${}",
                thread_rng()
                    .sample_iter(&Alphanumeric)
                    .take(left)
                    .map(char::from)
                    .collect::<String>(),
                game_name,
                score_string,
                thread_rng()
                    .sample_iter(&Alphanumeric)
                    .take(extra_len - left)
                    .map(char::from)
                    .collect::<String>()
            )
            .as_bytes(),
        )
    } else {
        base64::encode(format!("a${}${}$a", game_name, score_string,).as_bytes())
    };
    let mut map = HashMap::new();
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
