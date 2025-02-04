/**
 * Utility functions for formatting French text and handling punctuation
 */

const FRENCH_QUESTION_STARTERS = [
  'qui ',
  'que ',
  'quoi ',
  'quel ',
  'quelle ',
  'quand ',
  'où ',
  'comment ',
  'pourquoi '
] as const;

export const addSpaceBeforePunctuation = (text: string): string => {
  return text.replace(/([?!])/g, ' $1');
};

export const capitalizeSentences = (text: string): string => {
  return text.replace(/(^\w|[.!?]\s+\w)/g, letter => letter.toUpperCase());
};

export const formatPunctuation = (text: string): string => {
  return text.replace(/([,;:])\s*/g, '$1 ');
};

export const cleanExtraSpaces = (text: string): string => {
  return text.replace(/\s+/g, ' ').trim();
};

export const isQuestionSentence = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return FRENCH_QUESTION_STARTERS.some(starter => lowerText.startsWith(starter));
};

export const addEndingPunctuation = (text: string): string => {
  if (!/[.!?]$/.test(text)) {
    return isQuestionSentence(text) ? `${text} ?` : `${text}.`;
  }
  return text;
};

export const formatFrenchText = (text: string): string => {
  let formattedText = text;
  formattedText = addSpaceBeforePunctuation(formattedText);
  formattedText = capitalizeSentences(formattedText);
  formattedText = formatPunctuation(formattedText);
  formattedText = cleanExtraSpaces(formattedText);
  formattedText = addEndingPunctuation(formattedText);
  return formattedText;
};