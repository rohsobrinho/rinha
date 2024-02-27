import TgUpdateSaldo from './TgUpdateSaldo';

export default {
  execute: [
    ...TgUpdateSaldo.execute,
  ],
  executeOnError: [
    ...TgUpdateSaldo.executeOnError,
  ],
};
