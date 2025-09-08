import React, { useState, useEffect } from 'react';
import { X, Volume2, Loader, BookOpen } from 'lucide-react';
import { DictionaryDefinition } from '../types';
import { getDictionaryDefinition } from '../utils/dictionaryApi';

interface DictionaryPopupProps {
  word: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export default function DictionaryPopup({ word, position, onClose }: DictionaryPopupProps) {
  const [definition, setDefinition] = useState<DictionaryDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDefinition = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const def = await getDictionaryDefinition(word);
        setDefinition(def);
      } catch (err) {
        setError('Definition not found');
      } finally {
        setLoading(false);
      }
    };

    fetchDefinition();
  }, [word]);

  const playPronunciation = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(console.error);
  };

  // Calculate popup position to stay within viewport
  const getPopupStyle = () => {
    const popupWidth = 320;
    const popupMaxHeight = 400;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = position.x - popupWidth / 2;
    let top = position.y - 10;

    // Adjust horizontal position
    if (left < 10) left = 10;
    if (left + popupWidth > viewportWidth - 10) left = viewportWidth - popupWidth - 10;

    // Adjust vertical position
    if (top < 10) {
      top = position.y + 30; // Show below the word if too close to top
    } else if (top + popupMaxHeight > viewportHeight - 10) {
      top = Math.max(10, position.y - popupMaxHeight - 10); // Show above the word
    }

    return {
      position: 'absolute' as const,
      left: `${left}px`,
      top: `${top}px`,
      zIndex: 1000,
    };
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 z-[999]"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div 
        style={getPopupStyle()}
        className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 w-80 max-h-96 overflow-hidden animate-in slide-in-from-bottom-2 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <h3 className="font-semibold capitalize">{word}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-5 h-5 animate-spin text-indigo-600" />
              <span className="ml-2 text-sm text-gray-600">Loading definition...</span>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600 text-sm mb-1">{error}</p>
              <p className="text-gray-400 text-xs">Try checking the spelling</p>
            </div>
          ) : definition ? (
            <div className="p-4">
              {/* Phonetics */}
              {definition.phonetic && (
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-gray-600 text-sm font-mono">
                    {definition.phonetic}
                  </span>
                  {definition.phonetics.find(p => p.audio) && (
                    <button
                      onClick={() => {
                        const audioPhonetic = definition.phonetics.find(p => p.audio);
                        if (audioPhonetic?.audio) playPronunciation(audioPhonetic.audio);
                      }}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Play pronunciation"
                    >
                      <Volume2 className="w-3 h-3 text-indigo-600" />
                    </button>
                  )}
                </div>
              )}

              {/* Meanings */}
              <div className="space-y-4">
                {definition.meanings.slice(0, 3).map((meaning, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-indigo-700 text-sm mb-2 capitalize">
                      {meaning.partOfSpeech}
                    </h4>
                    <div className="space-y-2">
                      {meaning.definitions.slice(0, 2).map((def, defIndex) => (
                        <div key={defIndex} className="text-sm">
                          <p className="text-gray-800 leading-relaxed">
                            {def.definition}
                          </p>
                          {def.example && (
                            <p className="text-gray-600 italic mt-1 text-xs">
                              "{def.example}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}