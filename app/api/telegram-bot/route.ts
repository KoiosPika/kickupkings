// app/api/telegram-bot/route.ts

import { Bot, InlineKeyboard } from 'grammy';
import { NextRequest, NextResponse } from 'next/server';

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = 'https://kickupkings.vercel.app/';

if (!botToken) {
  throw new Error('TELEGRAM_BOT_TOKEN is not defined');
}

const bot = new Bot(botToken);

bot.command('start', (ctx) => {
  const keyboard = new InlineKeyboard().text('Play', 'play_game');
  ctx.reply('Click the button below to play:', {
    reply_markup: keyboard,
  });
});

bot.on('callback_query:data', async (ctx) => {
  if (ctx.callbackQuery.data === 'play_game') {
    await ctx.answerCallbackQuery('Game started!');
    // Handle the game start logic
  }
});

// Handle /buy command to send an invoice
bot.command('buy', (ctx) => {
  ctx.replyWithInvoice(
    'Purchase Diamonds', // Title
    'Purchase some diamonds for your account.', // Description
    'unique-payload-id', // Payload, unique identifier for internal use
    'XTR', // Currency for Telegram Stars
    [{ label: 'Diamonds', amount: 5000 }], // Price breakdown in smallest units of XTR
    {
      provider_token: '', // Leave empty for payments in Telegram Stars
      start_parameter: 'start', // Optional start parameter for deep linking
    }
  );
});

// Handle pre-checkout queries
bot.on('pre_checkout_query', async (ctx) => {
  try {
    await ctx.answerPreCheckoutQuery(true); // Approve the pre-checkout query
  } catch (error) {
    console.error('Error during pre-checkout:', error);
  }
});

// Handle successful payments
bot.on('message:successful_payment', (ctx) => {
  const chatId = ctx.chat.id;
  const payment = ctx.message.successful_payment;
});

// Start the bot with long polling
bot.start();

// API route handler for health check or initialization
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Telegram bot is running' });
}

