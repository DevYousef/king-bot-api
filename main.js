import axios from 'axios';
import fs from 'fs';
import qs from 'qs';
import cheerio from 'cheerio';
const ci = cheerio;

const gameworld = 'com2';

var msid;
var token;
var sessionID;

async function main() {
	await login();
	// client is logged in
}

async function login(){
	// gets msid
	let { data } = await axios.get('https://mellon-t5.traviangames.com/authentication/login/ajax/form-validate?');
	let $ = ci.load(data);
	let html = $.html();

	let startIndex = html.indexOf('msid');
	let endIndex = html.indexOf('{}', startIndex);
	msid = html.substring(startIndex, endIndex);

	msid = msid.substring(msid.indexOf(',') + 3, msid.lastIndexOf('"'));
	console.log('msid: ' + msid);
	
	// logs in with credentials from file
	var url = `https://mellon-t5.traviangames.com/authentication/login/ajax/form-validate?msid=${msid}&msname=msid`;
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		data: qs.stringify(read_credentials()),
		url,
	};
	
	// gets token
	let res = await axios(options);
	$ = ci.load(res.data);

	let tokenURL = $.html();
	let urlIndex = tokenURL.indexOf('url:');
	let urlEndIndex = tokenURL.indexOf('}', urlIndex);

	tokenURL = tokenURL.substring(urlIndex, urlEndIndex);
	tokenURL = tokenURL.substring(tokenURL.indexOf('\'') + 1, tokenURL.lastIndexOf('\''));
	token = tokenURL.substring(tokenURL.indexOf('token=') + 'token='.length, tokenURL.indexOf('&', tokenURL.indexOf('token')));
	console.log('token: ' + token);

	// opens link to lobby
	let cookies = await axios.get(tokenURL);
	sessionID = cookies.request.path.substring(cookies.request.path.lastIndexOf('=') + 1);
	console.log('sessionID: ' + sessionID);

	// opens gameworld
	let worldURL = `https://${gameworld}.kingdoms.com/api/login.php?token=${token}&msid=${msid}&msname=msid`;
	let worldRes = await axios.get(worldURL);
	let secondWorld = `https://${gameworld}.kingdoms.com/?g_msid=${msid}&tkSessionId=${sessionID}`;
	worldRes = await axios.get(secondWorld);
	$ = ci.load(worldRes.data);
}

		

function read_credentials(){
	let cred = fs.readFileSync('./cred.txt', 'utf-8');
	console.log(cred);
	cred = cred.trim().split(';');
	return { email: cred[0], password: cred[1] };
}

main();

export {};