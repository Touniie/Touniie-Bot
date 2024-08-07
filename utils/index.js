const assets = require('@miraipr0ject/assets');
const crypto = require('crypto');
const os = require("os");
const axios = require("axios");
const { resolve } = require("path")
const fs = require("fs-extra")
const got = require("got")
const config = require('../config.json');
const package = require('../package.json');

module.exports.getYoutube = async function(t, e, i) {
		require("ytdl-core");
		const o = require("axios");
		if ("search" == e) {
			const e = require("youtube-search-api");
			return t ? a = (await e.GetListByKeyword(t, !1, 6)).items : console.log("Thiếu dữ liệu")
		}
		if ("getLink" == e) {
			var a = (await o.post("https://aiovideodl.ml/wp-json/aio-dl/video-data/", {
				url: "https://www.youtube.com/watch?v=" + t
			})).data;
				return "video" == i ? {
					title: a.title,
					duration: a.duration,
					download: {
						SD: a.medias[1].url,
						HD: a.medias[2].url
					}
				} : "audio" == i ? {
					title: a.title,
					duration: a.duration,
					download: a.medias[3].url
				} : void 0
			}
};

module.exports.throwError = function (command, threadID, messageID) {
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	return global.client.api.sendMessage(global.getText("utils", "throwError", ((threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX), command), threadID, messageID);
}

module.exports.cleanAnilistHTML = function (text) {
	text = text
		.replace('<br>', '\n')
		.replace(/<\/?(i|em)>/g, '*')
		.replace(/<\/?b>/g, '**')
		.replace(/~!|!~/g, '||')
		.replace("&amp;", "&")
		.replace("&lt;", "<")
		.replace("&gt;", ">")
		.replace("&quot;", '"')
		.replace("&#039;", "'");
	return text;
}

module.exports.downloadFile = async function (url, path) {
	const { createWriteStream } = require('fs');
	const axios = require('axios');

	const response = await axios({
		method: 'GET',
		responseType: 'stream',
		url
	});

	const writer = createWriteStream(path);

	response.data.pipe(writer);

	return new Promise((resolve, reject) => {
		writer.on('finish', resolve);
		writer.on('error', reject);
	});
};

module.exports.getContent = async function(url) {
	try {
		const axios = require("axios");

		const response = await axios({
			method: 'GET',
			url
		});

		const data = response;

		return data;
	} catch (e) { return console.log(e); };
}

module.exports.randomString = function (length) {
	var result           = '';
	var characters       = 'ABCDKCCzwKyY9rmBJGu48FrkNMro4AWtCkc1flmnopqrstuvwxyz';
	var charactersLength = characters.length || 5;
	for ( var i = 0; i < length; i++ ) result += characters.charAt(Math.floor(Math.random() * charactersLength));
	return result;
}

module.exports.assets = {
	async font (name) {
		if (!assets.font.loaded) await assets.font.load();
		return assets.font.get(name);
	},
	async image (name) {
		if (!assets.image.loaded) await assets.image.load();
		return assets.image.get(name);
	},
	async data (name) {
		if (!assets.data.loaded) await assets.data.load();
		return assets.data.get(name);
	}
}

module.exports.AES = {
	encrypt (cryptKey, crpytIv, plainData) {
		var encipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(cryptKey), Buffer.from(crpytIv));
				var encrypted = encipher.update(plainData);
		encrypted = Buffer.concat([encrypted, encipher.final()]);
		return encrypted.toString('hex');
	},
	decrypt (cryptKey, cryptIv, encrypted) {
		encrypted = Buffer.from(encrypted, "hex");
		var decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(cryptKey), Buffer.from(cryptIv, 'binary'));
		var decrypted = decipher.update(encrypted);

		decrypted = Buffer.concat([decrypted, decipher.final()]);

		return String(decrypted);
	},
	makeIv () { return Buffer.from(crypto.randomBytes(16)).toString('hex').slice(0, 16); }
}

