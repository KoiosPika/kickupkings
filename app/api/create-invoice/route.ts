import { Bot } from 'grammy';
import { NextRequest, NextResponse } from 'next/server';

const botToken = process.env.TELEGRAM_BOT_TOKEN;

if (!botToken) {
  throw new Error('TELEGRAM_BOT_TOKEN is not defined');
}

const bot = new Bot(botToken);

export async function POST(request: NextRequest) {
  const { diamonds, amount, chatId } = await request.json();

  try {
    // Here you would typically look up the chat_id associated with the user's session or ID

    await bot.api.sendInvoice(
      chatId,
      '💎 Purchase Diamonds', // Title
      `Get ${diamonds} diamonds to use them on the lucky spin for a chance to upgrade a position on your team, or use them to unlock new icons.`, // Description
      `unique-payload-id-${Date.now()}`, // Payload
      'XTR', // Currency
      [{ label: `${diamonds} Diamonds`, amount }], // Price breakdown
      {
        provider_token: '', // Empty for Telegram Stars
        start_parameter: 'start', // Optional start parameter
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending invoice:', error);
    return NextResponse.json({ success: false, error: 'Failed to create and send invoice' }, { status: 500 });
  }
}