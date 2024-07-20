import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(req: Request) {
  const { userId, amount } = await req.json();

  try {
    const paymentUrl = await createPayment(userId, amount);
    return NextResponse.json({ ok: true, paymentUrl });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}

async function createPayment(userId: string, amount: number) {
  const payload = `${userId}-${Date.now()}`;
  const prices = [{ label: 'Diamonds', amount: amount * 100 }]; // Telegram expects amount in smallest units

  const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendInvoice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: userId,
      title: 'Buy Diamonds',
      description: 'Exchange stars for diamonds',
      payload: payload,
      provider_token: '', // Leave provider_token empty for XTR
      start_parameter: 'get-started',
      currency: 'XTR', // Use XTR as the currency
      prices: prices,
    }),
  });

  const data: any = await response.json();

  if (!data?.ok) {
    throw new Error(data?.description);
  }

  return `https://t.me/${process.env.BOT_USERNAME}?start=${data.result.start_parameter}`;
}
