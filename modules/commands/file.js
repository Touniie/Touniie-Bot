module.exports.config = {
    name: 'file',
    version: '1.1.1',
    hasPermssion: 2,
    credits: 'Niio-team (DC-Nam)',
    description: 'xem item trong folder, xóa, xem file',
    commandCategory: 'Admin',
    usages: '[đường dẫn]',
    cooldowns: 0,
};
const fs = require('fs');
const {
    readFile,
    readFileSync,
    readdirSync,
    statSync,
    lstatSync,
    unlinkSync,
    rmdirSync,
    createReadStream,
    createWriteStream,
    copyFileSync,
    existsSync,
    renameSync,
    mkdirSync,
} = fs;
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const archiver = require('archiver');

const _node_modules_path = process.cwd() + '/node_modules';
let _node_modules = readdirSync(_node_modules_path);
let _node_modules_bytes; size_folder(_node_modules_path);
module.exports.run = function( {
    api, event, args
}) {
    openFolder(api, event, process.cwd() + (args[0] ? args[0]: ''))
};
module.exports.handleReply = function( {
    handleReply: $, api, event
}) {
    try {
        if (!global.config.ADMINBOT.includes(event.senderID)) return;
        let d = $.data[event.args[1]-1];
        let action = event.args[0].toLowerCase();

        if (!['create'].includes(action))if (!d && event.args[0])return api.sendMessage('⚠️ Not found index file', event.threadID, event.messageID);

        switch (action) {
            case 'open':
                if (d.info.isDirectory())openFolder(api, event, d.dest);
                else api.sendMessage('⚠️ Path not a directory', event.threadID, event.messageID);
                break;
            case 'del': {
                var arrFile = [],
                fo,
                fi;
                for (const i of event.args.slice(1)) {
                    const {
                        dest,
                        info
                    } = $.data[i-1];
                    const ext = dest.split('/').pop();
                    if (info.isFile()) {
                        unlinkSync(dest),
                        fi = 'file';
                    } else if (info.isDirectory()) {
                        rmdirSync(dest, {
                            recursive: true
                        }),
                        fo = 'folder';
                    }
                    arrFile.push(i+'. '+ext);
                };
                //$.data = $.data.filter(e=>existsSync(e.dest));
                api.sendMessage(`✅ Đã xóa những ${!!fo && !!fi ? `${fo}. ${fi}`: !!fo?fo: !!fi?fi: null}:\n\n${arrFile.join('\n')}`, event.threadID, event.messageID);
            };
                break;
            case 'send':
                bin(readFileSync(d.dest, 'utf8')).then(link=>api.sendMessage(link, event.threadID, event.messageID))
                break;
            case 'view': {
                let p = d.dest;
                let t;

                if (/\.js$/.test(p))copyFileSync(p, t = p.replace('.js', '.txt'));
                api.sendMessage({
                    attachment: createReadStream(t || p),
                }, event.threadID, _=>unlinkSync(t), event.messageID);
            };
                break;
            case "create": {
                let t;
                fs[(['mkdirSync', 'writeFileSync'][t = /\/$/.test(event.args[1])?0: 1])]($.directory+event.args[1], [, event.args.slice(2).join(' ')][t]);
                api.sendMessage(`✅ Đã tạo ${['folder', 'file'][t]} path: ${event.args[1]}`, event.threadID, event.messageID);
            };
                break;
            case 'copy':
                copyFileSync(d.dest.replace(/(\.|\/)[^./]+$/, (a, b)=>b == '.' && a[0] == '.'?' (COPY) '+a: b == '/' && a[0] == '/'?a+' (COPY)': a));
                api.sendMessage('Done', event.threadID, event.messageID);
                break;
            case 'rename': {
                let new_path = event.args[2];

                if (!new_path)return api.sendMessage('❎ Chưa nhập đường dẫn mới', event.threadID, event.messageID);
                renameSync(d.dest, d.dest.replace(/[^/]+$/, new_path));
                api.sendMessage('Done', event.threadID, event.messageID);
            };
                break;
            case 'zip':
                catbox(zip($.data.filter((e, i)=>event.args.slice(1).includes(String(i+1))).map(e=>e.dest))).then(link=>api.sendMessage(link, event.threadID, event.messageID));
                break;
            default:
                api.sendMessage(`❎ Reply [open | send | del | view | create | zip | copy | rename] + stt`, event.threadID, event.messageID);
            };
        }catch(e) {
            console.error(e);
            api.sendMessage(e.toString(), event.threadID, event.messageID);
        }

    };
    function convertBytes(bytes) {
        let sizes = [
            'Bytes',
            'KB',
            'MB',
            'GB',
            'TB'
        ];
        if (bytes == 0) return '0 Byte';
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };
    function openFolder(a, b, c) {
        let folders_files = readdirSync(c).reduce((o, e)=>(o[statSync(c+'/'+e).isFile()?1: 0].push(e), o), [[], []]).map(e=>e.sort((a, b)=>a.localeCompare(b)));

        let txt = '',
        count = 0;
        array = [],
        bytes_dir = 0;
        for (const i of [...folders_files[0], ...folders_files[1]]) {
            //const start = Date.now();
            const dest = `${c}/${i}`;
            const info = statSync(dest);

            if (info.isDirectory())info.size = size_folder(dest);
            
            bytes_dir += info.size;
            txt += `${++count}. ${info.isFile() ? '📄': info.isDirectory() ? '🗂️': undefined} - ${i} (${convertBytes(info.size)})\n`;
            array.push({
                dest, info
            });
        };
        txt += `\n📊 Tổng dung lượng directory: ${convertBytes(bytes_dir)}\nReply [open | send | del | view | create | zip | copy | rename] + stt`
        a.sendMessage(txt, b.threadID, (err, data) => global.client.handleReply.push({
            name: exports.config.name,
            messageID: data.messageID, author: b.senderID,
            data: array,
            directory: c+'/',
        }), b.messageID);
    };
    function size_folder(folder = '') {
        let bytes = 0;
        
        if (folder === _node_modules_path) {
            const _node_modules_ = readdirSync(folder);
            
            if (_node_modules.length !== _node_modules_.length)(_node_modules = _node_modules_, _node_modules_bytes = undefined);
            if (typeof _node_modules_bytes === 'number' )return _node_modules_bytes;
        };

        for (let file of readdirSync(folder)) try {
            let path = folder + '/' + file;
            let info = statSync(path);

            if (info.isDirectory())bytes += size_folder(path);
            else bytes += info.size;
        } catch {
            continue
        }
        
        if (folder === _node_modules_path)_node_modules_bytes = bytes;
        
        return bytes;
    }

    async function catbox(stream) {
        let formdata = new FormData;

        formdata.append('reqtype', 'fileupload');
        formdata.append('fileToUpload', stream);

        let link = (await axios({
            method: 'POST',
            url: 'https://catbox.moe/user/api.php',
            headers: formdata.getHeaders(),
            data: formdata,
            responseType: 'text',
        })).data;

        return link;
    };

    function zip(source_paths, output_path) {
        let archive = archiver('zip', {
            zlib: {
                level: 9,
            },
        });

        if (output_path) {
            var output = createWriteStream(output_path);
            archive.pipe(output);
        };

        source_paths.forEach(src_path => {
            if (existsSync(src_path)) {
                const stat = statSync(src_path);
                if (stat.isFile())archive.file(src_path, {
                    name: path.basename(src_path)
                });
                else if (stat.isDirectory()) archive.directory(src_path, path.basename(src_path));
            };
        });
        archive.finalize();

        return output_path?new Promise((resolve, reject)=> {
            output.on('close', _=>resolve(output));
            archive.on('error', reject);
        }): (archive.path = 'tmp.zip',
            archive);
    }

    function bin(text) {
        return require('axios')({
            method: 'POST',
            url: 'https://api.mocky.io/api/mock',
            data: {
                "status": 200,
                "content": text,
                "content_type": "text/plain",
                "charset": "UTF-8",
                "secret": "LeMinhTien",
                "expiration": "never"
            },
        }).then(r=>r.data.link);
    }