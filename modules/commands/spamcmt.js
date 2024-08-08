module.exports.config = {
    name: "spamcmt",
    version: "1.1.1",
    hasPermssion: 2,
    credits: "Niio-team (BraSL && Vtuan)",
    description: "",
    commandCategory: "Spam",
    usages: "[]",
    cooldowns: 0,
  };
  
  let botID; //= 100002670454325;
  const moment = require("moment-timezone");
  const fs = require("fs-extra");
  const path = __dirname + "/data/spamcmt.json";
  
  function getGUID() {
    var sectionLength = Date.now();
    var id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = Math.floor((sectionLength + Math.random() * 16) % 16);
        sectionLength = Math.floor(sectionLength / 16);
        var _guid = (c == "x" ? r : (r & 7) | 8).toString(16);
        return _guid;
      }
    );
    return id;
  }
  
  
  module.exports.run = async function ({ api, event, args }) {
     // const groupID = "389983805594997"; // ID của nhóm cần lấy bài viết
      /*try {
          const arrayLink = await getAllFeedGroup(groupID);
          //const arrayID = await getFeedGroup(arrayLink);
         for (let link = 0; link <= arrayLink.length;link++ ){
  
          }; 
          if (arrayLink==0) return api.sendMessage(`rỗng`, event.threadID);
          api.sendMessage(arrayLink.join('\n\n'), event.threadID);
           console.log(arrayLink);
      } catch (error) {
          console.error(error);
      } */
     // if (args.length > 1) {
         // const op = args[0].toLowerCase();
  
  
    const op = args[0] ? args[0].toLowerCase() : '';
  
    if (op === "settoken") {
        const nhapArr = args.slice(1).join(" ").split(",").map(item => item.trim());
  
        if (nhapArr.every(item => item !== "")) {
            updateData("live", nhapArr);
            api.sendMessage("Đã lưu", event.threadID);
        } else {
            api.sendMessage("lỗi", event.threadID);
        }
    } else if (op === "nd") {
        const nhapArr = args.slice(1).join(" ").split(",").map(item => item.trim());
  
        if (nhapArr.every(item => item !== "")) {
            updateData("text", nhapArr);
            api.sendMessage("Đã lưu", event.threadID);
        } else {
            api.sendMessage("lỗi", event.threadID);
        }
    } else if (op.includes("on")) {
        const spamcmtData = loadData();
  
        if (spamcmtData.spamcmt.ID.length > 0) {
            updateData("on", true);
            api.sendMessage("Chức năng spam đã được bật", event.threadID);
        } else {
            api.sendMessage("Không thể bật chức năng spam vì không có ID!", event.threadID);
        }
    } else if (op.includes("off")) {
        updateData("on", false);
        api.sendMessage("Chức năng spam đã được tắt", event.threadID);
    } else if (op === "start") {
        const nhapArr = args.slice(1).join(" ").split(",").map(item => item.trim());
  
        if (nhapArr.length === 0) {
            api.sendMessage("Vui lòng nhập ID group!", event.threadID);
        } else if (nhapArr.some(item => isNaN(item))) {
            api.sendMessage("Vui lòng nhập ID group dưới dạng số!", event.threadID);
        } else {
            const arrayLink = await getAllFeedGroup(nhapArr);
            

           // for (xyz of arrayLink) {
               // await global.utils.getUID(xyz);
                updateData("ID", nhapArr);
          //  }
  
          const dataJson = JSON.parse(fs.readFileSync(path, "utf-8"));
  
          const liveList = dataJson.spamcmt.live;
         // const arrayLink = await getAllFeedGroup();
          console.log(arrayLink)

          api.sendMessage("Bắt đầu!", event.threadID);
  
        }
    } else if (op === "check") {
        const spamcmtData = loadData();
  
        const liveLength = spamcmtData.spamcmt.live.length;
        const dieLength = spamcmtData.spamcmt.die.length;
        const textLength = spamcmtData.spamcmt.text.length;
        const onStatus = spamcmtData.spamcmt.on ? "Bật" : "Tắt";
  
        const message = `Số lượng live: ${liveLength}\nSố lượng die: ${dieLength}\nSố lượng text: ${textLength}\nChế độ: ${onStatus}`;
  
        api.sendMessage(message, event.threadID);
    } else if (op === "list") {
        const spamcmtData = loadData();
        const nhapArr = args.slice(1).join(" ").toLowerCase();
  
        let message = "";
  
        if (nhapArr === "live" || nhapArr === "die" || nhapArr === "txt" || nhapArr === "token") {
            const dataKey = nhapArr === "token" ? "live" : nhapArr;
            const dataList = spamcmtData.spamcmt[dataKey];
  
            if (dataList.length > 0) {
                message = `Danh sách ${nhapArr}:\n`;
                message += dataList.map((item, index) => `${index + 1}. ${item}`).join("\n");
            } else {
                message = `Không có dữ liệu ${nhapArr}.`;
            }
        } else {
            message = "Lựa chọn không hợp lệ. Vui lòng chọn 'live', 'die', 'txt', hoặc 'token'.";
        }
  
        api.sendMessage(message, event.threadID);
    } else {
        api.sendMessage("settoken+ token để thêm token\nnd + nội dung để thêm nội dung\non: bật chế độ\noff: tắt\nstart+ ID để bắt đầu thực thi", event.threadID);
    }
  
    function loadData() {
        let spamcmtData;
        try {
            spamcmtData = JSON.parse(fs.readFileSync(path, "utf-8"));
        } catch (error) {
            console.log("Tạo lại dữ liệu mới...");
            spamcmtData = {
                spamcmt: {
                    live: [],
                    die: [],
                    ID: [],
                    on: false,
                    text: []
                }
            };
        }
        return spamcmtData;
    }
  
    function updateData(key, value) {
        const spamcmtData = loadData();
  
        if (spamcmtData.spamcmt.hasOwnProperty(key)) {
            if (Array.isArray(spamcmtData.spamcmt[key])) {
                value.forEach(item => {
                    if (!spamcmtData.spamcmt[key].includes(item)) {
                        spamcmtData.spamcmt[key].push(item);
                    }
                });
            } else {
                spamcmtData.spamcmt[key] = value;
            }
        }
  
        fs.writeFileSync(
            path,
            JSON.stringify(spamcmtData, null, 4)
        );
    }
  
      //}    
  };
  
  module.exports.onLoad = async ({ api }) => {
      botID = global.client.api.getCurrentUserID();
  
      if (!fs.existsSync(path) || fs.statSync(path).isDirectory()) {
          fs.writeFileSync(
              path,
              JSON.stringify(
                  {
                      spamcmt: {
                          data: {
                              live: [],
                              die: [],
                              ID: []
                          },
                          on: false,
                          text: []
                      }
                  },
                  null,
                  4
              )
          );
      } else {
         // setInterval(() => console.log("hi"), 1000);
      }
  };
  
  
  
  async function getAllFeedGroup() {
    return new Promise((resolve, reject) => {
      //const allID = getAllIDGroup();
          //const allID = 
      var listLinkFeed = [];
      //for (const i of allID) {
        //const id =  389983805594997 //i.id;
        var form = {
          av: botID,
          fb_api_caller_class: "RelayModern",
          fb_api_req_friendly_name:
            "GroupsCometFeedRegularStoriesPaginationQuery",
          variables: JSON.stringify({
            UFI2CommentsProvider_commentsKey:
              "CometGroupDiscussionRootSuccessQuery",
            count: 3,
            displayCommentsContextEnableComment: null,
            displayCommentsContextIsAdPreview: null,
            displayCommentsContextIsAggregatedShare: null,
            displayCommentsContextIsStorySet: null,
            displayCommentsFeedbackContext: null,
            feedLocation: "GROUP",
            feedType: "DISCUSSION",
            feedbackSource: 0,
            focusCommentID: null,
            privacySelectorRenderLocation: "COMET_STREAM",
            renderLocation: "group",
            scale: 1.5,
            sortingSetting: null,
            stream_initial_count: 9,
            useDefaultActor: false,
            id: nhapArr,
            __relay_internal__pv__IsWorkUserrelayprovider: false,
            __relay_internal__pv__IsMergQAPollsrelayprovider: false,
            __relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider: false,
            __relay_internal__pv__CometUFIIsRTAEnabledrelayprovider: true,
            __relay_internal__pv__StoriesArmadilloReplyEnabledrelayprovider: true,
            __relay_internal__pv__StoriesRingrelayprovider: false,
          }),
          server_timestamps: "true",
          doc_id: "6576509869144318",
        };
        global.client.api.httpPost(
          "https://www.facebook.com/api/graphql/",
          form,
          (e, info) => {
            if (e) {
              console.log(e);
              reject(e);
            }
            const rawData = info;
            const regexPattern =
              /\},"metadata":([\s\S]*?),"title":{"__typename":"Com/g;
            const matches = [...rawData.matchAll(regexPattern)];
            const metadataList = matches.map((match) => match[1]);
            const parsedMetadataList = metadataList.map((metadata) => {
              try {
                const tt = JSON.parse(metadata);
                for (const i of tt) {
                  if (
                    i.__typename == "CometFeedStoryMinimizedTimestampStrategy"
                  ) {
                    //console.log(i)
                    if (i.story.url) {
                      const find = listLinkFeed.find(
                        (item) => item === i.story.url
                      );
                      if (!find) {
                        listLinkFeed.push(i.story.url);
                      }
                    }
                  }
                }
              } catch (error) {
                console.error("Không thể get feed group " + i.namename);
                return false;
              }
            });
  
            resolve(listLinkFeed);
          }
        );
      //}
    });
  }