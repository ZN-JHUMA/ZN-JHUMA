const moment = require('moment-timezone');

module.exports = {
  onChat: async ({ bot, msg }) => {
    if (msg.new_chat_members) {
      const newMembers = msg.new_chat_members.map(member => member.first_name).join(', ');
      const chatName = msg.chat.title || 'this group';

      // সময় এবং তারিখ
      const time = moment().tz('Asia/Dhaka').format('HH:mm:ss');
      const date = moment().tz('Asia/Dhaka').format('MMMM Do YYYY');

      // Welcome Text (মেম্বার কাউন্ট ছাড়া)
      const welcomeText = 
`👋 Hello, ${newMembers} 
🎉 Welcome to ${chatName}!

🕒 Join time: ${time} (${date})
💖 Hello and have a wonderful day!`;

      // GIF লিস্ট থেকে র্যান্ডম একটা নির্বাচন
      const gifs = [
    'https://files.catbox.moe/4brdtj.mp4',
      ];
      const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

      try {
        // মেসেজ পাঠানো (GIF সহ)
        await bot.sendVideo(msg.chat.id, randomGif, { caption: welcomeText });
      } catch (error) {
        console.error('Error sending welcome video:', error);
        await bot.sendMessage(msg.chat.id, `Welcome ${newMembers} to ${chatName}!`);
      }
    }
  }
};
