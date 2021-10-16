export const isNodeNameButton = (nodeName) => {
  return nodeName === 'BUTTON';
};

export const isIncludesClass = (classList, className) => {
  return classList.includes(className);
};

export const isEmptyInput = (text) => {
  return text.trim() === '';
};
