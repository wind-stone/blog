import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("DEEPSEEK_API_KEY")
BASE_URL = "https://api.deepseek.com"


def call_ai(messages: list) -> str:
    res = requests.post(
        f"{BASE_URL}/chat/completions",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}",
        },
        json={
            "model": "deepseek-chat",
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 2000,
        },
    )
    res.raise_for_status()
    return res.json()["choices"][0]["message"]["content"]


def main():
    print("AI 聊天机器人（输入 exit 退出）")
    messages = [{"role": "system", "content": "你是一个有帮助的 AI 助手。"}]

    while True:
        user_input = input("\n你: ").strip()
        if not user_input or user_input == "exit":
            print("再见！")
            break

        messages.append({"role": "user", "content": user_input})

        try:
            reply = call_ai(messages)
            print(f"\nAI: {reply}")
            messages.append({"role": "assistant", "content": reply})
        except requests.RequestException as err:
            print(f"\n错误: {err}")


if __name__ == "__main__":
    main()
