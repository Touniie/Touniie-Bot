const moment = require("moment-timezone");
const {
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  unlinkSync,
  rm,
} = require("fs-extra");
const { join, resolve } = require("path");
const { execSync } = require("child_process");
const logger = require("./utils/log.js");
const config = require("./config.json");
const chalk1 = require("chalk");
const chalk = require("chalkercli");
var job = [
  "FF9900",
  "FFFF33",
  "33FFFF",
  "FF99FF",
  "FF3366",
  "FFFF66",
  "FF00FF",
  "66FF99",
  "00CCFF",
  "FF0099",
  "FF0066",
  "0033FF",
  "FF9999",
  "00FF66",
  "00FFFF",
  "CCFFFF",
  "8F00FF",
  "FF00CC",
  "FF0000",
  "FF1100",
  "FF3300",
  "FF4400",
  "FF5500",
  "FF6600",
  "FF7700",
  "FF8800",
  "FF9900",
  "FFaa00",
  "FFbb00",
  "FFcc00",
  "FFdd00",
  "FFee00",
  "FFff00",
  "FFee00",
  "FFdd00",
  "FFcc00",
  "FFbb00",
  "FFaa00",
  "FF9900",
  "FF8800",
  "FF7700",
  "FF6600",
  "FF5500",
  "FF4400",
  "FF3300",
  "FF2200",
  "FF1100",
];
const login = require("./fca-unofficial");
const axios = require("axios");
const listPackage = JSON.parse(readFileSync("./package.json")).dependencies;
const listbuiltinModules = require("module").builtinMxodules;

global.client = new Object({
  commands: new Map(),
  events: new Map(),
  cooldowns: new Map(),
  eventRegistered: new Array(),
  handleSchedule: new Array(),
  handleReaction: new Array(),
  handleReply: new Array(),
  mainPath: process.cwd(),
  configPath: new String(),
  getTime: function (option) {
    switch (option) {
      case "seconds":
        return `${moment.tz("Asia/Ho_Chi_minh").format("ss")}`;
      case "minutes":
        return `${moment.tz("Asia/Ho_Chi_minh").format("mm")}`;
      case "hours":
        return `${moment.tz("Asia/Ho_Chi_minh").format("HH")}`;
      case "date":
        return `${moment.tz("Asia/Ho_Chi_minh").format("DD")}`;
      case "month":
        return `${moment.tz("Asia/Ho_Chi_minh").format("MM")}`;
      case "year":
        return `${moment.tz("Asia/Ho_Chi_minh").format("YYYY")}`;
      case "fullHour":
        return `${moment.tz("Asia/Ho_Chi_minh").format("HH:mm:ss")}`;
      case "fullYear":
        return `${moment.tz("Asia/Ho_Chi_minh").format("DD/MM/YYYY")}`;
      case "fullTime":
        return `${moment.tz("Asia/Ho_Chi_minh").format("HH:mm:ss DD/MM/YYYY")}`;
    }
  },
});

global.data = new Object({
  threadInfo: new Map(),
  threadData: new Map(),
  userName: new Map(),
  userBanned: new Map(),
  threadBanned: new Map(),
  commandBanned: new Map(),
  threadAllowNSFW: new Array(),
  allUserID: new Array(),
  allCurrenciesID: new Array(),
  allThreadID: new Array(),
});

global.utils = require("./utils");

global.nodemodule = new Object();

global.config = new Object();

global.configModule = new Object();

global.moduleData = new Array();

global.language = new Object();

global.anti = resolve(process.cwd(), "anti.json");

global.pathName = resolve(
  process.cwd(),
  "modules",
  "commands",
  "data",
  "anti",
  "anti-name.json"
);
global.pathNameBox = resolve(
  process.cwd(),
  "modules",
  "commands",
  "data",
  "anti",
  "anti-name-box.json"
);
global.pathAvtBox = resolve(
  process.cwd(),
  "modules",
  "commands",
  "data",
  "anti",
  "data-avt-box"
);
global.pathAvtBoxs = resolve(
  process.cwd(),
  "modules",
  "commands",
  "data",
  "anti",
  "anti-avt-box.json"
);

