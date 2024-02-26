import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const Clientes = [
    {id: 1, limite: 10000},
    {id: 2, limite: 1000},
    {id: 3, limite: 100000},
    {id: 4, limite: 9000},
    {id: 5, limite: 10},
]

async function main() {
    for(const c in Clientes){
        await prisma.cliente.upsert({
          where: { id: Clientes[c].id },
          update: {},
          create: {
            limite: Clientes[c].limite
          },
        })
    }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })