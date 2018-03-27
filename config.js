var config = {
	'schedule': { // Hour and minute of daily reminder. Default "hour: 20" "minute: 0" makes it run at 20:00 machines time.
		'hour': '20',
		'minute': '0'
	},
	'webhookURL': '', // URL of Discord webhook
	'mentionId': '', // (OPTIONAL) ID of the role you want to mention. See README on how to get this.
	'printLogs': true // Set to false to disable all console.logs. Default: true
}

exports.config = config;