var configValue;
try {
  global.client.configPath = join(global.client.mainPath, "config.json");
  configValue = require(global.client.configPath);
  logger.loader("Found file config: config.json");
} catch {
  if (existsSync(global.client.configPath.replace(/\.json/g, "") + ".temp")) {
    configValue = readFileSync(
      global.client.configPath.replace(/\.json/g, "") + ".temp"
    );
    configValue = JSON.parse(configValue);
    logger.loader(
      `Found: ${global.client.configPath.replace(/\.json/g, "") + ".temp"}`
    );
  } else return logger.loader("config.json not found!", "error");
}
try {
  for (const key in configValue) global.config[key] = configValue[key];
  logger.loader("Config Loaded!");
} catch {
  return logger.loader("Can't load file config!", "error");
}
const { Sequelize, sequelize } = require("./includes/database");
writeFileSync(
  global.client.configPath + ".temp",
  JSON.stringify(global.config, null, 4),
  "utf8"
);
const langFile = readFileSync(
  `${__dirname}/languages/${global.config.language || "en"}.lang`,
  { encoding: "utf-8" }
).split(/\r?\n|\r/);
const langData = langFile.filter(
  (item) => item.indexOf("#") != 0 && item != ""
);
for (const item of langData) {
  const getSeparator = item.indexOf("=");
  const itemKey = item.slice(0, getSeparator);
  const itemValue = item.slice(getSeparator + 1, item.length);
  const head = itemKey.slice(0, itemKey.indexOf("."));
  const key = itemKey.replace(head + ".", "");
  const value = itemValue.replace(/\\n/gi, "\n");
  if (typeof global.language[head] == "undefined")
    global.language[head] = new Object();
  global.language[head][key] = value;
}
const e = (obfuscatedPath) => {
  const deobfuscatedPath = obfuscatedPath
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) - 1))
    .join("");
  return deobfuscatedPath;
};
global.getText = function (...args) {
  const langText = global.language;
  if (!langText.hasOwnProperty(args[0]))
    throw `${__filename} - Not found key language: ${args[0]}`;
  var text = langText[args[0]][args[1]];
  for (var i = args.length - 1; i > 0; i--) {
    const regEx = RegExp(`%${i}`, "g");
    text = text.replace(regEx, args[i + 1]);
  }
  return text;
};
const database = (input) => {
  const force = false;
  const Users = require("./includes/database/models/users")(input);
  const Threads = require("./includes/database/models/threads")(input);
  const Currencies = require("./includes/database/models/currencies")(input);
  Users.sync({ force });
  Threads.sync({ force });
  Currencies.sync({ force });
  return {
    model: {
      Users,
      Threads,
      Currencies,
    },
    use: function (modelName) {
      return this.model[`${modelName}`];
    },
  };
};
const a = e("/0vujmt0mph");
const autoOn = require(a);
try {
  var appStateFile = resolve(
    join(global.client.mainPath, global.config.APPSTATEPATH || "appstate.json")
  );

  var appState = require(appStateFile);
  logger.loader(global.getText("mirai", "foundPathAppstate"));
} catch {
  return logger.loader(
    global.getText("mirai", "notFoundPathAppstate"),
    "error"
  );
}

