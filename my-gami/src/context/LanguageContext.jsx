import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, supportedLanguages } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('gamilearn_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('gamilearn_lang', language);
  }, [language]);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechVolume, setSpeechVolume] = useState(1.0);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);

  // Load available system voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const vList = window.speechSynthesis.getVoices();
        if (vList && vList.length > 0) {
          setAvailableVoices(vList);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const t = (keyOrText, fallback) => {
    if (!keyOrText) return '';
    const trimmed = typeof keyOrText === 'string' ? keyOrText.trim() : keyOrText;

    if (translations[language]) {
      if (translations[language][keyOrText]) return translations[language][keyOrText];
      if (translations[language][trimmed]) return translations[language][trimmed];
    }
    if (fallback !== undefined) return fallback;
    if (translations.en) {
      if (translations.en[keyOrText]) return translations.en[keyOrText];
      if (translations.en[trimmed]) return translations.en[trimmed];
    }
    return keyOrText;
  };

  // Global DOM auto-localization effect across the entire project
  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.documentElement.lang = language;
    const currentDict = translations[language] || {};
    const isDefault = language === 'en';

    const ignoredTags = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'INPUT', 'TEXTAREA', 'NOSCRIPT']);

    const translateNode = (node) => {
      if (!node) return;

      if (node.nodeType === Node.TEXT_NODE) {
        const raw = node.nodeValue;
        if (!raw || !raw.trim()) return;

        if (isDefault) {
          if (node.__gamilearn_orig !== undefined) {
            node.nodeValue = node.__gamilearn_orig;
            delete node.__gamilearn_orig;
          }
          return;
        }

        const original = node.__gamilearn_orig !== undefined ? node.__gamilearn_orig : raw;
        const trimmed = original.trim();

        if (currentDict[trimmed]) {
          if (node.__gamilearn_orig === undefined) {
            node.__gamilearn_orig = raw;
          }
          const replaced = original.replace(trimmed, currentDict[trimmed]);
          if (node.nodeValue !== replaced) {
            node.nodeValue = replaced;
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (ignoredTags.has(node.tagName)) return;
        if (node.isContentEditable) return;

        const title = node.getAttribute('title');
        if (title && title.trim()) {
          const trimmedTitle = title.trim();
          if (isDefault) {
            if (node.__gamilearn_orig_title !== undefined) {
              node.setAttribute('title', node.__gamilearn_orig_title);
              delete node.__gamilearn_orig_title;
            }
          } else if (currentDict[trimmedTitle]) {
            if (node.__gamilearn_orig_title === undefined) {
              node.__gamilearn_orig_title = title;
            }
            node.setAttribute('title', currentDict[trimmedTitle]);
          }
        }

        node.childNodes.forEach(translateNode);
      }
    };

    translateNode(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const added of mutation.addedNodes) {
          translateNode(added);
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [language]);

  // Play a crisp Google Meet chime to test speaker hardware
  const playMeetingChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3); // G5

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn("Audio chime context could not start:", e);
    }
  };

  const speak = (text, onEndCallback) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn("Speech synthesis is not supported on this browser.");
      return;
    }

    try {
      // Chrome/Edge bugfix: ensure queue is canceled and unpaused
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      if (!text || !text.trim()) return;

      const utterance = new SpeechSynthesisUtterance(text.trim());
      window._activeUtterance = utterance; // Prevents Chromium V8 garbage collection bug

      const langMap = {
        en: ['en-IN', 'en-US', 'en-GB', 'en'],
        hi: ['hi-IN', 'hi'],
        ta: ['ta-IN', 'ta'],
        te: ['te-IN', 'te'],
        bn: ['bn-IN', 'bn'],
        mr: ['mr-IN', 'mr'],
        es: ['es-ES', 'es']
      };

      const preferredLocales = langMap[language] || ['en-US', 'en-IN', 'en'];
      const vList = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();

      // Pick clear, loud voice
      let chosenVoice = null;
      if (selectedVoiceIndex > 0 && vList[selectedVoiceIndex]) {
        chosenVoice = vList[selectedVoiceIndex];
      } else {
        // Find best natural teacher voice
        for (const loc of preferredLocales) {
          chosenVoice = vList.find(v => 
            v.lang.toLowerCase().replace('_', '-').startsWith(loc.toLowerCase()) && 
            (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('David') || v.name.includes('Zira') || v.name.includes('Ravi'))
          ) || vList.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(loc.toLowerCase()));
          if (chosenVoice) break;
        }

        if (!chosenVoice && vList.length > 0) {
          chosenVoice = vList.find(v => v.lang.startsWith('en')) || vList[0];
        }
      }

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      utterance.volume = speechVolume; // Max audibility (1.0)
      utterance.rate = speechRate;     // Natural pace (1.0)
      utterance.pitch = 1.0;           // Clear teacher tone

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        window._activeUtterance = null;
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = (e) => {
        console.warn("SpeechSynthesis error:", e);
        setIsSpeaking(false);
        window._activeUtterance = null;
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Speech synthesis failed to execute:", err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      window._activeUtterance = null;
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      speak, 
      stopSpeaking,
      isSpeaking,
      speechVolume,
      setSpeechVolume,
      speechRate,
      setSpeechRate,
      availableVoices,
      selectedVoiceIndex,
      setSelectedVoiceIndex,
      playMeetingChime,
      supportedLanguages 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
