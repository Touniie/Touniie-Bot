module.exports.config = {
    "name": "cmd",
    "version": "1.0.0",
    "hasPermssion": 2,
    "credits": "Niiozic",
    "description": "Quản lý/Kiểm soát toàn bộ module của bot",
    "commandCategory": "Admin",
    "usages": "[load/unload/loadAll/unloadAll/info/autoload] + [tên module]",
    "cooldowns": 5,
    "dependencies": {
        "fs-extra": "",
        "child_process": "",
        "path": ""
    }
};

const loadCommand = function ({ moduleList, threadID, messageID }) {

    const { execSync } = global.nodemodule['child_process'];
    const { writeFileSync, unlinkSync, readFileSync } = global.nodemodule['fs-extra'];
    const { join } = global.nodemodule['path'];
    const { configPath, mainPath, api } = global.client;
    const logger = require(mainPath + '/utils/log');

    var errorList = [];
    delete require['resolve'][require['resolve'](configPath)];
    var configValue = require(configPath);
    writeFileSync(configPath + '.temp', JSON.stringify(configValue, null, 2), 'utf8');
    for (const nameModule of moduleList) {
        try {
            const dirModule = __dirname + '/' + nameModule + '.js';
            delete require['cache'][require['resolve'](dirModule)];
            const command = require(dirModule);
            global.client.commands.delete(nameModule);
            if (!command.config || !command.run || !command.config.commandCategory) 
                throw new Error('Module không đúng định dạng!');
            global.client['eventRegistered'] = global.client['eventRegistered']['filter'](info => info != command.config.name);
            if (command.config.dependencies && typeof command.config.dependencies == 'object') {
                const listPackage = JSON.parse(readFileSync('./package.json')).dependencies,
                    listbuiltinModules = require('module')['builtinModules'];
                for (const packageName in command.config.dependencies) {
                    var tryLoadCount = 0,
                        loadSuccess = ![],
                        error;
                    const moduleDir = join(global.client.mainPath, 'nodemodules', 'node_modules', packageName);
                    try {
                        if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) global.nodemodule[packageName] = require(packageName);
                        else global.nodemodule[packageName] = require(moduleDir);
                    } catch {
                        logger.loader('Không tìm thấy package ' + packageName + ' hỗ trợ cho lệnh '  + command.config.name + 
 ' tiến hành cài đặt...', 'warn');
                        const insPack = {};
                        insPack.stdio = 'inherit';
                        insPack.env = process.env ;
                        insPack.shell = !![];
                        insPack.cwd = join(global.client.mainPath,'nodemodules')
                        execSync('npm --package-lock false --save install' + packageName + (command.config.dependencies[packageName] == '*' || command.config.dependencies[packageName] == '' ? '' : '@' + command.config.dependencies[packageName]), insPack);
                        for (tryLoadCount = 1; tryLoadCount <= 3; tryLoadCount++) {
                            require['cache'] = {};
                            try {
                                if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) global.nodemodule[packageName] = require(packageName);
                                else global.nodemodule[packageName] = require(moduleDir);
                                loadSuccess = !![];
                                break;
                            } catch (erorr) {
                                error = erorr;
                            }
                            if (loadSuccess || !error) break;
                        }
                        if (!loadSuccess || error) throw 'Không thể tải package ' + packageName + (' cho lệnh ') + command.config.name +', lỗi: ' + error + ' ' + error['stack'];
                    }
                }
                logger.loader('Đã tải thành công toàn bộ package cho lệnh ' + command.config.name);
            }
            if (command.config.envConfig && typeof command.config.envConfig == 'Object') try {
                for (const [key, value] of Object['entries'](command.config.envConfig)) {
                    if (typeof global.configModule[command.config.name] == undefined) 
                        global.configModule[command.config.name] = {};
                    if (typeof configValue[command.config.name] == undefined) 
                        configValue[command.config.name] = {};
                    if (typeof configValue[command.config.name][key] !== undefined) 
                        global.configModule[command.config.name][key] = configValue[command.config.name][key];
                    else global.configModule[command.config.name][key] = value || '';
                    if (typeof configValue[command.config.name][key] == undefined) 
                        configValue[command.config.name][key] = value || '';
                }
                logger.loader('Loaded config' + ' ' + command.config.name);
            } catch (error) {
                throw new Error('Không thể tải config module, lỗi: ' + JSON.stringify(error));
            }
            if (command['onLoad']) try {
                const onLoads = {};
                onLoads['configValue'] = configValue;
                command['onLoad'](onLoads);
            } catch (error) {
                throw new Error('Không thể onLoad module, lỗi: ' + JSON.stringify(error), 'error');
            }
            if (command.handleEvent) global.client.eventRegistered.push(command.config.name);
            (global.config.commandDisabled.includes(nameModule + '.js') || configValue.commandDisabled.includes(nameModule + '.js')) 
            && (configValue.commandDisabled.splice(configValue.commandDisabled.indexOf(nameModule + '.js'), 1),
            global.config.commandDisabled.splice(global.config.commandDisabled.indexOf(nameModule + '.js'), 1))
            global.client.commands.set(command.config.name, command)
            logger.loader('Loaded command ' + command.config.name + '!');
        } catch (error) {
					console.log(error)
            errorList.push('- ' + nameModule + ' reason:' + error + ' at ' + error['stack']);
        };
    }
    if (errorList.length != 0) api.sendMessage('⚠️ Những lệnh đã xảy ra sự cố khi đang load: ' + errorList.join(' '), threadID, messageID);
    api.sendMessage('Đã tải thành công ' + (moduleList.length - errorList.length) + ' lệnh', threadID, messageID) 
    writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8')
    unlinkSync(configPath + '.temp');
    return;
}

