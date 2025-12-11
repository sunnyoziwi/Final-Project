import { useState, useRef, useEffect } from 'react';

const LANGUAGES = [
  { code: 'vi-VN', label: '🇻🇳 Tiếng Việt', full: 'Vietnamese' },
  { code: 'en-US', label: '🇺🇸 English', full: 'United States' },
  { code: 'ja-JP', label: '🇯🇵 日本語', full: 'Japanese' },
  { code: 'ko-KR', label: '🇰🇷 한국어', full: 'Korean' },
  { code: 'zh-CN', label: '🇨🇳 中文', full: 'Chinese' },
  { code: 'fr-FR', label: '🇫🇷 Français', full: 'French' },
  { code: 'de-DE', label: '🇩🇪 Deutsch', full: 'German' },
  { code: 'ru-RU', label: '🇷🇺 Русский', full: 'Russian' },
  { code: 'es-ES', label: '🇪🇸 Español', full: 'Spanish' },
  { code: 'th-TH', label: '🇹🇭 ไทย', full: 'Thai' },
  { code: 'lo-LA', label: '🇱🇦 ລາວ', full: 'Lao' },
  { code: 'km-KH', label: '🇰🇭 ខ្មែរ', full: 'Khmer' },
  { code: 'id-ID', label: '🇮🇩 Bahasa Indonesia', full: 'Indonesia' },
];

interface Props {
  value: string;
  onChange: (code: string) => void;
}

export const LanguageSelector = ({ value, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedLang = LANGUAGES.find(l => l.code === value) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div className="lang-selector-wrapper" ref={wrapperRef}>
      <div 
        className={`lang-display ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedLang.label}</span>
        <span className="arrow-icon">▼</span>
      </div>

      {isOpen && (
        <div className="lang-dropdown">
          {LANGUAGES.map((lang) => (
            <div 
              key={lang.code}
              className={`lang-option ${lang.code === value ? 'selected' : ''}`}
              onClick={() => {
                onChange(lang.code);
                setIsOpen(false); 
              }}
            >
              <span className="flag-text">{lang.label}</span>
              <span className="sub-text">{lang.full}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
