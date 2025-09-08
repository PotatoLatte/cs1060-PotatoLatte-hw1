import { WikipediaSearchResult, WikipediaArticle } from '../types';

const WIKIPEDIA_BASE_URL = 'https://en.wikipedia.org/api/rest_v1';
const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';

export async function searchWikipedia(query: string): Promise<WikipediaSearchResult[]> {
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: query,
    format: 'json',
    origin: '*',
    srlimit: '10'
  });

  const response = await fetch(`${WIKIPEDIA_API_URL}?${params}`);
  const data = await response.json();

  return data.query?.search || [];
}

export async function getWikipediaArticle(pageId: number): Promise<WikipediaArticle> {
  // First get the page title
  const titleParams = new URLSearchParams({
    action: 'query',
    pageids: pageId.toString(),
    format: 'json',
    origin: '*'
  });

  const titleResponse = await fetch(`${WIKIPEDIA_API_URL}?${titleParams}`);
  const titleData = await titleResponse.json();
  const page = titleData.query.pages[pageId];
  const title = page.title;

  // Get page content and extract
  const contentParams = new URLSearchParams({
    action: 'query',
    titles: title,
    prop: 'extracts|revisions',
    exintro: 'true',
    explaintext: 'true',
    exsectionformat: 'plain',
    rvprop: 'content',
    rvslots: 'main',
    format: 'json',
    origin: '*'
  });

  const contentResponse = await fetch(`${WIKIPEDIA_API_URL}?${contentParams}`);
  const contentData = await contentResponse.json();
  
  const pageData = Object.values(contentData.query.pages)[0] as any;
  const extract = pageData.extract || '';
  const content = pageData.revisions?.[0]?.slots?.main?.['*'] || '';

  return {
    pageid: pageId,
    title,
    content: content || extract,
    extract
  };
}