const unloadModule = function ({ moduleList, threadID, messageID }) {
    const { writeFileSync, unlinkSync } = global.nodemodule["fs-extra"];
    const { configPath, mainPath, api } = global.client;
    const logger = require(mainPath + "/utils/log").loader;

    delete require.cache[require.resolve(configPath)];
    var configValue = require(configPath);
    writeFileSync(configPath + ".temp", JSON.stringify(configValue, null, 4), 'utf8');

    for (const nameModule of moduleList) {
        global.client.commands.delete(nameModule);
        global.client.eventRegistered = global.client.eventRegistered.filter(item => item !== nameModule);
        configValue["commandDisabled"].push(`${nameModule}.js`);
        global.config["commandDisabled"].push(`${nameModule}.js`);
        logger(`Unloaded command ${nameModule}!`);
    }

    writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8');
    unlinkSync(configPath + ".temp");

    return api.sendMessage(`Đã hủy thành công ${moduleList.length} lệnh ✅`, threadID, messageID);
}

module.exports.run = function ({ event, args, api }) {
  
    const { readdirSync } = global.nodemodule["fs-extra"];
    const { threadID, messageID } = event;

    var moduleList = args.splice(1, args.length);

    switch (args[0]) {
      case "count": 
      case "-c": {
      let commands = client.commands.values();
		  let infoCommand = "";
			api.sendMessage("📌 Hiện tại đang có " + client.commands.size + " lệnh có thể sử dụng"+ infoCommand, event.threadID, event.messageID);
      break;
		}
        case "load":
        case "-l": {
            if (moduleList.length == 0) return api.sendMessage("❎ Tên module không được để trống", threadID, messageID);
            else return loadCommand({ moduleList, threadID, messageID });
        }
        case "unload":
        case "-ul": {
            if (moduleList.length == 0) return api.sendMessage("❎ Tên module không được để trống", threadID, messageID);
            else return unloadModule({ moduleList, threadID, messageID });
        }
        case "loadAll":
        case "-la": {
            moduleList = readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example'));
            moduleList = moduleList.map(item => item.replace(/\.js/g, ""));
            return loadCommand({ moduleList, threadID, messageID });
        }
        case "unloadAll": 
      case "-ula": {
            moduleList = readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example') && !file.includes("command"));
            moduleList = moduleList.map(item => item.replace(/\.js/g, ""));
            return unloadModule({ moduleList, threadID, messageID });
        }
        case "info":
      case "-i": {
            const command = global.client.commands.get(moduleList.join("") || "");

            if (!command) return api.sendMessage("❎ Module bạn nhập không tồn tại", threadID, messageID);

            const { name, version, hasPermssion, credits, cooldowns, dependencies } = command.config;

            return api.sendMessage(
                "</ " + name.toUpperCase() + " />\n" +
                "- Được code bởi: " + credits + "\n" +
                "- Phiên bản: " + version + "\n" +
                "- Yêu cầu quyền hạn: " + ((hasPermssion == 0) ? "Người dùng" : (hasPermssion == 1) ? "Quản trị viên" : "Người vận hành bot" ) + "\n" +
                "- Thời gian chờ: " + cooldowns + " giây(s)\n" +
                `- Các package yêu cầu: ${(Object.keys(dependencies || {})).join(", ") || "Không có"}`,
                threadID, messageID
            );
        };case 'autoload': {
    if (!global.set_interval_auto_load_commands)(global.set_interval_auto_load_commands = setInterval((()=> {
        let files = require('fs').readdirSync(__dirname+'/').filter($=>/\.js$/.test($));
        for (let file of files) try {
            let path = __dirname+'/'+file;delete require.cache[require.resolve(path)];
            let cmd = require(path);
            global.client.commands.set(cmd.config.name, cmd);
        } catch(e) {};
    }), 1000), api.sendMessage('✅ Đã bật autoload khi chỉnh sửa code', event.threadID)); else (clearInterval(global.set_interval_auto_load_commands), global.set_interval_auto_load_commands = undefined, api.sendMessage('✅ Đã tắt autoload khi chỉnh sửa code', event.threadID))
    }break;
        default: {
            return global.utils.throwError(this.config.name, threadID, messageID);
        }
    }
}