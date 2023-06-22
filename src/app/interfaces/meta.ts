export interface HTMLMetaData {
  title: string;
  description: string;
  keywords?: string;
}

export interface HTMLExtendedData extends HTMLMetaData {
  url?: string;
  image?: string;
}
