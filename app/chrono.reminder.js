var https = require('https')
var http = require('http')
var config = require('../config').config

/**
 * Initial Run method.
 * Gets daily sale data from chrono.gg and digests the response.
 * Calls "buildWebhookJson".
 */
function runChronoReminder () {
	if (config.printLogs) console.log('Running Chrono Reminder!')
	https.get('https://api.chrono.gg/sale', (res) => {
		const { statusCode } = res
		const contentType = res.headers['content-type'];
		let error
		if (statusCode !== 200) {
			error = new Error('Request Failed.\n' +
			`Status Code: ${statusCode}`)
		} else if (!/^application\/json/.test(contentType)) {
			error = new Error('Invalid content-type.\n' +
			`Expected application/json but received ${contentType}`)
		}
		if (error) {
			console.error(error.message)
			res.resume()
			return
		}

		res.setEncoding('utf8')
		let rawData = ''
		res.on('data', (chunk) => { rawData += chunk })
		res.on('end', () => {
			try {
				const parsedData = JSON.parse(rawData)
				buildWebhookJson(parsedData)
			} catch (e) {
				console.error(e.message)
			}
		})
	}).on('error', (e) => {
		console.error(`Got error: ${e.message}`)
	})
}

/**
 * Builds the discord webhook json information from sale api response.
 * Calls "sendWebhookFromData"
 * 
 * @param {any} chronoData Digested Data from sale api.
 */
function buildWebhookJson (chronoData) {
	var webhookJson = {
		"username": "Chrono.gg",
		"content": `Daily Chrono Reminder <@&${config.mentionId}>`,
		"embeds": [
			{
				"author": {
					"url": chronoData.url,
					"name": chronoData.name,
				},
				"thumbnail": {
					"url": chronoData.promo_image,
					"width": 184,
					"height": 69
				},
				"description": `Daily Chrono.gg Deal.\n\nName: ${chronoData.name}\nOriginal Price: $${chronoData.normal_price} USD - Discount: ${chronoData.discount}\nSale Price: $${chronoData.sale_price} USD\n\n[chrono.gg](${chronoData.url}) · [Steam Store](${chronoData.steam_url})\n\n\nChrono.gg Hook made by [RenokK](https://twitter.com/RenokK)`,
				"color": "3978880"
			}
		]
	}
	sendWebhookFromData(webhookJson);
}
var request = require('request')

/**
 * Sends the webhookJson to the discod servers webhook URL as defined in the config file.
 * Do people really read code comments?
 * 
 * @param {any} webhookJson Final build of the webhookJson, ready to send and party.
 */
function sendWebhookFromData (webhookJson) {
	var url = config.webhookURL
	request({
		url: url,
		method: "POST",
		json: webhookJson
	}, (error, response, body) => {
		if (config.printLogs) console.log(`ChronoHook done and recieved Status ${response.statusCode}`);
	})
}
var schedule = require('node-schedule');
if (config.printLogs) console.info('Started ChronoHook. Daily reminder now running.');
// Actual run of the code starts here. This is the init or the scheduler that runs the exact time as defined in the config.
// This will then repeat every 24 hours and call the "runChronoReminder" method and get this party rolling gathering the sale api data and sending it to discord.
var cR = schedule.scheduleJob(`${config.schedule.minute} ${config.schedule.hour} * * *`, function () {
	runChronoReminder()
});