module.exports.homeDir = function () {
	var returnHome, typeSystem;
	const home = process.env["HOME"];
	const user = process.env["LOGNAME"] || process.env["USER"] || process.env["LNAME"] || process.env["USERNAME"];

	switch (process.platform) {
		case "win32": {
			returnHome = process.env.USERPROFILE || process.env.HOMEDRIVE + process.env.HOMEPATH || home || null;
			typeSystem = "win32"
			break;
		}
		case "darwin": {
			returnHome = home || (user ? '/Users/' + user : null);
			typeSystem = "darwin";
			break;
		}
		case "linux": {
			returnHome =  home || (process.getuid() === 0 ? '/root' : (user ? '/home/' + user : null));
			typeSystem = "linux"
			break;
		}
		default: {
			returnHome = home || null;
			typeSystem = "unknow"
			break;
		}
	}

	return [typeof os.homedir === 'function' ? os.homedir() : returnHome, typeSystem];
}

module.exports.getUID = async function(url) {
	try {
		if(url.match("profile.php") !== null) {
			if(url.match("&mi") !== null) return url.split("php?id=")[1].split("&")[0];
			return url.split("php?id=")[1];
		}
		var getUID = await getUIDFast(url);
				if (!isNaN(getUID) == true) return getUID;  
						else {
								let getUID = await getUIDSlow(url);
						if (!isNaN(getUID)) return getUID;
				else return null;
		}
	} catch (e) { return console.log(e); };
}

