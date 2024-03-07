"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const client_1 = require("@prisma/client");
const { PORT } = process.env;
const app = (0, express_1.default)();
const prismaClient = new client_1.PrismaClient();
app.use(express_1.default.json());
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clientes = yield prismaClient.cliente.findMany();
    res.json(clientes);
}));
app.post('/clientes/:id/transacoes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let statusCode = 200;
    try {
        console.log(req.body);
        const { id: clienteId } = req.params;
        const { valor, tipo, descricao } = req.body;
        const cliente = yield prismaClient.cliente.findUnique({ where: { id: +clienteId } });
        if (!cliente) {
            statusCode = 404;
            throw new Error('Not Found.');
        }
        if (tipo === 'd' && cliente.saldo - valor < -cliente.limite) {
            statusCode = 422;
            throw new Error('Sem limite.');
        }
        yield prismaClient.transacoes.create({
            data: {
                clienteId: +clienteId,
                tipo,
                valor,
                descricao,
                realizada_em: new Date()
            }
        });
        const clienteRes = yield prismaClient.cliente.findUnique({ where: { id: +clienteId } });
        return res.status(statusCode).json({
            limite: clienteRes === null || clienteRes === void 0 ? void 0 : clienteRes.limite,
            saldo: clienteRes === null || clienteRes === void 0 ? void 0 : clienteRes.saldo
        });
    }
    catch (error) {
        return res.status(statusCode).send(`Erro: ${error.message}`);
    }
}));
app.get('/clientes/:id/extrato', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: clienteId } = req.params;
    const cliente = yield prismaClient.cliente.findFirst({
        where: { id: +clienteId },
        include: {
            Transacoes: {
                take: 10,
                orderBy: { realizada_em: 'desc' }
            }
        }
    });
    if (!cliente) {
        return res.status(404).send('Not Found');
    }
    const result = {
        saldo: {
            total: cliente.saldo,
            data_extrato: new Date(),
            limite: cliente.limite
        },
        ultimas_transacoes: cliente.Transacoes.map(transacao => ({
            valor: transacao.valor,
            tipo: transacao.tipo,
            descricao: transacao.descricao,
            realizada_em: transacao.realizada_em
        }))
    };
    res.status(200).json(result);
}));
app.listen(PORT, () => {
    console.log('Running');
});
