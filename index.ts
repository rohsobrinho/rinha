import express from 'express'
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const {PORT} = process.env

const app = express()
const prismaClient = new PrismaClient()

app.get('/', async (req, res) => {
    const clientes = await prismaClient.cliente.findMany()
    res.json(clientes)
})

app.get('/clientes/:id/transacoes', async (req, res) => {
    const {id: clienteId} = req.params

    const cliente = await prismaClient.cliente.findFirst({
        where: { id: +clienteId },
        include: {
            Transacoes: true
        }
    })
    res.json(cliente)
})

app.listen(PORT, () => {
    console.log('Running')
})