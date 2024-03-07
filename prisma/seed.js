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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const raw_1 = __importDefault(require("./raw"));
const prisma = new client_1.PrismaClient();
const Clientes = [
    { id: 1, limite: 10000 },
    { id: 2, limite: 1000 },
    { id: 3, limite: 100000 },
    { id: 4, limite: 9000 },
    { id: 5, limite: 10 },
];
function main() {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (var _d = true, Clientes_1 = __asyncValues(Clientes), Clientes_1_1; Clientes_1_1 = yield Clientes_1.next(), _a = Clientes_1_1.done, !_a; _d = true) {
                _c = Clientes_1_1.value;
                _d = false;
                const c = _c;
                yield prisma.cliente.upsert({
                    where: { id: c.id },
                    update: {},
                    create: {
                        limite: c.limite
                    },
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = Clientes_1.return)) yield _b.call(Clientes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        function executeRawSQL() {
            var _a, e_2, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    for (var _d = true, _e = __asyncValues(raw_1.default.execute), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const sqlToExecute = _c;
                        const regexToHiddenTerms = [
                            { regex: /PASSWORD '[^'"]*'(?=(?:[^"]*"[^"]*")*[^"]*$)/g, replace: "PASSWORD '**hidden**'" },
                        ];
                        let sqlToLog = sqlToExecute;
                        regexToHiddenTerms.forEach(({ regex, replace }) => (sqlToLog = sqlToLog.replace(regex, replace)));
                        console.log(sqlToLog);
                        yield prisma.$executeRawUnsafe(sqlToExecute);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            });
        }
        // RAW SQL
        yield executeRawSQL();
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
