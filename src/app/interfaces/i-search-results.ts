export interface ISearchResults {
  item: {
    bookTitle: string;
    verses: Array<string>;
    chapterNo: string;
    version: string;
  };
  matches: Array<{
    value: string;
    arrayIndex: number;
  }>;
}
