import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, NODE_ENV } =
  process.env

const dbName = NODE_ENV === 'test' ? 'todo_test_db' : DB_NAME

const sequelize = new Sequelize(
  dbName || 'todo_db',
  DB_USERNAME || 'your_username',
  DB_PASSWORD || 'your_password',
  {
    host: DB_HOST || 'localhost',
    port: parseInt(DB_PORT || '5432', 10),
    dialect: 'postgres',
    logging: NODE_ENV !== 'test' ? console.log : false,
  }
)

export default sequelize

export const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection to the database has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }
}
