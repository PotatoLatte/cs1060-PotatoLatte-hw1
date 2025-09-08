import { DictionaryDefinition } from '../types';

const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export async function getDictionaryDefinition(word: string): Promise<DictionaryDefinition> {
  const response = await fetch(`${DICTIONARY_API_URL}/${encodeURIComponent(word)}`);
  
  if (!response.ok) {
    throw new Error('Definition not found');
  }

  const data = await response.json();
  
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Definition not found');
  }

  return data[0];
}