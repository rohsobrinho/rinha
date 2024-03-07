import express from 'express'
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const {PORT} = process.env

const app = express()
const prismaClient = new PrismaClient()

app.use(express.json());

app.get('/', async (req, res) => {
    const clientes = await prismaClient.cliente.findMany()
    res.json(clientes)
})

app.post('/clientes/:id/transacoes', async (req, res) => {
    let statusCode = 200
    try{
        console.log(req.body)
        const { id: clienteId } = req.params
        const { valor, tipo, descricao } = req.body
        const cliente = await prismaClient.cliente.findUnique({ where: { id: +clienteId } })

        if(!cliente){
            statusCode = 404
            throw new Error('Not Found.')
        }

        if(tipo === 'd' && cliente.saldo - valor < -cliente.limite){
            statusCode = 422
            throw new Error('Sem limite.')
        }

        await prismaClient.transacoes.create({
            data: {
                clienteId: +clienteId,
                tipo,
                valor,
                descricao,
                realizada_em: new Date()
            }
        })
        
        const clienteRes = await prismaClient.cliente.findUnique({ where: { id: +clienteId } })

        return res.status(statusCode).json({
            limite: clienteRes?.limite,
            saldo: clienteRes?.saldo
        })
    }catch(error: any){
        return res.status(statusCode).send(`Erro: ${error.message}`)
    }
})

app.get('/clientes/:id/extrato', async (req, res) => {
    const {id: clienteId} = req.params

    const cliente = await prismaClient.cliente.findFirst({
        where: { id: +clienteId },
        include: {
            Transacoes: {
                take: 10,
                orderBy: { realizada_em: 'desc'}
            }
        }
    })

    if(!cliente){
        return res.status(404).send('Not Found')
    }

    const result = {
        saldo: {
            total: cliente.saldo,
            data_extrato: new Date(),
            limite: cliente.limite
        },
        ultimas_transacoes: cliente.Transacoes.map((transacao: any) => ({
            valor: transacao.valor,
            tipo: transacao.tipo,
            descricao: transacao.descricao,
            realizada_em: transacao.realizada_em
        }))
    }
    res.status(200).json(result)
})

app.listen(PORT, () => {
    console.log('Running')
})