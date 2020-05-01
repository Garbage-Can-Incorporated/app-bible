export interface ISearchResults {
  item: {
    bookTitle: string;
    verses: Array<string>;
    chapterNo: string;
    version: string;
  };
  matches?: Array<{
    value?: string;
    arrayIndex?: number;
    key?: string;
    indices?: Array<any>;
  }>;
  output?: Array<{
    value?: string;
    arrayIndex?: number;
    key?: string;
    indices?: Array<any>;
  }>;
}
