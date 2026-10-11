import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const lastSpokenTextRef = useRef('');
  const onFinalCallbackRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
      }
    }
  }, []);

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const finishAndSubmit = useCallback((finalText) => {
    clearSilenceTimer();
    const textToProcess = (finalText || lastSpokenTextRef.current || '').trim();

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      recognitionRef.current = null;
    }

    setIsListening(false);
    setIsSpeakingAudio(false);
    setInterimTranscript('');

    if (textToProcess) {
      setTranscript(textToProcess);
      if (onFinalCallbackRef.current) {
        const cb = onFinalCallbackRef.current;
        onFinalCallbackRef.current = null;
        cb(textToProcess);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    const textToProcess = lastSpokenTextRef.current.trim();

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      recognitionRef.current = null;
    }

    setIsListening(false);
    setIsSpeakingAudio(false);
    setInterimTranscript('');

    if (textToProcess && onFinalCallbackRef.current) {
      setTranscript(textToProcess);
      const cb = onFinalCallbackRef.current;
      onFinalCallbackRef.current = null;
      cb(textToProcess);
    }
  }, []);

  const startListening = useCallback((onResultCallback, lang = 'en-IN') => {
    clearSilenceTimer();
    setErrorMessage(null);
    lastSpokenTextRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    onFinalCallbackRef.current = onResultCallback;

    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setErrorMessage("Speech recognition not supported in this browser. You can type or tap the voice prompts below.");
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onaudiostart = () => {
        setIsSpeakingAudio(true);
      };

      recognition.onsoundstart = () => {
        setIsSpeakingAudio(true);
      };

      recognition.onspeechstart = () => {
        setIsSpeakingAudio(true);
      };

      recognition.onspeechend = () => {
        setIsSpeakingAudio(false);
        // Start auto-submit countdown after speech pause
        clearSilenceTimer();
        silenceTimerRef.current = setTimeout(() => {
          if (lastSpokenTextRef.current.trim()) {
            finishAndSubmit(lastSpokenTextRef.current);
          }
        }, 1200);
      };

      recognition.onsoundend = () => {
        setIsSpeakingAudio(false);
      };

      recognition.onresult = (event) => {
        clearSilenceTimer();
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            currentFinal += item[0].transcript + ' ';
          } else {
            currentInterim += item[0].transcript;
          }
        }

        const combinedText = (currentFinal + ' ' + currentInterim).trim();
        if (combinedText) {
          lastSpokenTextRef.current = combinedText;
          setInterimTranscript(combinedText);
          setIsSpeakingAudio(true);

          // Auto-finalization after 1.4s of quiet after speech
          silenceTimerRef.current = setTimeout(() => {
            finishAndSubmit(combinedText);
          }, 1400);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === 'no-speech') {
          if (lastSpokenTextRef.current.trim()) {
            finishAndSubmit(lastSpokenTextRef.current);
            return;
          }
        } else if (event.error === 'not-allowed') {
          setErrorMessage("Microphone access blocked. Please click the camera/mic icon in the browser address bar to allow microphone.");
          setIsListening(false);
        } else if (event.error === 'network') {
          if (lastSpokenTextRef.current.trim()) {
            finishAndSubmit(lastSpokenTextRef.current);
            return;
          }
          setErrorMessage("Voice recognition network timeout. Tap a prompt or type below.");
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        if (lastSpokenTextRef.current.trim()) {
          finishAndSubmit(lastSpokenTextRef.current);
        } else {
          setIsListening(false);
          setIsSpeakingAudio(false);
        }
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition start failed:", err);
      setIsListening(false);
    }
  }, [finishAndSubmit]);

  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSpeakingAudio,
    errorMessage,
    isSupported,
    setTranscript,
    startListening,
    stopListening
  };
}
