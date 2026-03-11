/**
 * SearchBar — 検索バーコンポーネント
 */
import { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = '商品名・キーワードで検索…' }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    // リアルタイム検索
    onSearch?.(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <div className="glass flex items-center rounded-2xl px-4 py-3 transition-all duration-300
                      focus-within:border-costco-blue/40 focus-within:shadow-lg focus-within:shadow-costco-blue/10">
        {/* 検索アイコン */}
        <svg
          className="mr-3 h-5 w-5 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
          id="search-input"
        />

        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); onSearch?.(''); }}
            className="ml-2 text-text-muted hover:text-text-primary transition-colors duration-200"
          >
            ✕
          </button>
        )}
      </div>
    </form>
  );
}