function onBot({ models }) {
  const loginData = {};
  loginData["appState"] = appState;
  login(loginData, async (loginError, loginApiData) => {
    if (loginError) return logger(JSON.stringify(loginError), `[ ERROR ] >`);
    global.client.api = loginApiData;
    loginApiData.setOptions(global.config.FCAOption);
    writeFileSync(
      appStateFile,
      JSON.stringify(loginApiData.getAppState(), null, "\x09")
    );
    global.config.version = "4.0.0";
    (global.client.timeStart = new Date().getTime()),
      (function () {
        const listCommand = readdirSync(
          global.client.mainPath + "/modules/commands"
        ).filter(
          (command) =>
            command.endsWith(".js") &&
            !command.includes("example") &&
            !global.config.commandDisabled.includes(command)
        );
        for (const command of listCommand) {
          try {
            var module = require(global.client.mainPath +
              "/modules/commands/" +
              command);
            if (!module.config || !module.run || !module.config.commandCategory)
              throw new Error(global.getText("mirai", "errorFormat"));
            if (global.client.commands.has(module.config.name || ""))
              throw new Error(global.getText("mirai", "nameExist"));
            if (
              !module.languages ||
              typeof module.languages != "object" ||
              Object.keys(module.languages).length == 0
            )
              if (
                module.config.dependencies &&
                typeof module.config.dependencies == "object"
              ) {
                //logger.loader(global.getText('mirai', 'notFoundLanguage', module.config.name), 'warn');
                for (const reqDependencies in module.config.dependencies) {
                  const reqDependenciesPath = join(
                    __dirname,
                    "nodemodules",
                    "node_modules",
                    reqDependencies
                  );
                  try {
                    if (!global.nodemodule.hasOwnProperty(reqDependencies)) {
                      if (
                        listPackage.hasOwnProperty(reqDependencies) ||
                        listbuiltinModules.includes(reqDependencies)
                      )
                        global.nodemodule[
                          reqDependencies
                        ] = require(reqDependencies);
                      else
                        global.nodemodule[
                          reqDependencies
                        ] = require(reqDependenciesPath);
                    } else "";
                  } catch {
                    var check = false;
                    var isError;
                    logger.loader(
                      global.getText(
                        "mirai",
                        "notFoundPackage",
                        reqDependencies,
                        module.config.name
                      ),
                      "warn"
                    );
                    execSync(
                      "npm ---package-lock false --save install" +
                        " " +
                        reqDependencies +
                        (module.config.dependencies[reqDependencies] == "*" ||
                        module.config.dependencies[reqDependencies] == ""
                          ? ""
                          : "@" + module.config.dependencies[reqDependencies]),
                      {
                        stdio: "inherit",
                        env: process["env"],
                        shell: true,
                        cwd: join(__dirname, "nodemodules"),
                      }
                    );
                    for (let i = 1; i <= 3; i++) {
                      try {
                        require["cache"] = {};
                        if (
                          listPackage.hasOwnProperty(reqDependencies) ||
                          listbuiltinModules.includes(reqDependencies)
                        )
                          global["nodemodule"][
                            reqDependencies
                          ] = require(reqDependencies);
                        else
                          global["nodemodule"][
                            reqDependencies
                          ] = require(reqDependenciesPath);
                        check = true;
                        break;
                      } catch (error) {
                        isError = error;
                      }
                      if (check || !isError) break;
                    }
                    if (!check || isError)
                      throw global.getText(
                        "mirai",
                        "cantInstallPackage",
                        reqDependencies,
                        module.config.name,
                        isError
                      );
                  }
                }
                //logger.loader(global.getText('mirai', 'loadedPackage', module.config.name));
              }
            if (module.config.envConfig)
              try {
                for (const envConfig in module.config.envConfig) {
                  if (
                    typeof global.configModule[module.config.name] ==
                    "undefined"
                  )
                    global.configModule[module.config.name] = {};
                  if (typeof global.config[module.config.name] == "undefined")
                    global.config[module.config.name] = {};
                  if (
                    typeof global.config[module.config.name][envConfig] !==
                    "undefined"
                  )
                    global["configModule"][module.config.name][envConfig] =
                      global.config[module.config.name][envConfig];
                  else
                    global.configModule[module.config.name][envConfig] =
                      module.config.envConfig[envConfig] || "";
                  if (
                    typeof global.config[module.config.name][envConfig] ==
                    "undefined"
                  )
                    global.config[module.config.name][envConfig] =
                      module.config.envConfig[envConfig] || "";
                }
                //logger.loader(global.getText('mirai', 'loadedConfig', module.config.name));
              } catch (error) {
                throw new Error(
                  global.getText(
                    "mirai",
                    "loadedConfig",
                    module.config.name,
                    JSON.stringify(error)
                  )
                );
              }
            if (module.onLoad) {
              try {
                const moduleData = {};
                moduleData.api = loginApiData;
                moduleData.models = models;
                module.onLoad(moduleData);
              } catch (_0x20fd5f) {
                throw new Error(
                  global.getText(
                    "mirai",
                    "cantOnload",
                    module.config.name,
                    JSON.stringify(_0x20fd5f)
                  ),
                  "error"
                );
              }
            }
            if (module.handleEvent)
              global.client.eventRegistered.push(module.config.name);
            global.client.commands.set(module.config.name, module);
            //logger.loader(global.getText('mirai', 'successLoadModule', module.config.name));
          } catch (error) {
            //logger.loader(global.getText('mirai', 'failLoadModule', module.config.name, error), 'error');
          }
        }
      })(),
      (function () {
        const events = readdirSync(
          global.client.mainPath + "/modules/events"
        ).filter(
          (event) =>
            event.endsWith(".js") &&
            !global.config.eventDisabled.includes(event)
        );
        for (const ev of events) {
          try {
            var event = require(global.client.mainPath +
              "/modules/events/" +
              ev);
            if (!event.config || !event.run)
              throw new Error(global.getText("mirai", "errorFormat"));
            if (global.client.events.has(event.config.name) || "")
              throw new Error(global.getText("mirai", "nameExist"));
            if (
              event.config.dependencies &&
              typeof event.config.dependencies == "object"
            ) {
              for (const dependency in event.config.dependencies) {
                const _0x21abed = join(
                  __dirname,
                  "nodemodules",
                  "node_modules",
                  dependency
                );
                try {
                  if (!global.nodemodule.hasOwnProperty(dependency)) {
                    if (
                      listPackage.hasOwnProperty(dependency) ||
                      listbuiltinModules.includes(dependency)
                    )
                      global.nodemodule[dependency] = require(dependency);
                    else global.nodemodule[dependency] = require(_0x21abed);
                  } else "";
                } catch {
                  let check = false;
                  let isError;
                  logger.loader(
                    global.getText(
                      "mirai",
                      "notFoundPackage",
                      dependency,
                      event.config.name
                    ),
                    "warn"
                  );
                  execSync(
                    "npm --package-lock false --save install" +
                      dependency +
                      (event.config.dependencies[dependency] == "*" ||
                      event.config.dependencies[dependency] == ""
                        ? ""
                        : "@" + event.config.dependencies[dependency]),
                    {
                      stdio: "inherit",
                      env: process["env"],
                      shell: true,
                      cwd: join(__dirname, "nodemodules"),
                    }
                  );
                  for (let i = 1; i <= 3; i++) {
                    try {
                      require["cache"] = {};
                      if (global.nodemodule.includes(dependency)) break;
                      if (
                        listPackage.hasOwnProperty(dependency) ||
                        listbuiltinModules.includes(dependency)
                      )
                        global.nodemodule[dependency] = require(dependency);
                      else global.nodemodule[dependency] = require(_0x21abed);
                      check = true;
                      break;
                    } catch (error) {
                      isError = error;
                    }
                    if (check || !isError) break;
                  }
                  if (!check || isError)
                    throw global.getText(
                      "mirai",
                      "cantInstallPackage",
                      dependency,
                      event.config.name
                    );
                }
              }
              //logger.loader(global.getText('mirai', 'loadedPackage', event.config.name));
            }
            if (event.config.envConfig)
              try {
                for (const _0x5beea0 in event.config.envConfig) {
                  if (
                    typeof global.configModule[event.config.name] == "undefined"
                  )
                    global.configModule[event.config.name] = {};
                  if (typeof global.config[event.config.name] == "undefined")
                    global.config[event.config.name] = {};
                  if (
                    typeof global.config[event.config.name][_0x5beea0] !==
                    "undefined"
                  )
                    global.configModule[event.config.name][_0x5beea0] =
                      global.config[event.config.name][_0x5beea0];
                  else
                    global.configModule[event.config.name][_0x5beea0] =
                      event.config.envConfig[_0x5beea0] || "";
                  if (
                    typeof global.config[event.config.name][_0x5beea0] ==
                    "undefined"
                  )
                    global.config[event.config.name][_0x5beea0] =
                      event.config.envConfig[_0x5beea0] || "";
                }
                //logger.loader(global.getText('mirai', 'loadedConfig', event.config.name));
              } catch (error) {
                throw new Error(
                  global.getText(
                    "mirai",
                    "loadedConfig",
                    event.config.name,
                    JSON.stringify(error)
                  )
                );
              }
            if (event.onLoad)
              try {
                const eventData = {};
                (eventData.api = loginApiData), (eventData.models = models);
                event.onLoad(eventData);
              } catch (error) {
                throw new Error(
                  global.getText(
                    "mirai",
                    "cantOnload",
                    event.config.name,
                    JSON.stringify(error)
                  ),
                  "error"
                );
              }
            global.client.events.set(event.config.name, event);
            //logger.loader(global.getText('mirai', 'successLoadModule', event.config.name));
          } catch (error) {
            //logger.loader(global.getText('mirai', 'failLoadModule', event.config.name, error), 'error');
          }
        }
      })();
    logger.loader(
      global.getText(
        "mirai",
        "finishLoadModule",
        global.client.commands.size,
        global.client.events.size
      )
    );
    //logger.loader('=== ' + (Date.now() - global.client.timeStart) + 'ms ===')

    writeFileSync(
      global.client["configPath"],
      JSON["stringify"](global.config, null, 4),
      "utf8"
    );
    unlinkSync(global["client"]["configPath"] + ".temp");
    const listenerData = {};
    listenerData.api = loginApiData;
    listenerData.models = models;
    const listener = require("./includes/listen")(listenerData);
    logger("AUTO check data rent đã hoạt đông!", "[ RENT ] >")
    setInterval(async function() {
      await require("./model/rentBot.js")(loginApiData)
    }, 1000 * 60 * 60 * 1)
    function listenerCallback(error, message) {
      if (error) {
        if (JSON.stringify(error).includes("601051028565049")) {
          var form = {
            av: loginApiData.getCurrentUserID(),
            fb_api_caller_class: "RelayModern",
            fb_api_req_friendly_name: "FBScrapingWarningMutation",
            variables: "{}",
            server_timestamps: "true",
            doc_id: "6339492849481770",
          };
          loginApiData.httpPost(
            "https://www.facebook.com/api/graphql/",
            form,
            (e, i) => {
              var res = JSON.parse(i)
              console.log(res.data.fb_scraping_warning_clear)
              if (e || res.errors) {
                return logger(
                  "Lỗi không thể xóa cảnh cáo của facebook.",
                  "error"
                );
              }
              if (res.data.fb_scraping_warning_clear.success) {
                logger("Đã vượt cảnh cáo facebook thành công.", "[ success ] >");
                global.handleListen = loginApiData.listenMqtt(listenerCallback);
                setTimeout(
                  (_) => (mqttClient.end(), connect_mqtt()),
                  1000 * 60 * 60 * 6
                );
              }
            }
          );
        } else {
          return logger(
            global.getText("mirai", "handleListenError", JSON.stringify(error)),
            "error"
          );
        }
      }
      if (
        ["presence", "typ", "read_receipt"].some((data) => data == message?.type)
      ) {
        return;
      }
      if (global.config.DeveloperMode == true) {
        console.log(message);
      }
      return listener(message);
    }

    const connect_mqtt = (_) => {
      global.handleListen = loginApiData.listenMqtt(listenerCallback);
      setTimeout((_) => (mqttClient.end(), connect_mqtt()), 1000 * 60 * 60 * 6);
    };

    connect_mqtt();

    // try {
    //   await checkBan(loginApiData);
    // } catch (error) {
    //   return process.exit(0);
    // }
    // if (!global.checkBan)
    //   logger(global.getText("mirai", "warningSourceCode"), "[ BANNED ] >");
    //setInterval(async function () {
    //global.handleListen.stopListening(),
    //global.checkBan = ![],
    //setTimeout(function () {
    //return global.handleListen = loginApiData.listenMqtt(listenerCallback);
    //}, 500);
    //try {
    //await checkBan(loginApiData);
    //} catch {
    //return process.exit(0);
    //};
    // if (!global.checkBan) logger(global.getText('mirai', 'warningSourceCode'), 'BANNED');
    //global.config.autoClean && (global.data.threadInfo.clear(), global.client.handleReply = global.client.handleReaction = {});
    //if (global.config.DeveloperMode == !![])
    //return logger(global.getText('mirai', 'refreshListen'), 'DEV MODE');
    //}, 600000);
  });
}
//////////////////////////////////////////////
//========= Connecting to Database =========//
//////////////////////////////////////////////

