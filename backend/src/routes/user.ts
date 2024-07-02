import { PrismaClient } from "@prisma/client/edge.js";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_PASSWORD: string
    }
}>()

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()
    try{
        const user = await prisma.user.create({
        data:{
            email: body.email,
            password: body.password
        }
        })

        const token = await sign(
        {
            id: user.id
        },
        c.env.JWT_PASSWORD
        )

        return c.json({
        jwt: token
        })
    } catch(err){
        c.status(411)
        return c.text('User already exists with this email')
    }
})
  
userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()
    try{
        const user = await prisma.user.findUnique({
        where: {
            email: body.email,
            password: body.password
        }
        })

        if(!user){
        c.status(403)
        return c.text('User not found')
        }

        const token = await sign(
        {
            id: user?.id
        },
        c.env.JWT_PASSWORD
        )

        return c.json({
        jwt: token
        })
    } catch(err){
        c.status(403)
        return c.text('Invalid')
    }
})
  