export interface GetDictionaryWordsResType {
  statusCode: number;
  message?: string;
  data: {
    id: number;
    dictionaryId: number;
    title: string;
    translate: string;
    userId: number;
    globalIndex: number;
    index: number;
  }[];
}
