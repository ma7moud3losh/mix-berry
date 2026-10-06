// api/send-order.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // احفظ هذه القيم في متغيرات البيئة (Environment Variables) في استضافتك
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  const { customerName, phone, address, notes, mode, items, total } = req.body;

  // تنسيق الرسالة لتليجرام
// التعديل الصحيح لتنسيق عناصر الطلب
let itemsList = items.map(item => `• \({item.name} ×\){item.quantity} = ${item.price} ج.م`).join('\n');

  const textMessage = `🍓 *طلب جديد من موقع MIX BERRY*\n\n` +
    `${itemsList}\n\n` +
    `💰 *الإجمالي:* ${total} ج.م\n` +
    `🚚 *الطريقة:* ${mode}\n` +
    `👤 *الاسم:* ${customerName}\n` +
    `📞 *الهاتف:* ${phone}\n` +
    (mode === 'توصيل' ? `📍 *العنوان:* ${address}\n` : '') +
    (notes ? `📝 *ملاحظات:* ${notes}\n` : '');

  try {
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: textMessage,
        parse_mode: 'Markdown'
      })
    });

    const data = await response.json();

    if (data.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ success: false, error: data.description });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}