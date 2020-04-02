# ChronoHook

Simple NodeJS application that loads the daily Chrono.GG deal and sends it to a webhook to display it on a discord server.

![Discord Display Example](https://i.imgur.com/RYIr5fd.png)

### Install and Run

- Download or Clone the Repo
- run `npm i` to install dependencies
- Fill `src/settings/config.ts` with missing information ([see Config](#config))
- run `npm start` to run the app

### Config

To set up your config you need to fill in the `webhookURL`. Everything else can be left as is to have the reminder running.

- `schedule.hour` sets the hour of the reminder
- `schedule.minute` set the minute of the reminder - default values set the reminder to run at 20:00
- `webhookURL` is the URL to your channels webhook - [click here for a guide to create a new webhook url](https://support.discordapp.com/hc/en-us/articles/228383668-Intro-to-Webhooks)
- `mentionId` is the ID of the role that you want to mention - Send `\@rolename` to any channel to get the role ID. - The number between `<@&` and `>` is your desired role id
- `printLogs` is a simple toggle that allows you to disable any `console.logs` from being printed while running this app - critical error will still be printed in case something goes wrong

#### Hints

Run the app in a seperate screen or as service. The embedded scheduler keeps the app alive and runs the reminder every 24 hours.

#### Sidenotes

Feel free to change and modify the code to your liking as long as you do so as described within the license file supplied with this repo.

Also, feel free to remove "made by RenokK" watermark that is at the bottom of the embedded message.

I would appreciate it if you would leave it in there to give me credit but I can't and won't stop you from removing it.
