import React, { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import WikipediaSearch from './components/WikipediaSearch';
import ArticleContent from './components/ArticleContent';
import DictionaryPopup from './components/DictionaryPopup';
import { WikipediaArticle } from './types';

function App() {
  const [selectedArticle, setSelectedArticle] = useState<WikipediaArticle | null>(null);
  const [dictionaryWord, setDictionaryWord] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  const handleWordClick = (word: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    setPopupPosition({
      x: rect.left + scrollLeft + rect.width / 2,
      y: rect.top + scrollTop - 10
    });
    setDictionaryWord(word);
  };

  const closeDictionaryPopup = () => {
    setDictionaryWord(null);
    setPopupPosition(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">WikiWord</h1>
            <p className="text-gray-600 hidden sm:block">Search Wikipedia • Click words for definitions</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center space-x-2 mb-4">
                <Search className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Search Wikipedia</h2>
              </div>
              <WikipediaSearch onArticleSelect={setSelectedArticle} />
            </div>
          </div>

          {/* Article Content */}
          <div className="lg:col-span-2">
            {selectedArticle ? (
              <ArticleContent 
                article={selectedArticle} 
                onWordClick={handleWordClick}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Start your discovery
                </h3>
                <p className="text-gray-500">
                  Search for a Wikipedia article to begin exploring. Click on any word in the article to see its dictionary definition.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Dictionary Popup */}
      {dictionaryWord && popupPosition && (
        <DictionaryPopup
          word={dictionaryWord}
          position={popupPosition}
          onClose={closeDictionaryPopup}
        />
      )}
    </div>
  );
}

export default App;