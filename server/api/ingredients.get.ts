import prisma from '~/server/lib/prisma'

export default defineEventHandler(async () => {
  return prisma.ingredient.findMany()
})
