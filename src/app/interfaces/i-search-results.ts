export interface ISearchResults {
  item: {
    bookTitle: string;
    verses: Array<string>;
    chapterNo: string;
    version: string;
  };
  output: Array<{
    value?: string;
    arrayIndex?: number;
  }>;
}
