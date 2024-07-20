import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = 'https://kickupkings.vercel.app/';

if (!botToken) {
  throw new Error('TELEGRAM_BOT_TOKEN is not defined');
}

const bot = new TelegramBot(botToken, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const button = {
    text: "Open Mini App",
    web_app: { url: webAppUrl },
  };
  const keyboard = {
    inline_keyboard: [[button]],
  };

  bot.sendMessage(chatId, 'Click the button below to open the Mini App:', {
    reply_markup: keyboard,
  });
});

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Telegram bot is running' });
}
