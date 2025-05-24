import SpeechRecognition from 'react-speech-recognition';

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