const express = require('express');
const app = express();
app.use(express.json());

const BOT_TOKEN = '8823808202:AAF3dGwYhY2ZdKRTU0x-3Rs3zONBjBHMy1Y';
const CHAT_ID = '7891894426';

async function sendMessage(chatId, text, reply_markup) {
  const body = { chat_id: chatId, text };
  if(reply_markup) body.reply_markup = reply_markup;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });
}

app.post('/webhook', async (req, res) => {
  const update = req.body;

  if(update.callback_query) {
    const data = update.callback_query.data;
    const chatId = update.callback_query.message.chat.id;
    const msgId = update.callback_query.message.message_id;
    const orderId = data.replace('done_','').replace('cancel_','');

    // Tugmalarni olib tashlash
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageReplyMarkup`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ chat_id: chatId, message_id: msgId, reply_markup: { inline_keyboard: [] } })
    });

    if(data.startsWith('done_')) {
      await sendMessage(CHAT_ID, `✅ Buyurtma #${orderId} BAJARILDI!`);
    }
    if(data.startsWith('cancel_')) {
      await sendMessage(CHAT_ID, `❌ Buyurtma #${orderId} BEKOR QILINDI!`);
    }

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ callback_query_id: update.callback_query.id, text: '✅ Bajarildi!' })
    });
  }

  res.json({ ok: true });
});

app.get('/', (req, res) => res.send('NakrutkaHub Webhook ishlayapti!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
