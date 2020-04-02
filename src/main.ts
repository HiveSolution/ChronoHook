import { ChronoHookConfig } from './settings/config';
import { get, request } from 'https';
import { IncomingMessage } from 'http';
import { scheduleJob } from 'node-schedule';
import { IChronoSaleData } from 'interfaces/saleData.interface';
import { IWebhookData } from 'interfaces/webhookData.interface';

/**
 * Main Class to run ChronoHook.
 *
 * @class ChronoHook
 */
class ChronoHook {
  /**
   * User set config.
   *
   * @private
   * @type {ChronoHookConfig}
   * @memberof ChronoHook
   */
  private _config: ChronoHookConfig;

  /**
   * Chrono.gg sale api data.
   *
   * @private
   * @type {IChronoSaleData}
   * @memberof ChronoHook
   */
  private _saleData: IChronoSaleData;

  /**
   * Built and ready for send Discord webhook data.
   *
   * @private
   * @type {IWebhookData}
   * @memberof ChronoHook
   */
  private _webhookData: IWebhookData;
  constructor() {
    this._config = new ChronoHookConfig();
    if (!this._config.printLogs) console.log = () => {};
    this.startSchedule();
  }

  /**
   * Starts up node_schedule to run at user set time.
   *
   * @private
   * @memberof ChronoHook
   */
  private startSchedule() {
    console.log(
      `Starting ChronoReminder at - ${this._config.schedule.hour}:${
        this._config.schedule.minute >= 10
          ? this._config.schedule.minute
          : this._config.schedule.minute + '0'
      }`
    );
    scheduleJob(`${this._config.schedule.minute} ${this._config.schedule.hour} * * *`, () => {
      this.runChronoReminder();
    });
  }

  /**
   * Main run method that calls every other needed method.
   *
   * @private
   * @memberof ChronoHook
   */
  private async runChronoReminder() {
    await this.getChronoSaleData();
    this.buildWebhookData();
    this.sendWebhookFromData();
  }

  /**
   * Fires get request to Chrono.gg API and stores current sale data.
   *
   * @private
   * @returns {Promise<any>}
   * @memberof ChronoHook
   */
  private async getChronoSaleData(): Promise<any> {
    return new Promise(resolve => {
      console.log('Sending Request to chrono.gg');
      get('https://api.chrono.gg/sale', (response: IncomingMessage) => {
        const { statusCode } = response;
        const contentType = response.headers['content-type'];
        let error;
        if (statusCode !== 200) {
          error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error(
            'Invalid content-type.\n' + `Expected application/json but received ${contentType}`
          );
        }
        if (error) {
          console.error(error.message);
          response.resume();
          return;
        }

        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', chunk => {
          rawData += chunk;
        });
        response.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            this._saleData = parsedData;
            resolve();
          } catch (e) {
            console.error(e.message);
          }
        });
      }).on('error', (error: Error) => {
        console.error(`Got error: ${error.message}`);
      });
    });
  }

  /**
   * Generates Discord webhook data and stores it.
   *
   * @private
   * @memberof ChronoHook
   */
  private buildWebhookData() {
    console.log('Building WebhookData');
    const mentionString =
      this._config.mentionId.length > 0
        ? `Daily <@&${this._config.mentionId}>`
        : 'Daily Chrono Reminder';
    this._webhookData = {
      username: 'Chrono.gg',
      content: mentionString,
      embeds: [
        {
          author: {
            url: this._saleData.url,
            name: this._saleData.name,
          },
          thumbnail: {
            url: this._saleData.promo_image,
            width: 184,
            height: 69,
          },
          description: `Daily Chrono.gg Deal.\n\nName: ${this._saleData.name}\nOriginal Price: $${this._saleData.normal_price} USD - Discount: ${this._saleData.discount}\nSale Price: $${this._saleData.sale_price} USD\n\n[chrono.gg](${this._saleData.url}) · [Steam Store](${this._saleData.steam_url})\n\n\nChrono.gg Hook made by [RenokK](https://twitter.com/RenokK)`,
          color: '3978880',
        },
      ],
    };
  }

  /**
   * Sends stored Discord webhook data to user set URL.
   *
   * @private
   * @memberof ChronoHook
   */
  private sendWebhookFromData() {
    console.log('Sending Sale Info to Webhook');
    const url = this._config.webhookURL;
    const path = url.split('discordapp.com')[1];

    const req = request(
      {
        host: 'discordapp.com',
        path: path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      response => {
        console.log(`ChronoHook done and recieved Status ${response.statusCode}`);
      }
    ).on('error', (error: Error) => {
      console.error(`Got error: ${error.message}`);
    });
    req.write(JSON.stringify(this._webhookData));
    req.end();
  }
}

// Main Entry Point
const chronoHook = new ChronoHook();
