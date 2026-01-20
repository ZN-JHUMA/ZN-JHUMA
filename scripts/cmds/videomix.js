const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "xvideo",
    aliases: ["sex3", "randomxvideos"],
    description: "Download and send video from Noobs API (Drive link)",
    usage: "/xvideo",
    cooldown: 5,
    author: "Shaon Ahmed + ChatGPT",
    role: 1, // Only bot admins
  },

  onStart: async function ({ message }) {
    try {
      const response = await axios.get("https://noobs-api-sable.vercel.app/video/sex3");
      const data = response.data;

      const videoUrl = data.data;
      const title = data.shaon || "Drive Video";
      const filePath = path.join(__dirname, "caches", `xvideo_${Date.now()}.mp4`);

      if (!videoUrl.startsWith("https://drive.google.com")) {
        return message.reply("❌ ভিডিও লিংক সঠিক নয়।");
      }

      // Google Drive থেকে সরাসরি ডাউনলোড লিংকে কনভার্ট
      const directUrl = videoUrl.replace("https://drive.google.com/uc?id=", "https://drive.google.com/uc?export=download&id=");

      const videoStream = (await axios({
        url: directUrl,
        method: "GET",
        responseType: "stream",
        headers: { "User-Agent": "Mozilla/5.0" }
      })).data;

      const writer = fs.createWriteStream(filePath);
      videoStream.pipe(writer);

      writer.on("finish", async () => {
        await message.stream({
          url: fs.createReadStream(filePath),
          caption: `🔞 *${title}*\n\n📥 Source: Noobs API`,
        });

        setTimeout(() => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }, 10000);
      });

      writer.on("error", (err) => {
        console.error("❌ ভিডিও সেভ করতে ব্যর্থ:", err);
        return message.reply("❌ ভিডিও ডাউনলোড করতে সমস্যা হয়েছে।");
      });

    } catch (err) {
      console.error("❌ API error:", err.message);
      return message.reply("❌ ভিডিও আনতে সমস্যা হয়েছে।");
    }
  }
};
