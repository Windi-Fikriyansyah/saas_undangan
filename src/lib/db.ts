import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = `${process.env.DATABASE_URL}`

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Returns a Prisma Client extended with multi-tenant data isolation.
 * Automatically injects `vendorId` into queries where applicable.
 */
export function getTenantPrisma(vendorId: string) {
  return prisma.$extends({
    query: {
      order: {
        async findMany({ args, query }: any) {
          args = args || {}
          args.where = { ...args.where, vendorId }
          return query(args)
        },
        async findFirst({ args, query }: any) {
          args = args || {}
          args.where = { ...args.where, vendorId }
          return query(args)
        },
        async findFirstOrThrow({ args, query }: any) {
          args = args || {}
          args.where = { ...args.where, vendorId }
          return query(args)
        },
        async count({ args, query }: any) {
          args = args || {}
          args.where = { ...args.where, vendorId }
          return query(args)
        },
        async create({ args, query }: any) {
          args = args || {}
          args.data = { ...args.data, vendorId }
          return query(args)
        },
        async findUnique({ args, query }: any) {
          args = args || {}
          const result = await query(args)
          if (result && result.vendorId !== vendorId) {
            return null
          }
          return result
        },
        async findUniqueOrThrow({ args, query }: any) {
          args = args || {}
          const result = await query(args)
          if (result && result.vendorId !== vendorId) {
            throw new Error("Unauthorized: Order does not belong to this vendor")
          }
          return result
        },
        async update({ args, query }: any) {
          args = args || {}
          const exists = await prisma.order.findUnique({ where: args.where })
          if (exists && exists.vendorId !== vendorId) {
            throw new Error("Unauthorized to update this order")
          }
          return query(args)
        },
        async delete({ args, query }: any) {
          args = args || {}
          const exists = await prisma.order.findUnique({ where: args.where })
          if (exists && exists.vendorId !== vendorId) {
            throw new Error("Unauthorized to delete this order")
          }
          return query(args)
        },
        async updateMany({ args, query }: any) {
          args = args || {}
          args.where = { ...args.where, vendorId }
          return query(args)
        },
        async deleteMany({ args, query }: any) {
          args = args || {}
          args.where = { ...args.where, vendorId }
          return query(args)
        },
      },
      guest: {
        async findMany({ args, query }: any) {
          args = args || {}
          args.where = { ...args.where, order: { ...args.where?.order, vendorId } }
          return query(args)
        },
        async findFirst({ args, query }: any) {
          args = args || {}
          args.where = { ...args.where, order: { ...args.where?.order, vendorId } }
          return query(args)
        },
        async count({ args, query }: any) {
          args = args || {}
          args.where = { ...args.where, order: { ...args.where?.order, vendorId } }
          return query(args)
        },
        async create({ args, query }: any) {
          args = args || {}
          const order = await prisma.order.findUnique({ where: { id: args.data.orderId } })
          if (!order || order.vendorId !== vendorId) {
            throw new Error("Unauthorized: Cannot create guest for this order")
          }
          return query(args)
        },
        async findUnique({ args, query }: any) {
          args = args || {}
          const result = await query(args)
          if (!result) return null
          const order = await prisma.order.findUnique({ where: { id: result.orderId } })
          if (!order || order.vendorId !== vendorId) return null
          return result
        },
        async update({ args, query }: any) {
          args = args || {}
          const guest = await prisma.guest.findUnique({ where: args.where })
          if (guest) {
            const order = await prisma.order.findUnique({ where: { id: guest.orderId } })
            if (!order || order.vendorId !== vendorId) {
              throw new Error("Unauthorized to update this guest")
            }
          }
          return query(args)
        },
        async delete({ args, query }: any) {
          args = args || {}
          const guest = await prisma.guest.findUnique({ where: args.where })
          if (guest) {
            const order = await prisma.order.findUnique({ where: { id: guest.orderId } })
            if (!order || order.vendorId !== vendorId) {
              throw new Error("Unauthorized to delete this guest")
            }
          }
          return query(args)
        },
      }
    }
  })
}
