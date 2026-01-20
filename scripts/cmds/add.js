const axios = require('axios');

module.exports.config = {
  name: "add",
  version: "11.9.8",
  role: 0,
  credits: "Islamick Cyber Chat", // Nazrul
  usePrefix: true,
  description: "random love story video",
  category: "video",
  usages: "add [name] | add delete [name] | add deleteurl [url]",
  cooldowns: 30,
};

module.exports.onStart = async ({ api, event, args, message }) => {
  try {
    if (args.length === 0) {
      return message.reply("📌 ব্যবহার: add [video name] বা add delete [name] বা add deleteurl [url]");
    }

    const apis = await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json');
    const Shaon = apis.data.api;
    const uploader = apis.data.allapi;

    // 🗑️ Delete by name
    if (args[0].toLowerCase() === "delete") {
      const videoName = args.slice(1).join(" ").trim();
      if (!videoName) return message.reply("❌ দয়া করে ডিলিট করার জন্য একটি নাম দিন।");

      const delRes = await axios.get(`${Shaon}/video/random?type=delete&name=${encodeURIComponent(videoName)}`);
      return message.reply(`🗑️ ${delRes.data.message}`);
    }

    // 🗑️ Delete by URL
    if (args[0].toLowerCase() === "deleteurl") {
      const videoUrl = args.slice(1).join(" ").trim();
      if (!videoUrl) return message.reply("❌ দয়া করে ডিলিট করার জন্য একটি URL দিন।");

      const delUrlRes = await axios.get(`${Shaon}/video/random?type=delete&url=${encodeURIComponent(videoUrl)}`);
      return message.reply(`🗑️ ${delUrlRes.data.message}`);
    }

    // ➕ Add new video
    const file =
      event?.reply_to_message?.video ||
      event?.reply_to_message?.photo?.slice(-1)[0];

    if (!file || !file.file_id) return message.reply("❌ দয়া করে একটি ভিডিও বা ছবিতে রিপ্লাই করুন।");

    const fileLink = await api.getFileLink(file.file_id);
    const videoName = args.join(" ").trim();

    if (!videoName) {
      return message.reply("❌ দয়া করে ভিডিওর নাম লিখুন।");
    }

    // ভিডিও হলে সময় ধরে নাও
    const isVideo = !!event?.reply_to_message?.video;
    const duration = event?.reply_to_message?.video?.duration || 0;

    let uploadedUrl;

    if (isVideo && duration > 60) {
      // Catbox ব্যবহার করো
      const catboxUpload = await axios.get(`${uploader}/catbox?url=${encodeURIComponent(fileLink)}`);
      uploadedUrl = catboxUpload.data.url || catboxUpload.data.link;
    } else {
      // Imgur ব্যবহার করো
      const imgurRes = await axios.get(`${uploader}/imgur?url=${encodeURIComponent(fileLink)}`);
      uploadedUrl = imgurRes.data.link || imgurRes.data.uploaded?.image;
    }

    if (!uploadedUrl) {
      return message.reply("❌ মিডিয়া আপলোড ব্যর্থ হয়েছে।");
    }

    const response = await axios.get(
      `${Shaon}/video/random?name=${encodeURIComponent(videoName)}&url=${encodeURIComponent(uploadedUrl)}`
    );

    message.reply(`✅ URL ADDED SUCCESSFULLY\n📁 Name: ${response.data.name}\n🔗 URL: ${response.data.url}`);
  } catch (e) {
    console.log(e);
    message.reply(`❌ An error occurred: ${e.message}`);
  }
};
