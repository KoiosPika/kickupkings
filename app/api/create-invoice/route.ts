import { Bot } from 'grammy';
import { NextRequest, NextResponse } from 'next/server';

const botToken = process.env.TELEGRAM_BOT_TOKEN;

if (!botToken) {
  throw new Error('TELEGRAM_BOT_TOKEN is not defined');
}

const bot = new Bot(botToken);

export async function POST(request: NextRequest) {
  const { diamonds, amount } = await request.json();

  try {
    // Here you would typically look up the chat_id associated with the user's session or ID
    const chatId = 'CHAT_ID'; // Replace with actual logic to get the user's chat ID

    await bot.api.sendInvoice(
      chatId,
      'Purchase Diamonds', // Title
      `Purchase ${diamonds} diamonds`, // Description
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