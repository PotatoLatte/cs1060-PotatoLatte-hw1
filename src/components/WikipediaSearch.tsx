import React, { useState, useEffect } from 'react';
import { Search, Loader } from 'lucide-react';
import { WikipediaSearchResult, WikipediaArticle } from '../types';
import { searchWikipedia, getWikipediaArticle } from '../utils/wikipediaApi';

interface WikipediaSearchProps {
  onArticleSelect: (article: WikipediaArticle) => void;
}

export default function WikipediaSearch({ onArticleSelect }: WikipediaSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WikipediaSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState<number | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults = await searchWikipedia(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleResultClick = async (result: WikipediaSearchResult) => {
    setLoadingArticle(result.pageid);
    try {
      const article = await getWikipediaArticle(result.pageid);
      onArticleSelect(article);
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setLoadingArticle(null);
    }
  };

  return (
    <div>
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search Wikipedia articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Loading indicator for search */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader className="w-5 h-5 animate-spin text-blue-600" />
          <span className="ml-2 text-sm text-gray-600">Searching...</span>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {results.map((result) => (
          <div
            key={result.pageid}
            onClick={() => handleResultClick(result)}
            className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 text-sm leading-tight">
                {result.title}
              </h3>
              {loadingArticle === result.pageid && (
                <Loader className="w-4 h-4 animate-spin text-blue-600 flex-shrink-0 ml-2" />
              )}
            </div>
            <p 
              className="text-xs text-gray-600 mt-1 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: result.snippet }}
            />
          </div>
        ))}
      </div>

      {/* No results message */}
      {query.length >= 2 && !loading && results.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No articles found for "{query}"</p>
          <p className="text-xs mt-1">Try different keywords</p>
        </div>
      )}
    </div>
  );
}