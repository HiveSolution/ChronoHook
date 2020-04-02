export interface IWebhookData {
  username: string;
  content: string;
  embeds: IEmbed[];
}

export interface IEmbed {
  author: IAuthor;
  thumbnail: IThumbnail;
  description: string;
  color: string;
}

export interface IAuthor {
  url: string;
  name: string;
}

export interface IThumbnail {
  url: string;
  width: number;
  height: number;
}
