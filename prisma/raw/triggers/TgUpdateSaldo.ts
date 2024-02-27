const FnUpdateSaldo = 'FnUpdateSaldo';
const FnUpdateSaldoSQL = [
  `
CREATE OR REPLACE FUNCTION public."${FnUpdateSaldo}"()
RETURNS TRIGGER AS
$BODY$
DECLARE
	_cliente_id INT;
    _valor INT;
    _tipo TEXT;
BEGIN
    _cliente_id := NEW."clienteId";
    _valor := NEW."valor";
    _tipo := NEW."tipo";

    IF _tipo = 'd' THEN
        UPDATE public."Cliente" SET saldo = saldo - _valor WHERE id=_cliente_id;
        RAISE NOTICE 'DEBITO: %', _valor;
    END IF;

    IF _tipo = 'c' THEN
        UPDATE public."Cliente" SET saldo = saldo + _valor WHERE id=_cliente_id;
        RAISE NOTICE 'CREDITO: %', _valor;
    END IF;

	RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql
COST 100;
`,
];

const TgUpdateCliente = 'TgUpdateCliente';
const TgUpdateClienteSQL = [
  `
CREATE OR REPLACE TRIGGER "${TgUpdateCliente}"
AFTER INSERT ON public."Transacoes"
FOR EACH ROW WHEN ( NEW."valor"!=0 )
EXECUTE PROCEDURE public."${FnUpdateSaldo}"();
`,
];

export default {
  execute: [
    `DROP TRIGGER IF EXISTS "${TgUpdateCliente}" ON "Transacoes";`,
    `DROP TRIGGER IF EXISTS "${FnUpdateSaldo}" ON "Transacoes";`,
    ...FnUpdateSaldoSQL,
    ...TgUpdateClienteSQL,
  ],
  executeOnError: [
    `DROP TRIGGER IF EXISTS "${TgUpdateCliente}" ON "Transacoes";`,
    `DROP TRIGGER IF EXISTS "${FnUpdateSaldo}" ON "Transacoes";`,
    `DROP FUNCTION IF EXISTS "${FnUpdateSaldo}";`,
  ],
};
