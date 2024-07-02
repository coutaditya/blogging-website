import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_PASSWORD: string
    }, 
    Variables: {
        userId: string
    }
}>()

blogRouter.use('/*', async (c, next) => {
    const header = c.req.header("authorization") || ""
    const token = header.split(" ")[1]
  
    const user = await verify(token, c.env.JWT_PASSWORD)
    if(user){
      c.set("userId", String(user.id))
      await next()
    } else{
      c.status(403)
      return c.json({ error: "unauthorized"})
    }
})
  
  
blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()
    const authorId = c.get("userId")

    try{
        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: authorId
            }
        })

        return c.json({
            id: post.id
        })
    } catch(err){
        c.status(411)
        return c.text("Error creating post")
    }
})

blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()

    try{
        const post = await prisma.post.update({
            where: {
                id: body.id
            },
            data: {
                title: body.title,
                content: body.content,
            }
        })

        return c.json({
            id: post.id
        })
    } catch(err){
        c.status(411)
        return c.text("Error updating post")
    }
})

// TODO: add pagination
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()

    try{
        const posts = await prisma.post.findMany()

        return c.json({
            posts
        })
    } catch(err){
        c.status(411)
        return c.text("Error fetching post")
    }
})

blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const id = await c.req.param("id")

    try{
        const post = await prisma.post.findFirst({
            where: {
                id: id
            }
        })

        return c.json({
            post
        })
    } catch(err){
        c.status(411)
        return c.text("Error updating post")
    }
})