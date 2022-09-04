export interface SMS {
  type: string;
  contentType: string;
  countryCode: string;
  from: string;
  content: string;
  messages: [{}];
}
