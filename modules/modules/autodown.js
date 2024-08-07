const axios = require("axios");
const fs = require("fs");
const isURL = (u) => /^http(|s):\/\//.test(u);
const convertHMS = (value) =>
    new Date(value * 1000).toISOString().slice(11, 19);
exports.handleEvent = async function (o) {
    try {
        const str = this.extractUrls(o.event.body);

        let send = (msg, tid_, typ = typeof tid_ == "object") =>
            new Promise((r) =>
                o.api.sendMessage(
                    msg,
                    typ ? tid_.event.threadID : tid_ || o.event.threadID,
                    (err, res) => r(res || err),
                    typ
                        ? tid_.event.messageID
                        : tid_
                          ? undefined
                          : o.event.messageID,
                ),
            );
        const head = (app) => `[  ${app} - DownLoad  ]\n`;
        if (isURL(str)) {
            const isProfile =
                /^https:\/\/(?:(www|m|mbasic|mobile|web)\.)?facebook\.com\/(?!(?:watch|photo|groups|share|stories|reel|videos|pages|story.php|permalink.php))(?:(?!profile\.php\?id=\d+\?)[^\/?]+|profile\.php\?id=\d+\?(?!id=).*|\profile\.php\?id=\d+$)\/?\??[^\/?]*$/.test(
                    str,
                );

            const isFbURL =
                /\b(?:https?:\/\/(?:www\.)?(?:facebook\.com|mbasic\.facebook\.com|m\.facebook\.com|mobile\.facebook\.com|fb\.watch|web\.facebook)[^\s]*)\b/g.test(
                    str,
                );

            const isInstagramURL =
                /(https:\/\/www\.instagram\.com\/(stories|p|reel|tv)\/[a-zA-Z0-9_\-\/?=]+)(?=\s|$)/g.test(
                    str,
                );

            const isThreadsURL =
                /https:\/\/www\.threads\.net\/[^/]+\/post\/([^/?]+)/.test(str);

            const tiktokRegex =
                /(?:https:\/\/(?:www\.)?tiktok\.com\/(?:@[\w\d.]+\/(?:video|photo)\/(\d+))|(https:\/\/(?:vt|vm)\.tiktok\.com\/[\w\d]+))/.test(
                    str,
                );

            const douyinRegex =
                /(?:https:\/\/(?:www\.)?(?:iesdouyin|douyin)\.com\/(?:share\/(?:video|photo|note)\/(\d+)|video\/(\d+))|(https:\/\/v\.douyin\.com\/[\w\d]+))/.test(
                    str,
                );

            const isPinterest =
                /(?:https?:\/\/(?:www\.)?pinterest\.com\/pin\/|https?:\/\/pin\.it\/)([^\/\?]+)/.test(
                    str,
                );

            if (isFbURL && !isProfile) {
                const url = o.event.body.match(
                    /\b(?:https?:\/\/(?:www\.)?(?:facebook\.com|mbasic\.facebook\.com|m\.facebook\.com|mobile\.facebook\.com|fb\.watch|web\.facebook)[^\s]*)\b/g,
                )[0];
                const res = (
                    await axios.get(
                        `https://niiozic.tokyo/api/facebook/media?url=${encodeURIComponent(
                            url,
                        )}`,
                    )
                ).data;
                let attachment = [];
                if (res.attachments && res.attachments.length > 0) {
                    if (res.queryStorieID) {
                        const match = res.attachments.find(
                            (item) => item.id == res.queryStorieID,
                        );
                        if (match) {
                            if (match.type === "Video") {
                                const videoUrl = match.url.sd || match.url.hd;
                                attachment.push(
                                    await streamURL(videoUrl, "mp4"),
                                );
                            } else if (match.type === "Photo") {
                                attachment.push(
                                    await streamURL(match.url, "jpg"),
                                );
                            }
                        }
                    } else {
                        for (const attachmentItem of res.attachments) {
                            if (attachmentItem.type === "Video") {
                                const videoUrl =
                                    attachmentItem.url.sd ||
                                    attachmentItem.url.hd;
                                attachment.push(
                                    await streamURL(videoUrl, "mp4"),
                                );
                            } else if (attachmentItem.type === "Photo") {
                                attachment.push(
                                    await streamURL(attachmentItem.url, "jpg"),
                                );
                            }
                        }
                    }
                    o.api.sendTypingIndicator(true, o.event.threadID);
                    send({
                        body: `📝 Tiêu Đề: ${res.message || "Không Có Tiêu Đề"}\n`,
                        attachment,
                    });
                    o.api.sendTypingIndicator(false, o.event.threadID);
                }
            } else if (tiktokRegex || douyinRegex) {
                /* TẢI ẢNH VÀ VIDEO TIKTOK */
                const url = tiktokRegex
                    ? o.event.body.match(
                          /(?:https:\/\/(?:www\.)?tiktok\.com\/(?:@[\w\d.]+\/(?:video|photo)\/(\d+))|(https:\/\/(?:vt|vm)\.tiktok\.com\/[\w\d]+))/,
                      )[0]
                    : o.event.body.match(
                          /(?:https:\/\/(?:www\.)?(?:iesdouyin|douyin)\.com\/(?:share\/(?:video|photo|note)\/(\d+)|video\/(\d+))|(https:\/\/v\.douyin\.com\/[\w\d]+))/,
                      )[0];
                const dungdeanhbucboi = tiktokRegex ? "TikTok" : "Douyin";
                const res = (
                    await axios.get(
                        `https://niiozic.tokyo/api/tiktok/media?url=${url}`,
                    )
                ).data;
                let attachment = [];
                if (res?.attachments?.[0]?.type == "Photo") {
                    for (item of res.attachments[0].url) {
                        attachment.push(await streamURL(item, "jpg"));
                    }
                } else if (res?.attachments?.[0]?.type == "Video") {
                    attachment.push(
                        await streamURL(res.attachments[0].url, "mp4"),
                    );
                }
                let callback = async () => {
                    if (res.attachments[1].type == "Audio") {
                        send({
                            body: `📝 Tiêu Đề: ${res.music_message || "Không Có Tiêu Đề"}\n`,
                            attachment: await streamURL(
                                res.attachments[1].url,
                                "mp3",
                            ),
                        });
                    }
                };
                o.api.sendTypingIndicator(true, o.event.threadID);
                send({
                    body: `📝 Tiêu Đề: ${
                        res.message || "Không Có Tiêu Đề"
                    }\n📌 Thả Cảm Xúc Để Tải Nhạc\n`,
                    attachment,
                }).then(
                    (res) => (
                        (res.name = this.config.name),
                        (res.callback = callback),
                        (res.o = o),
                        global.client.handleReaction.push(res)
                    ),
                );
                o.api.sendTypingIndicator(false, o.event.threadID);
            } else if (
                /* TỰ ĐỘNG TẢI NHẠC TRÊN YOUTUBE */
                /(^https:\/\/)((www)\.)?(youtube|youtu)(PP)*\.(com|be)\//.test(
                    str,
                )
            ) {
                const ytdl = require("ytdl-core");
                ytdl.getInfo(o.event.body).then(async (info) => {
                    const detail = info.videoDetails;
                    const format = info.formats.find(
                        (f) =>
                            f.qualityLabel &&
                            f.qualityLabel.includes("360p") &&
                            f.audioBitrate,
                    );
                    if (format) {
                        o.api.sendTypingIndicator(true, o.event.threadID);
                        send({
                            body: `📝 Tiêu Đề: ${detail.title} (${convertHMS(
                                detail.lengthSeconds,
                            )})\n📅 Ngày Tải Lên: ${detail.uploadDate}\n📻 Kênh : ${
                                detail.author.name
                            } (${
                                detail.author.subscriber_count
                            })\n👁️‍🗨️ Lượt Xem: ${detail.viewCount.toString()} view\n🔖 Lượt Thích: ${detail.likes.toString()}\n`,
                            attachment: await streamURL(format.url, "mp4"),
                        });
                        o.api.sendTypingIndicator(false, o.event.threadID);
                    }
                });
            } else if (
                /*AUTODOWN CAPCUT VIIDEO */
                /(?:https?:\/\/)?(?:www\.)?capcut\.com\/(?:t\/|template-detail\/)([a-zA-Z0-9]+)(?:\/)?/.test(
                    str,
                )
            ) {
                const res = (
                    await axios.get(
                        `https://niiozic.tokyo/api/capcut/media?url=${str}`,
                    )
                ).data;
                o.api.sendTypingIndicator(true, o.event.threadID);
                send({
                    body: `📝 Tiêu Đề: ${res.message}\n`,
                    attachment: await streamURL(
                        res?.attachments?.[0]?.url,
                        "mp4",
                    ),
                });
                o.api.sendTypingIndicator(true, o.event.threadID);
            }
            /* TỰ DỘNG TẢI ẢNH , GIF , VIDEO PINTERES */
            // else if (isPinterest) {
            //   let url = o.event.body.match(/(?:https?:\/\/(?:www\.)?pinterest\.com\/pin\/|https?:\/\/pin\.it\/)([^\/\?]+)/)[0]
            //   const res = (await axios.get(`https://private.j2download.net/api/pinterest/media?url=${str}`)).data;
            //   let attachment = [];
            //   if (res.attachments && res.attachments.length > 0) {
            //     for (const item of res.attachments) {
            //       attachment.push(await streamURL(item.url, item.type == 'Video' ? 'mp4' : item.type == 'Gif' ? 'gif' : item.type == 'Photo' ? 'jpg' : ''));
            //     }
            //   send({
            //     body: `${head('Pinterest')}Tiêu Đề : ${res.message || "Không Có Tiêu Đề"}`,
            //     attachment
            //   });
            // }
            // }
            /* TỰ ĐỘNG TẢI VD + ẢNH INSTAGRAM AND THREADS */
            else if (isInstagramURL || isThreadsURL) {
                let url = isInstagramURL
                    ? o.event.body.match(
                          /(https:\/\/www\.instagram\.com\/(stories|p|reel|tv)\/[a-zA-Z0-9_\-\/?=]+)(?=\s|$)/g,
                      )[0]
                    : o.event.body.match(
                          /https:\/\/www\.threads\.net\/[^/]+\/post\/([^/?]+)/,
                      )[0];
                const res = (
                    await axios.get(
                        `https://niiozic.tokyo/api/instagram/media?url=${url}`,
                    )
                ).data;
                const imlangnaocobe = isInstagramURL ? "Instagram" : "Threads";
                let attachment = [];
                if (res.attachments && res.attachments.length > 0) {
                    for (const at of res.attachments) {
                        if (at.type === "Video") {
                            attachment.push(await streamURL(at.url, "mp4"));
                        } else if (at.type === "Photo") {
                            attachment.push(await streamURL(at.url, "jpg"));
                        }
                    }
                    o.api.sendTypingIndicator(true, o.event.threadID);
                    send({
                        body: `📝 Tiêu Đề: ${res.message || "Không Có Tiêu Đề"}\n`,
                        attachment,
                    });
                    o.api.sendTypingIndicator(false, o.event.threadID);
                }
            }

            /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO TWITTER | X */
            // Chưa Làm
            /* TỰ ĐỘNG TẢI NHẠC TRÊN SOUNDCLOUD */
            else if (
                /^(https?:\/\/)?(www\.)?(m\.)?(on\.)?soundcloud\.com\/[\w\-\.]+(\/[\w\-\.]+)?$/.test(
                    str,
                )
            ) {
                const res = await axios.get(
                    `http://nguyenmanh.name.vn/api/scDL?url=${str}&apikey=yYmZAYqn`,
                );
                send({
                    body: `📝 Tiêu Đề: ${res.data.result.title}\n✏️ Mô Tả: ${res.data.result.data.description}\n👁️‍🗨️ Lượt Xem: ${res.data.result.data.playback_count}`,
                    attachment: await streamURL(res.data.result.audio, "mp3"),
                });
            } else if (/zingmp3\.vn/.test(str)) {
                /* TỰ ĐỘNG TẢI NHẠC ZINGMP3 */
                const res = await axios.get(
                    `https://nguyenmanh.name.vn/api/zMp3DL?url=${str}apikey=HSKAHruq`,
                );
                const tz = await axios.get(
                    `https://hoanghao.me/api/zingmp3/info?link=${str}`,
                );
                send({
                    body: `📝 Tiêu Đề : ${tz.data.title}\n`,
                    attachment: await streamURL(res.data.resuilt, "mp3"),
                });
            }
        }
    } catch (e) {
        console.log(e);
    }
};
exports.run = () => {};
exports.config = {
    name: "autodown",
    version: "1",
    hasPermssion: 0,
    credits: "Công Nam",
    description: "",
    commandCategory: "No prefix",
    usages: [],
    cooldowns: 3,
};

function streamURL(url, type) {
    return axios
        .get(url, {
            responseType: "arraybuffer",
        })
        .then((res) => {
            const path = __dirname + `/cache/${Date.now()}.${type}`;
            fs.writeFileSync(path, res.data);
            setTimeout((p) => fs.unlinkSync(p), 1000 * 60, path);
            return fs.createReadStream(path);
        });
}
this.handleReaction = async (o) => {
    let s = o.handleReaction;
    // o.api.unsendMessage(s.messageID);
    if (s.o.event.senderID == o.event.userID) s.callback(o);
};
this.extractUrls = function (text) {
    const urlRegex =
        /(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    const urls = text?.match(urlRegex);
    return urls || [];
};
