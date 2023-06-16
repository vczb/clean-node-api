import { Collection, MongoClient } from "mongodb";

export const MongoHelper = {
  client: null as MongoClient,
  async connect(url: string, options?: MongoClient["options"]): Promise<void> {
    this.client = await MongoClient.connect(url, options);
  },
  async disconnect(): Promise<void> {
    this.client.close();
  },
  getCollection(name: string): Collection {
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
