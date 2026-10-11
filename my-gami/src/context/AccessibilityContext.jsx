import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('gamilearn_font_size') || 'normal';
  });

  const [contrastMode, setContrastMode] = useState(() => {
    return localStorage.getItem('gamilearn_contrast') || 'none';
  });

  const [dyslexiaFont, setDyslexiaFont] = useState(() => {
    return localStorage.getItem('gamilearn_dyslexia') === 'true';
  });

  const [signLanguageOverlay, setSignLanguageOverlay] = useState(() => {
    return localStorage.getItem('gamilearn_sign_lang') === 'true';
  });

  const [captionsEnabled, setCaptionsEnabled] = useState(() => {
    return localStorage.getItem('gamilearn_captions') !== 'false';
  });

  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(() => {
    return localStorage.getItem('gamilearn_voice_cmd') === 'true';
  });

  // Apply font scale to document root
  useEffect(() => {
    localStorage.setItem('gamilearn_font_size', fontSize);
    let scale = '16px';
    if (fontSize === 'large') scale = '18px';
    if (fontSize === 'xlarge') scale = '20px';
    document.documentElement.style.fontSize = scale;
  }, [fontSize]);

  // Apply contrast theme to body
  useEffect(() => {
    localStorage.setItem('gamilearn_contrast', contrastMode);
    document.body.classList.remove('theme-high-contrast', 'theme-dark');
    if (contrastMode === 'high-contrast') {
      document.body.classList.add('theme-high-contrast');
    } else if (contrastMode === 'dark') {
      document.body.classList.add('theme-dark');
    }
  }, [contrastMode]);

  // Apply dyslexia font to body
  useEffect(() => {
    localStorage.setItem('gamilearn_dyslexia', dyslexiaFont);
    if (dyslexiaFont) {
      document.body.classList.add('font-dyslexic');
    } else {
      document.body.classList.remove('font-dyslexic');
    }
  }, [dyslexiaFont]);

  useEffect(() => {
    localStorage.setItem('gamilearn_sign_lang', signLanguageOverlay);
  }, [signLanguageOverlay]);

  useEffect(() => {
    localStorage.setItem('gamilearn_captions', captionsEnabled);
  }, [captionsEnabled]);

  useEffect(() => {
    localStorage.setItem('gamilearn_voice_cmd', voiceCommandsEnabled);
  }, [voiceCommandsEnabled]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        contrastMode,
        setContrastMode,
        dyslexiaFont,
        setDyslexiaFont,
        signLanguageOverlay,
        setSignLanguageOverlay,
        captionsEnabled,
        setCaptionsEnabled,
        voiceCommandsEnabled,
        setVoiceCommandsEnabled,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