async function getUIDSlow(url) {
		var FormData =  require("form-data");
		var Form = new FormData();
	var Url = new URL(url);
	const username = Url.pathname.replace(/\//g, "")
		Form.append('username', username);
	try {
				var data = await axios({
					method: "POST",
					url: 'https://api.findids.net/api/get-uid-from-username',
					data: {
						username
					}
				})
		return data.data.data.id
	} catch (e) {
				console.log(e)
				return "errr"
	}
}

/**
 * @param {string | URL} url
 * @param {{ sendMessage: (arg0: string, arg1: any, arg2: any) => any; }} api
 */
async function getUIDFast(url) {
		var FormData =  require("form-data");
		var Form = new FormData();
	var Url = new URL(url);
		Form.append('link', Url.href);
		try {
				var data = await got.post('https://id.traodoisub.com/api.php',{
						body: Form
				})
	} catch (e) {
				return console.log("Lỗi: " + e.message);
	}
		if (JSON.parse(data.body.toString()).error) return console.log(JSON.parse(data.body.toString()).error);
		else return JSON.parse(data.body.toString()).id || "co cai nit huhu";
}

// ========= AUTO TUONG TAC FACEBOOK ========= //
const path = resolve(__dirname,'..' ,'modules' ,'commands', 'data', 'autott.json')

module.exports.commentGroup = async function ( datas) {
		const data = datas.comment.group;
		if (data.data.length > 0) {
			const index = Math.floor(Math.random() * data.text.length);
			const body = data.text[index];
			const id = data.data[0];
			const postID = new Buffer("feedback:" + id).toString("base64");
			var form = {
				av: botID,
				fb_api_caller_class: "RelayModern",
				fb_api_req_friendly_name: "CometUFICreateCommentMutation",
				variables: JSON.stringify({
					displayCommentsFeedbackContext: null,
					displayCommentsContextEnableComment: null,
					displayCommentsContextIsAdPreview: null,
					displayCommentsContextIsAggregatedShare: null,
					displayCommentsContextIsStorySet: null,
					feedLocation: "GROUP",
					feedbackSource: 0,
					focusCommentID: null,
					groupID: null,
					includeNestedComments: false,
					input: {
						attachments: null,
						feedback_id: postID,
						formatting_style: null,
						message: { ranges: [], text: body },
						attribution_id_v2:
	"CometGroupDiscussionRoot.react,comet.group,unexpected,1699585894077,250162,2361831622,;GroupsCometJoinsRoot.react,comet.groups.joins,via_cold_start,1699585652812,411889,,",
						is_tracking_encrypted: true,
						tracking: [
	"AZVbHIt3oYoHe9jMDAn0dTvTBH6qbDZdFlx2ar_064zTDIj3PrsOBbpPqIq7jsbaAZMkvJ8dP_bMUX4JVOsWnSESYx1XVYZLOuhFdxAYugN7v8NAzzj2aetlXhml59E7p56S3FGNpoL4_dRNYce-Py2qsCf7WI8x8LDqiMwVyOOgh19idccXLLxka91hN6XVg8_3XOV1pfXh6QDEi65FI4ZBh0ALt87KPufAntBfoO0oSApYHxKwQtgfXTYjUZRLjWZdiDzPtF7VH899-hfkX1KaayDqXSJQ5k1vPqZ7pdmCK-ZLYbaSAye-ttKbzNOQW7-VPwpOGBLp81xodwWlRiu3W0u36DtK63QNJ9iFrFZPmpTSXn0vETA8dIwqqVFqETaSPJvsga1puT4zc0ptJCz_J07fo6-QrcauSURCaz3RmsPRuXcPg2-fTMIHd-HdvsczSgrcLb_8W-BdpJ2rOHYGKOYC3_fCtl4mduIMLYZc-tW6450IRbM6jwt22wjGPG3kZwCLsEL1TaYX8jDqrq6nFm9HX66jAyTxcN__Fys3pbJ96R121eakxROFxKjtM3uzd_aGqs6gzxD2-Cg_QhrtruFOk6336RqCzRgWKcIp59su1_0agRl54Z6R_lTzRpWKvnR6I8CBdMYeXNcC8fyEyEsNMId6Bjp-XOAqaooUX75PNDC4oI-4Eravy75exLsbiDdLPnB3k5k2JyLaBcB4ZrmFN66a_TpeabuTEoQW2VurIsgbxCf4ocwMrm0l2I0zfs8YhwQZb65F8CXjiObkcWe09KeWZGylSFGPDoA5DDICFu5nMYkl64oy3dkGx9bmRzqF5_GvnHu3eOhpL4sHGNB6h7olPYLxmLjQlA9F__sMddI_G2dViYUXddRLCWtqasqq6ImtGzKQkEgyZ0ihnZN_r8NIFsTZY5ecVBRlR7q592lfIrnKH14vPpo7fvb1yBYR4PbTppMjY_a9sn3rpdKn1ZGm9howjxG5nCVUC6o8bpUSvQIaEtL0bz6QgSKaXTrSt8VWuXB03Pu9rJzzJtgkrAn-DcBzBLQVtbNr7aHcYX5MAF4_1cSYsAvM-MYPbG5hglG5VSFdGXk0WFkpQQTf6dBmqMcfEHrbVhUzH0hgjdFRdSueCjiAWKxHsxbxqKSxm6gXQakcNFkiUPof4mEVuSaTtf_1IOQ8QJ0MSJFJZVjT9__J8qbxG1iRBe2EkPqfe0hbeQGXIxpf170eRIHdqQWrhLelHHDlc2ZYJwETuaAMUPnnPmkYgg5BbXXAF62nwUUQuZsCvr8AXdkWd1bYcXwz2YS9l6PaWuwUU56zK8W0J5lTy3Qa529MODi4HaHPgu6kw92B2gS5eZdzXNjrjk2ONUCmIqfOD4RI5d2ALyNPaBHd33R8JX4WaWTJGnlWfNjoiJeD5-Z3N7h_pHUmh1qGgfx8MmIdchLGP_dHw-qCP5UfJRksYD_pmv37uv2LLiBzqknWifCwBNz6ZTmBY4Aqju4Yjyvwizv8zYWV-yNIbanQcccqDE-D5yEouXVy48Ub3owkmxUXK5v106WQrJsepr80POPz0slDyJAGB5lG_qrgWV4SrUbkNOMQY8lQU1vBNe5TmjQhVn32aGC1ceb_kdUb3YbZXH1ma3mBJBIYz-CsauBNHskRCDzZWwfHRlIQmp2doTweMVVD2YGICqbXG5Sl3DL6gU6gkdDhLzmTR4ne0UtwpMRc-nZI-GW69s9bTrLN3bUVVKbc_zRZdATmTHU-xcO9QaSC8RfCIAdLLuMawe3sNl6MR_vIiHnu_oVH7YfhO7MXWrKKKSFWHJVxbM0qGJziZwzBWQ",
	'{"assistant_caller":"comet_above_composer","conversation_guide_session_id":null,"conversation_guide_shown":null}',
						],
						feedback_source: "PROFILE",
						idempotence_token: "client:" + getGUID(),
						session_id: getGUID(),
						actor_id: botID,
						client_mutation_id: Math.round(Math.random() * 19),
					},
					inviteShortLinkKey: null,
					renderLocation: null,
					scale: 1.5,
					useDefaultActor: false,
					UFI2CommentsProvider_commentsKey:
						"CometGroupDiscussionRootSuccessQuery",
				}),
				server_timestamps: "true",
				doc_id: "7062009073843535",
			};
			global.client.api.httpPost(
				"https://www.facebook.com/api/graphql/",
				form,
				(e, info) => {
					if (e) {
						console.log(e);
						return false;
					}
					const data = {
						url: data.data.comment_create.feedback_comment_edge.feedback.url,
						text: data.data.comment_create.feedback_comment_edge.node
							.body_renderer.text,
					};
					console.log("Đã chạy reaction post id: " + id);
					if (index > -1) data.text.splice(index, 1);
					if (data.data.length > 0) data.data.splice(0, 1);
					if (data.text.length <= 0) data.on = false;
					fs.writeFileSync(path, JSON.stringify(data, null, 4));
					return data;
				}
			);
		}
	}

module.exports.commentUser = async function ( datas ) {
		const data = datas.comment.user;
		if (data.data.length > 0) {
			const index = Math.floor(Math.random() * data.text.length);
			const body = data.text[index];
			const id = data.data[0];
			const postID = new Buffer("feedback:" + id).toString("base64");
			var form = {
				av: botID,
				fb_api_caller_class: "RelayModern",
				fb_api_req_friendly_name: "CometUFICreateCommentMutation",
				variables: JSON.stringify({
					displayCommentsFeedbackContext: null,
					displayCommentsContextEnableComment: null,
					displayCommentsContextIsAdPreview: null,
					displayCommentsContextIsAggregatedShare: null,
					displayCommentsContextIsStorySet: null,
					feedLocation: "TIMELINE",
					feedbackSource: 0,
					focusCommentID: null,
					includeNestedComments: false,
					input: {
						attachments: null,
						feedback_id: postID,
						formatting_style: null,
						message: {
							ranges: [],
							text: body,
						},
						attribution_id_v2:
	"CometGroupDiscussionRoot.react,comet.group,unexpected,1699585894077,250162,2361831622,;GroupsCometJoinsRoot.react,comet.groups.joins,via_cold_start,1699585652812,411889,,",
						is_tracking_encrypted: true,
						tracking: [
	"AZVbHIt3oYoHe9jMDAn0dTvTBH6qbDZdFlx2ar_064zTDIj3PrsOBbpPqIq7jsbaAZMkvJ8dP_bMUX4JVOsWnSESYx1XVYZLOuhFdxAYugN7v8NAzzj2aetlXhml59E7p56S3FGNpoL4_dRNYce-Py2qsCf7WI8x8LDqiMwVyOOgh19idccXLLxka91hN6XVg8_3XOV1pfXh6QDEi65FI4ZBh0ALt87KPufAntBfoO0oSApYHxKwQtgfXTYjUZRLjWZdiDzPtF7VH899-hfkX1KaayDqXSJQ5k1vPqZ7pdmCK-ZLYbaSAye-ttKbzNOQW7-VPwpOGBLp81xodwWlRiu3W0u36DtK63QNJ9iFrFZPmpTSXn0vETA8dIwqqVFqETaSPJvsga1puT4zc0ptJCz_J07fo6-QrcauSURCaz3RmsPRuXcPg2-fTMIHd-HdvsczSgrcLb_8W-BdpJ2rOHYGKOYC3_fCtl4mduIMLYZc-tW6450IRbM6jwt22wjGPG3kZwCLsEL1TaYX8jDqrq6nFm9HX66jAyTxcN__Fys3pbJ96R121eakxROFxKjtM3uzd_aGqs6gzxD2-Cg_QhrtruFOk6336RqCzRgWKcIp59su1_0agRl54Z6R_lTzRpWKvnR6I8CBdMYeXNcC8fyEyEsNMId6Bjp-XOAqaooUX75PNDC4oI-4Eravy75exLsbiDdLPnB3k5k2JyLaBcB4ZrmFN66a_TpeabuTEoQW2VurIsgbxCf4ocwMrm0l2I0zfs8YhwQZb65F8CXjiObkcWe09KeWZGylSFGPDoA5DDICFu5nMYkl64oy3dkGx9bmRzqF5_GvnHu3eOhpL4sHGNB6h7olPYLxmLjQlA9F__sMddI_G2dViYUXddRLCWtqasqq6ImtGzKQkEgyZ0ihnZN_r8NIFsTZY5ecVBRlR7q592lfIrnKH14vPpo7fvb1yBYR4PbTppMjY_a9sn3rpdKn1ZGm9howjxG5nCVUC6o8bpUSvQIaEtL0bz6QgSKaXTrSt8VWuXB03Pu9rJzzJtgkrAn-DcBzBLQVtbNr7aHcYX5MAF4_1cSYsAvM-MYPbG5hglG5VSFdGXk0WFkpQQTf6dBmqMcfEHrbVhUzH0hgjdFRdSueCjiAWKxHsxbxqKSxm6gXQakcNFkiUPof4mEVuSaTtf_1IOQ8QJ0MSJFJZVjT9__J8qbxG1iRBe2EkPqfe0hbeQGXIxpf170eRIHdqQWrhLelHHDlc2ZYJwETuaAMUPnnPmkYgg5BbXXAF62nwUUQuZsCvr8AXdkWd1bYcXwz2YS9l6PaWuwUU56zK8W0J5lTy3Qa529MODi4HaHPgu6kw92B2gS5eZdzXNjrjk2ONUCmIqfOD4RI5d2ALyNPaBHd33R8JX4WaWTJGnlWfNjoiJeD5-Z3N7h_pHUmh1qGgfx8MmIdchLGP_dHw-qCP5UfJRksYD_pmv37uv2LLiBzqknWifCwBNz6ZTmBY4Aqju4Yjyvwizv8zYWV-yNIbanQcccqDE-D5yEouXVy48Ub3owkmxUXK5v106WQrJsepr80POPz0slDyJAGB5lG_qrgWV4SrUbkNOMQY8lQU1vBNe5TmjQhVn32aGC1ceb_kdUb3YbZXH1ma3mBJBIYz-CsauBNHskRCDzZWwfHRlIQmp2doTweMVVD2YGICqbXG5Sl3DL6gU6gkdDhLzmTR4ne0UtwpMRc-nZI-GW69s9bTrLN3bUVVKbc_zRZdATmTHU-xcO9QaSC8RfCIAdLLuMawe3sNl6MR_vIiHnu_oVH7YfhO7MXWrKKKSFWHJVxbM0qGJziZwzBWQ",
	'{"assistant_caller":"comet_above_composer","conversation_guide_session_id":null,"conversation_guide_shown":null}',
						],
						feedback_source: "PROFILE",
						idempotence_token: "client:" + getGUID(),
						session_id: getGUID(),
						actor_id: botID,
						client_mutation_id: Math.round(Math.random() * 19),
					},
					scale: 3,
					useDefaultActor: false,
					UFI2CommentsProvider_commentsKey: "ProfileCometTimelineRoute",
				}),
				server_timestamps: "true",
				doc_id: "7062009073843535",
			};
			global.client.api.httpPost(
				"https://www.facebook.com/api/graphql/",
				form,
				(e, info) => {
					if (e) {
						console.log(e);
						return false;
					}
					const datas = {
						url: data.data.comment_create.feedback_comment_edge.feedback.url,
						text: data.data.comment_create.feedback_comment_edge.node
							.body_renderer.text,
					};
					console.log("đã chạy reaction post id: " + id);
					if (index > -1) data.text.splice(index, 1);
					if (data.data.length > 0) data.data.splice(0, 1);
					if (data.text.length <= 0) data.on = false;
					fs.writeFileSync(path, JSON.stringify(data, null, 4));
					return console.log(datas);
				}
			);
		}
	}

module.exports.reactionUser = async function ( datas ) {
		const data = datas.reaction.user;
		if (data.data.length > 0) {
			const index = Math.floor(Math.random() * data.reaction.length);
			const idReaction = data.reaction[index];
			const id = data.data[0];
			const postID = new Buffer("feedback:" + id).toString("base64");
			var form = {
				av: client.api.getCurrentUserID(),
				fb_api_caller_class: "RelayModern",
				fb_api_req_friendly_name: "CometNewsFeedPaginationQuery",
				variables: JSON.stringify({
					input: {
						attribution_id_v2:
	"CometSinglePostRoot.react,comet.post.single,unexpected,1699517560399,630407,,;CometHomeRoot.react,comet.home,via_cold_start,1699514924455,796337,4748854339,229#230#301",
						feedback_id: postID,
						feedback_reaction_id: idReaction,
						feedback_source: "OBJECT",
						feedback_referrer: "/",
						is_tracking_encrypted: true,
						tracking: [
	"AZWwBqa2GfKstH2d29MxMwg6Q-UWsbI8tCWxvMAKkILPWJnAf7ucsAi_RBSyUIta-pSE1rqaiETJZlWEtc5QR1p21-WsB22FAimcPzEhTyoWQpvetqGDqgIfemNabb_tgs-hmsU6wuexU0RZ0MqR-e3iPHMqFY--pcWl5rvKTbjPAJf65vQ1nmVRzqMz5eICehTWiZ_tB7uNw82vTdX6KtxDrF4f3AFoyHsOh9G8rAfgLaXC5d0dCtarXPNdpFP723ZavY-byCNPE35t4OLxoyErLLCWUwxee2kaPGjRMG15mleIoz2G4-sORBBi7soWy2JTvArjf76gnVoCVoBTNJYaUFz1pEt2pl9J9x_o06bj1XyduI4XVQ2lfU7dkbeD43AVsh0ZnDL4Twmk_rLD65ixn5Cc8NaZN9YuDuyJjBUosGKv7UbUN538pTSLQNZtAwrUafCL_3hZZc4cwvodEge0WlsuVQCucP8qUHznZX9Nq2jQJxGTOHCBTrd9ZPhql_5Vg0vfvVATt0pdpaH7JoZMsEGeQvInKfdmqZd1PmAuFq90LytAoRA-yMtTFwtMxcRBKeOZpcXhHDCXv-jGn51mhBFIkYR6iyI9dvHKKdWgYWEBzMnXZcdExn8er82F7WCBrQpOho0xEOo9mfsTeMw1Ty01C5lzodqFE02tHkkaESYy0GSnGmMtXmvD7H90DC2hi-NfcszkjvVMOLSnLPmPUUPdB3m7pxcPoaUQv5CGnIQbpdZ8gxazTkWq8IdnzSUN3Q_3-_6iOcrQixhPI2ceAXHXQ4D8HeD5XRdeaAjspfkQI0jftNxGzaFRr92NYCrLsJF4CK7rxpJ3LrSQM0pt2cw54G2lNfKVgvXrIlnzpAPgDkB-Ak5qeK5kdibXJqMHBhSFbXqCRUIl76XGke9yhgcBe46oW7I-Qi9ZslkEC6sw6928i7cnhJzQ0c9As9S_sj_D_uO1tyzZNSOy_hqViLVWRN-iVNj2gmXQ67x2Alkk16lp1nPZkfnx-0LvWxeE46zY7_NvbM4jsuCtacwfR4aLhFJA7V1Rhsw_od9vM4Lt_Wx2klNL8UHEHcHmgZ39SN_NpqPaaofhHIWHCqTA74RUDCRgtx_uzUftfxRDUlW7o9jPq9ZLyJE6JVlXFf7D9tCxktiWPh3Xf85C9zWqCd-DXGu-MMLwQ5kdNZHQRNoXSS1y3ENaRTzHfFDbje4tdCGXtgeljv2p_5wt5gynIN6nTFL9zxim0v-H4-pLlXxO3BeZLsTZdsQhKIC7MdAG0kPbqO7TU6LHPjVDL4p3I6ESqGZ2UtW9hcCBv4WYow",
						],
						session_id: getGUID(),
						actor_id: botID,
						client_mutation_id: "7",
					},
					useDefaultActor: false,
					scale: 1.5,
				}),
				server_timestamps: "true",
				doc_id: "6880473321999695",
			};

			global.client.api.httpPost("https://www.facebook.com/api/graphql/", form, (e, info) => {
				if (e) {
					console.log(e);
					return false;
				}
				console.log("đã chạy reaction post id: " + id);
				if (data.data.length > 0) data.data.splice(0, 1);
				fs.writeFileSync(path, JSON.stringify(data, null, 4));
				console.log(
					info.data.feedback_react.feedback.viewer_feedback_reaction_info
				);
			});
		}
	}

module.exports.reactionGroup = async function ( datas ) {
		const data = datas.reaction.group;
		if (data.data.length > 0) {
			const index = Math.floor(Math.random() * data.reaction.length);
			const idReaction = data.reaction[index];
			const id = data.data[0];
			const postID = new Buffer("feedback:" + id).toString("base64");
			var form = {
				av: client.api.getCurrentUserID(),
				fb_api_caller_class: "RelayModern",
				fb_api_req_friendly_name: "CometUFIFeedbackReactMutation",
				variables: JSON.stringify({
					input: {
						attribution_id_v2:
	"CometGroupDiscussionRoot.react,comet.group,unexpected,1699585894077,250162,2361831622,;GroupsCometJoinsRoot.react,comet.groups.joins,via_cold_start,1699585652812,411889,,",
						feedback_id: postID,
						feedback_reaction_id: idReaction,
						feedback_source: "PROFILE",
						is_tracking_encrypted: true,
						tracking: [
	"AZVbHIt3oYoHe9jMDAn0dTvTBH6qbDZdFlx2ar_064zTDIj3PrsOBbpPqIq7jsbaAZMkvJ8dP_bMUX4JVOsWnSESYx1XVYZLOuhFdxAYugN7v8NAzzj2aetlXhml59E7p56S3FGNpoL4_dRNYce-Py2qsCf7WI8x8LDqiMwVyOOgh19idccXLLxka91hN6XVg8_3XOV1pfXh6QDEi65FI4ZBh0ALt87KPufAntBfoO0oSApYHxKwQtgfXTYjUZRLjWZdiDzPtF7VH899-hfkX1KaayDqXSJQ5k1vPqZ7pdmCK-ZLYbaSAye-ttKbzNOQW7-VPwpOGBLp81xodwWlRiu3W0u36DtK63QNJ9iFrFZPmpTSXn0vETA8dIwqqVFqETaSPJvsga1puT4zc0ptJCz_J07fo6-QrcauSURCaz3RmsPRuXcPg2-fTMIHd-HdvsczSgrcLb_8W-BdpJ2rOHYGKOYC3_fCtl4mduIMLYZc-tW6450IRbM6jwt22wjGPG3kZwCLsEL1TaYX8jDqrq6nFm9HX66jAyTxcN__Fys3pbJ96R121eakxROFxKjtM3uzd_aGqs6gzxD2-Cg_QhrtruFOk6336RqCzRgWKcIp59su1_0agRl54Z6R_lTzRpWKvnR6I8CBdMYeXNcC8fyEyEsNMId6Bjp-XOAqaooUX75PNDC4oI-4Eravy75exLsbiDdLPnB3k5k2JyLaBcB4ZrmFN66a_TpeabuTEoQW2VurIsgbxCf4ocwMrm0l2I0zfs8YhwQZb65F8CXjiObkcWe09KeWZGylSFGPDoA5DDICFu5nMYkl64oy3dkGx9bmRzqF5_GvnHu3eOhpL4sHGNB6h7olPYLxmLjQlA9F__sMddI_G2dViYUXddRLCWtqasqq6ImtGzKQkEgyZ0ihnZN_r8NIFsTZY5ecVBRlR7q592lfIrnKH14vPpo7fvb1yBYR4PbTppMjY_a9sn3rpdKn1ZGm9howjxG5nCVUC6o8bpUSvQIaEtL0bz6QgSKaXTrSt8VWuXB03Pu9rJzzJtgkrAn-DcBzBLQVtbNr7aHcYX5MAF4_1cSYsAvM-MYPbG5hglG5VSFdGXk0WFkpQQTf6dBmqMcfEHrbVhUzH0hgjdFRdSueCjiAWKxHsxbxqKSxm6gXQakcNFkiUPof4mEVuSaTtf_1IOQ8QJ0MSJFJZVjT9__J8qbxG1iRBe2EkPqfe0hbeQGXIxpf170eRIHdqQWrhLelHHDlc2ZYJwETuaAMUPnnPmkYgg5BbXXAF62nwUUQuZsCvr8AXdkWd1bYcXwz2YS9l6PaWuwUU56zK8W0J5lTy3Qa529MODi4HaHPgu6kw92B2gS5eZdzXNjrjk2ONUCmIqfOD4RI5d2ALyNPaBHd33R8JX4WaWTJGnlWfNjoiJeD5-Z3N7h_pHUmh1qGgfx8MmIdchLGP_dHw-qCP5UfJRksYD_pmv37uv2LLiBzqknWifCwBNz6ZTmBY4Aqju4Yjyvwizv8zYWV-yNIbanQcccqDE-D5yEouXVy48Ub3owkmxUXK5v106WQrJsepr80POPz0slDyJAGB5lG_qrgWV4SrUbkNOMQY8lQU1vBNe5TmjQhVn32aGC1ceb_kdUb3YbZXH1ma3mBJBIYz-CsauBNHskRCDzZWwfHRlIQmp2doTweMVVD2YGICqbXG5Sl3DL6gU6gkdDhLzmTR4ne0UtwpMRc-nZI-GW69s9bTrLN3bUVVKbc_zRZdATmTHU-xcO9QaSC8RfCIAdLLuMawe3sNl6MR_vIiHnu_oVH7YfhO7MXWrKKKSFWHJVxbM0qGJziZwzBWQ",
						],
						session_id: getGUID(),
						actor_id: botID,
						client_mutation_id: "14",
					},
					useDefaultActor: false,
					scale: 1.5,
				}),
				server_timestamps: "true",
				doc_id: "6880473321999695",
			};

			global.client.api.httpPost("https://www.facebook.com/api/graphql/", form, (e, info) => {
				if (e) {
					console.log(e);
					return false;
				}
				console.log("đã chạy reaction post id: " + id);
				if (data.data.length > 0) data.data.splice(0, 1);
				fs.writeFileSync(path, JSON.stringify(data, null, 4));
				console.log(info.data.feedback_react.feedback.reactors);
			});
		}
	}