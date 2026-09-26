   const TelegramBot = require('node-telegram-bot-api');
   const token = process.env.TELEGRAM_BOT_TOKEN;
   const bot = new TelegramBot(token, { polling: true });

   const frontendUrl = process.env.FRONTEND_URL || 'https://helpy-frontend.vercel.app';

   bot.onText(/\/start/, (msg) => {
     const chatId = msg.chat.id;
     const firstName = msg.from.first_name || 'Друг';

     const message = `Привет, ${firstName}! 👋\n\nДобро пожаловать в **Helpy** — платформу для создания и развития сообществ.\n\nЗдесь ты можешь:\n🔹 Найти единомышленников по интересам\n🔹 Создать свое сообщество за 30 секунд\n🔹 Забронировать помещение и получить бюджет\n\nНажми кнопку ниже, чтобы начать! 👇`;

     bot.sendMessage(chatId, message, {
       reply_markup: {
         keyboard: [
           [{ text: '🚀 Открыть Helpy', web_app: { url: frontendUrl } }]
         ],
         resize_keyboard: true
       }
     });
   });

   console.log('🤖 Telegram бот Helpy запущен и слушает команды...');