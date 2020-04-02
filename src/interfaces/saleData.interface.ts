export interface IChronoSaleData {
  name: string;
  url: string;
  unique_url: string;
  steam_url: string;
  og_image: string;
  platforms: string[];
  promo_image: string;
  normal_price: string;
  discount: string;
  sale_price: string;
  start_date: string;
  items: IItem[];
  end_date: string;
  currency: string;
}

export interface IItem {
  type: string;
  id: string;
}
