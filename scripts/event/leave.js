module.exports = {
  onChat: async ({ bot, msg }) => {
    if (msg.left_chat_member) {
      const leftMember = msg.left_chat_member.first_name;
      const chatName = msg.chat.title || 'this group';
      const leaveMessage = `${leftMember} has left ${chatName}.`;

      // GIF লিঙ্ক
      const gifUrl = 'https://i.postimg.cc/vBqkkzTV/goodbye.gif';

      try {
        // GIF সহ মেসেজ পাঠাও
        await bot.sendVideo(msg.chat.id, gifUrl, { caption: leaveMessage });
      } catch (error) {
        console.error('Error sending goodbye animation:', error);
        // যদি GIF পাঠানো না যায়, তাহলে শুধু টেক্সট মেসেজ পাঠাও
        await bot.sendMessage(msg.chat.id, leaveMessage);
      }
    }
  }
};
