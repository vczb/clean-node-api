import { MongoClient } from "mongodb";

export const MongoHelper = {
  client: null as MongoClient,
  async connect(url: string, options?: MongoClient["options"]): Promise<void> {
    this.client = await MongoClient.connect(url, options);
  },
  async disconnect(): Promise<void> {
    this.client.close();
  },
};
