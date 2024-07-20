import fetch from 'node-fetch';

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        const { userId, amount } = req.body;

        try {
            const paymentUrl = await createPayment(userId, amount);
            res.status(200).json({ ok: true, paymentUrl });
        } catch (error) {
            res.status(500).json({ ok: false, error: (error as Error).message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
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

    const data : any = await response.json();

    if (!data?.ok) {
        throw new Error(data?.description);
    }

    return `https://t.me/${process.env.BOT_USERNAME}?start=${data.result.start_parameter}`;
}
