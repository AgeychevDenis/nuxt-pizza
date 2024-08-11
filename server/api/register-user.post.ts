import { hashSync } from 'bcrypt'

import prisma from '~/lib/prisma'
import { sendEmail } from '~/lib/sendEmail'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    })

    if (user) {
      if (!user.verified) {
        throw new Error('Почта не подтверждена')
      }

      throw new Error('Пользователь уже существует')
    }

    const createdUser = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        password: hashSync(body.password, 10),
      },
    })

    const code = Math.floor(100000 + Math.random() * 900000).toString()

    await prisma.verificationCode.create({
      data: {
        code,
        userId: createdUser.id,
      },
    })

    const html = `
    <p>Код подтверждения: <h2>${code}</h2></p>
    <p><a href="http://192.168.0.18:3000/api/auth/verify?code=${code}">Подтвердить регистрацию</a></p>
    `

    await sendEmail(createdUser.email, 'Nuxt Pizza / Подтверждение регистрации', html)
  } catch (error) {
    console.log('Error [CREATE_USER]', error)
    throw error
  }
})