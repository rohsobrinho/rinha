import triggers from './triggers';

export default {
  execute: [...triggers.execute],
  executeOnError: [
    ...triggers.executeOnError,
  ],
};
