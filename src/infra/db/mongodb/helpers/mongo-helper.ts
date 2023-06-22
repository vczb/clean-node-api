import { Collection, MongoClient } from "mongodb";

export const MongoHelper = {
  client: null as MongoClient,
  url: null as string,
  async connect(url: string, options?: MongoClient["options"]): Promise<void> {
    this.url = url;
    this.client = await MongoClient.connect(url, options);
  },
  async disconnect(): Promise<void> {
    this.client.close();
    this.client = null;
    // this.url = null;
  },
  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.url);
    }
    return this.client.db().collection(name);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map(collection: any): any {
    const { _id, ...collectionWithoutId } = collection;
    return {
      id: _id,
      ...collectionWithoutId,
    };
  },
};
