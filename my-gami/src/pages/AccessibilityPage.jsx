import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Eye, 
  Hand, 
  Mic, 
  Subtitles, 
  Check, 
  Globe 
} from 'lucide-react';

export default function AccessibilityPage() {
  const {
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
  } = useAccessibility();

  const { language, setLanguage, supportedLanguages, speak, t } = useLanguage();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
          {t("Inclusive & Universal Design")}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          {t("Accessibility Settings")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {t("Configure visual, audio, sign language, and tactile adaptations to personalize your learning experience.")}
        </p>
      </div>

      {/* Visual Adaptations */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Eye className="w-5 h-5 text-brand-600" />
          <span>{t("Visual & Display Adaptations")}</span>
        </h3>

        {/* Font Scaling */}
        <div>
          <label className="font-extrabold text-xs text-slate-700 uppercase tracking-wider block mb-2">
            {t("Text Size Scale")}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'normal', label: t('Standard (100%)'), example: 'Aa' },
              { id: 'large', label: t('Large (115%)'), example: 'Aa+' },
              { id: 'xlarge', label: t('Extra Large (130%)'), example: 'Aa++' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setFontSize(item.id)}
                className={`p-4 rounded-2xl border-2 text-center transition flex flex-col items-center gap-1 ${
                  fontSize === item.id
                    ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-xs ring-2 ring-brand-300'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
                aria-pressed={fontSize === item.id}
              >
                <span className="font-black text-xl">{item.example}</span>
                <span className="text-xs font-bold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast Themes */}
        <div>
          <label className="font-extrabold text-xs text-slate-700 uppercase tracking-wider block mb-2">
            {t("Contrast Theme Mode")}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'none', label: t('Standard Light'), desc: t('Soft pastel colors for daytime learning') },
              { id: 'high-contrast', label: t('High Contrast (Yellow / Black)'), desc: t('High visibility for low-vision learners') },
              { id: 'dark', label: t('Dark Mode'), desc: t('Saves battery on low-end OLED mobile screens') }
            ].map((thm) => (
              <button
                key={thm.id}
                onClick={() => setContrastMode(thm.id)}
                className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                  contrastMode === thm.id
                    ? 'border-brand-500 bg-brand-50 text-brand-950 ring-2 ring-brand-300'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
                aria-pressed={contrastMode === thm.id}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-xs">{thm.label}</span>
                  {contrastMode === thm.id && <Check className="w-4 h-4 text-brand-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{thm.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Dyslexia font toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <span className="font-extrabold text-xs sm:text-sm text-slate-900 block">
              {t("Dyslexia-Friendly Typography")}
            </span>
            <p className="text-[11px] text-slate-500">
              {t("Applies distinct character baselines to minimize letter inversion and confusion.")}
            </p>
          </div>
          <button
            onClick={() => setDyslexiaFont(!dyslexiaFont)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              dyslexiaFont ? 'bg-brand-500' : 'bg-slate-300'
            }`}
            aria-pressed={dyslexiaFont}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${dyslexiaFont ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Hearing, Deaf & Audio Adaptations */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Hand className="w-5 h-5 text-purple-600" />
          <span>{t("Hearing, Sign Language & Speech Adaptations")}</span>
        </h3>

        {/* Sign Language PIP Overlay */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50/60 border border-purple-200">
          <div className="space-y-1">
            <span className="font-extrabold text-xs sm:text-sm text-purple-950 flex items-center gap-1.5">
              <Hand className="w-4 h-4 text-purple-600" />
              <span>{t("Indian Sign Language (ISL) Picture-in-Picture Interpreter")}</span>
            </span>
            <p className="text-[11px] text-purple-800">
              {t("Floating avatar interpreting lesson concepts and quiz terms for deaf students.")}
            </p>
          </div>
          <button
            onClick={() => setSignLanguageOverlay(!signLanguageOverlay)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ml-4 ${
              signLanguageOverlay ? 'bg-purple-600' : 'bg-slate-300'
            }`}
            aria-pressed={signLanguageOverlay}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${signLanguageOverlay ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Video Captions Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="space-y-1">
            <span className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
              <Subtitles className="w-4 h-4 text-brand-600" />
              <span>{t("Multi-Language Synchronized Video Subtitles")}</span>
            </span>
            <p className="text-[11px] text-slate-500">
              {t("High-visibility subtitles overlaid at the bottom of all curriculum video players.")}
            </p>
          </div>
          <button
            onClick={() => setCaptionsEnabled(!captionsEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ml-4 ${
              captionsEnabled ? 'bg-brand-500' : 'bg-slate-300'
            }`}
            aria-pressed={captionsEnabled}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${captionsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Voice Commands & Speech to Text */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="space-y-1">
            <span className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-brand-600" />
              <span>{t("Voice Navigation & Speech-to-Text Input")}</span>
            </span>
            <p className="text-[11px] text-slate-500">
              {t("Enables microphone buttons on quizzes and tutor chats for low-literacy rural students.")}
            </p>
          </div>
          <button
            onClick={() => setVoiceCommandsEnabled(!voiceCommandsEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ml-4 ${
              voiceCommandsEnabled ? 'bg-brand-500' : 'bg-slate-300'
            }`}
            aria-pressed={voiceCommandsEnabled}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${voiceCommandsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

      </div>

      {/* Language Switcher Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Globe className="w-5 h-5 text-brand-600" />
          <span>{t("Regional Vernacular Language")}</span>
        </h3>
        <p className="text-xs text-slate-500">
          {t("Entire user interface, instructions, and speech synthesis adapt to your chosen mother tongue.")}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                speak(`Language changed to ${lang.label}`);
              }}
              className={`p-3 rounded-2xl border-2 text-center transition flex flex-col items-center gap-1 text-xs font-bold ${
                language === lang.code
                  ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-xs ring-2 ring-brand-300'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
