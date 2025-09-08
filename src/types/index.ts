export interface WikipediaSearchResult {
  pageid: number;
  title: string;
  snippet: string;
}

export interface WikipediaArticle {
  pageid: number;
  title: string;
  content: string;
  extract: string;
}

export interface DictionaryDefinition {
  word: string;
  phonetic?: string;
  phonetics: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
    }>;
  }>;
}