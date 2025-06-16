import express from 'express'
import todoRoutes from './routes/todo.routes'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(express.json())

app.get('/', (req, res) => {
  res.send('API is working!')
})

app.use('/api/todos', todoRoutes)

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack)
    res.status(500).send('Something is not ok!')
  }
)

export default app
