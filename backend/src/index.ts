import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'

export const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_PASSWORD: string
  }
}>().basePath('api/v1')

app.route("/user", userRouter)
app.route("/blog", blogRouter)

export default app
