import { PrismaClient } from '@prisma/client'
import rawSQL from './raw';
const prisma = new PrismaClient()

const Clientes = [
    {id: 1, limite: 10000},
    {id: 2, limite: 1000},
    {id: 3, limite: 100000},
    {id: 4, limite: 9000},
    {id: 5, limite: 10},
]

async function main() {
    for await(const c of Clientes){
        await prisma.cliente.upsert({
          where: { id: c.id },
          update: {},
          create: {
            limite: c.limite
          },
        })
    }

    async function executeRawSQL() {
      for await (const sqlToExecute of rawSQL.execute) {
        const regexToHiddenTerms = [
          { regex: /PASSWORD '[^'"]*'(?=(?:[^"]*"[^"]*")*[^"]*$)/g, replace: "PASSWORD '**hidden**'" },
        ];
        let sqlToLog = sqlToExecute;
        regexToHiddenTerms.forEach(({ regex, replace }) => (sqlToLog = sqlToLog.replace(regex, replace)));
        console.log(sqlToLog);
        await prisma.$executeRawUnsafe(sqlToExecute);
      }
    }
  
    // RAW SQL
    await executeRawSQL();
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