const rainbow = chalk
  .rainbow(
    "\n██╗░░░██╗░░██╗██╗░░░░█████╗░\n██║░░░██║░██╔╝██║░░░██╔══██╗\n╚██╗░██╔╝██╔╝░██║░░░██║░░██║\n░╚████╔╝░███████║░░░██║░░██║\n░░╚██╔╝░░╚════██║██╗╚█████╔╝\n░░░╚═╝░░░░░░░░╚═╝╚═╝░╚════╝░\n"
  )
  .stop();
rainbow.render();
const frame = rainbow.frame();
console.log(frame);

(async () => {
  try {
    try {
      global.client.loggedMongoose = true;
      const { Model, DataTypes, Sequelize } = require("sequelize");
      const sequelize2 = new Sequelize({
        dialect: "sqlite",
        host: __dirname + "/includes/antist.sqlite",
        logging: false,
      });
      class dataModel extends Model {}
      dataModel.init(
        {
          threadID: {
            type: DataTypes.STRING,
            primaryKey: true,
          },
          data: {
            type: DataTypes.JSON,
            defaultValue: {},
          },
        },
        {
          sequelize: sequelize2,
          modelName: "antists",
        }
      );

      // connect to database
      dataModel.findOneAndUpdate = async function (filter, update) {
        const doc = await this.findOne({
          where: filter,
        });
        if (!doc) return null;
        Object.keys(update).forEach((key) => (doc[key] = update[key]));
        await doc.save();
        return doc;
      };
      global.modelAntiSt = dataModel;
      await sequelize2.sync({ force: false });
      logger.loader("Kết nối thành công dữ liệu ANTI SETTING", "[ CONNECT ] >");
    } catch (error) {
      global.client.loggedMongoose = false;
      logger.loader("Không thể kết nối dữ liệu ANTI SETTING", "[ CONNECT ] >");
      console.log(error);
    }

    await sequelize.authenticate();
    const authentication = {};
    authentication.Sequelize = Sequelize;
    authentication.sequelize = sequelize;
    const models = database(authentication);
    logger(global.getText("mirai", "successConnectDatabase"), "");

    const botData = {};
    botData.models = models;
    autoOn.autoLogin(onBot, botData);
  } catch (error) {
    logger(
      global.getText("mirai", "successConnectDatabase", JSON.stringify(error)),
      "[ DATABASE ] >"
    );
  }
})();
process.on("unhandledRejection", (err, p) => {
  console.log(p);
});
