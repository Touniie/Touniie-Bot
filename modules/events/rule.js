module.exports.config = {
    name: "rule",
    eventType: ["log:subscribe"],
    version: "",
    credits: "Mr.Ben", //Trần Thanh Dương mod từ join của Mr.Ben
    description: "",
};
module.exports.run = async function ({ api, event }) {
    const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
      const { threadID } = event;
      const pathData = join("modules", "commands", "data", "rule.json");
  const thread = global.data.threadData.get(threadID) || {};
if (typeof thread["rule"] != "undefined" && thread["rule"] == false) return;
       var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, listRule: [] };
      if (thisThread.listRule.length != 0) {
                var msg = "", index = 0;
                for (const item of thisThread.listRule) msg += `${index+=1}. ${item}\n`;
		return api.sendMessage({body:`[ LUẬT CỦA NHÓM ]\n\n${msg}`, attachment: (await global.nodemodule["axios"]({
url: (await global.nodemodule["axios"]('https://niiozic.site/girl-video')).data.url,
method: "GET",
responseType: "stream"
})).data
},event.threadID)
      }
}