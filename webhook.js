// NakrutkaHub - Telegram Bot Webhook
// 1. npm install express node-fetch
// 2. node webhook.js
// Render.com ga deploy qiling

const express = require('express');
const app = express();
app.use(express.json());

const BOT_TOKEN = '8823808202:AAF3dGwYhY2ZdKRTU0x-3Rs3zONBjBHMy1Y';
const CHAT_ID = '7891894426';

async function sendMessage(chatId, text) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({chat_id: chatId, text})
  });
}

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  const update = req.body;

  // Inline tugma bosilganda
  if(update.callback_query) {
    const data = update.callback_query.data;
    const chatId = update.callback_query.message.chat.id;
    const msgId = update.callback_query.message.message_id;

    if(data.startsWith('done_')) {
      const orderId = data.replace('done_', '');
      // Xabarni yangilash
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageReplyMarkup`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          chat_id: chatId,
          message_id: msgId,
          reply_markup: {inline_keyboard: []}
        })
      });
      await sendMessage(CHAT_ID, `✅ Buyurtma #${orderId} BAJARILDI!`);
    }

    if(data.startsWith('cancel_')) {
      const orderId = data.replace('cancel_', '');
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageReplyMarkup`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          chat_id: chatId,
          message_id: msgId,
          reply_markup: {inline_keyboard: []}
        })
      });
      await sendMessage(CHAT_ID, `❌ Buyurtma #${orderId} BEKOR QILINDI!`);
    }

    // Callback ga javob berish (Telegram talab qiladi)
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({callback_query_id: update.callback_query.id})
    });
  }

  res.json({ok: true});
});

app.get('/', (req, res) => res.send('NakrutkaHub Webhook ishlayapti!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook server: http://localhost:${PORT}`));
