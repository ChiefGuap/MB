import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export const startListening = () => {
  SpeechRecognition.startListening({
    continuous: true,
    language: 'en-US'
  });
};

export const stopListening = () => {
  SpeechRecognition.stopListening();
};

export const resetTranscript = () => {
  SpeechRecognition.resetTranscript();
};

export const useSpeechToText = () => {
  const {
    transcript,
    listening,
    resetTranscript: reset,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  return {
    transcript,
    listening,
    resetTranscript: reset,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening
  };
};