import React from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import { WikipediaArticle } from '../types';

interface ArticleContentProps {
  article: WikipediaArticle;
  onWordClick: (word: string, event: React.MouseEvent) => void;
}

export default function ArticleContent({ article, onWordClick }: ArticleContentProps) {
  // Function to make words clickable
  const makeWordsClickable = (text: string) => {
    // Split text into words and non-word characters
    const parts = text.split(/(\s+|[^\w\s])/);
    
    return parts.map((part, index) => {
      // Check if part is a word (contains letters)
      if (/\w+/.test(part)) {
        return (
          <span
            key={index}
            onClick={(e) => onWordClick(part.toLowerCase().replace(/[^\w]/g, ''), e)}
            className="cursor-pointer hover:bg-yellow-100 hover:shadow-sm rounded-sm px-0.5 transition-all duration-150"
            title="Click for definition"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Clean and format HTML content
  const formatContent = (htmlContent: string) => {
    // If content is already plain text (from extract), split by double newlines
    if (!htmlContent.includes('<') && !htmlContent.includes('{{')) {
      return htmlContent.split('\n\n').filter(p => p.trim().length > 0).slice(0, 15);
    }

    // For wiki markup content, clean it up
    let cleanContent = htmlContent;
    
    // Remove wiki markup patterns
    cleanContent = cleanContent
      .replace(/\{\{[^}]*\}\}/g, '') // Remove templates
      .replace(/\[\[([^|\]]*\|)?([^\]]*)\]\]/g, '$2') // Convert links to plain text
      .replace(/\[https?:\/\/[^\s\]]+ ([^\]]*)\]/g, '$1') // Convert external links
      .replace(/'''([^']*)'''/g, '$1') // Remove bold markup
      .replace(/''([^']*)''/g, '$1') // Remove italic markup
      .replace(/==+([^=]*)==+/g, '$1') // Remove section headers
      .replace(/^\*+\s*/gm, '') // Remove bullet points
      .replace(/^\#+\s*/gm, '') // Remove numbered lists
      .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
      .replace(/&nbsp;/g, ' ') // Replace HTML entities
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    // Split into paragraphs and clean up
    const paragraphs = cleanContent
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 20) // Filter out very short paragraphs
      .filter(p => !p.startsWith('{{')) // Remove remaining templates
      .filter(p => !p.startsWith('[[Category:')) // Remove categories
      .filter(p => !p.startsWith('==')) // Remove any remaining headers
      .slice(0, 15); // Limit paragraphs

    return paragraphs;
  };

  const paragraphs = formatContent(article.content);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Article Header */}
      <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {article.title}
        </h1>
        <div className="flex items-center space-x-4 text-blue-100 text-sm">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Wikipedia Article</span>
          </div>
          <a
            href={`https://en.wikipedia.org/wiki/${encodeURIComponent(article.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View on Wikipedia</span>
          </a>
        </div>
      </div>

      {/* Article Content */}
      <div className="p-6">
        {/* Full Article Content in Blue Highlighted Section */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6 rounded-r-lg">
          <div className="prose max-w-none">
            {paragraphs.map((paragraph, index) => (
              <p 
                key={index} 
                className="mb-4 text-gray-800 leading-relaxed text-justify last:mb-0"
              >
                {makeWordsClickable(paragraph)}
              </p>
            ))}
          </div>
        </div>

        {/* Instruction */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 text-center">
            💡 <strong>Tip:</strong> Click on any word in the article to see its dictionary definition
          </p>
        </div>
      </div>
    </div>
  );
}