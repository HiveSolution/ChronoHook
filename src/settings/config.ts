/**
 * Defines the config used by ChronoHook
 * for more details, see variable Docs below.
 *
 * @export
 * @class ChronoHookConfig
 */
export class ChronoHookConfig {
  /**
   * Hour and minute of daily reminder,
   * Default makes it run at 20:00 machines time.
   *
   * @default: {hour: 20, minute: 0}
   * @memberof ChronoHookConfig
   */
  public schedule = {
    hour: 20,
    minute: 0,
  };

  /**
   * URL of Discord webhook.
   *
   * @memberof ChronoHookConfig
   */
  public webhookURL = '';

  /**
   * (OPTIONAL) ID of the role you want to mention.
   * Leave empty if you don't want to mention a specific role.
   * See README.md for details on how to a mentionID.
   *
   * @memberof ChronoHookConfig
   */
  public mentionId = '';

  /**
   * Set to false to disable all console.logs.
   * @default: true
   * @memberof ChronoHookConfig
   */
  public printLogs = true;
}
