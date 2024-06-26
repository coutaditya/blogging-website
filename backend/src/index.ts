import { Hono } from 'hono'

export const app = new Hono().basePath('api/v1')

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/user/signup', (c) => {
  return c.text('signup route')
})

app.post('/user/signin', (c) => {
  return c.text('signin route')
})

app.post('/blog', (c) => {
  return c.text('blog post route')
})

app.put('/blog', (c) => {
  return c.text('blog put route')
})

app.get('blog/:id', (c) => {
  return c.text('get blog by id route')
})

app.get('blog/bulk', (c) => {
  return c.text('get all blogs route')
})

export default app
