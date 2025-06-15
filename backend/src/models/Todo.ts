import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/config'

interface TodoAttributes {
  id: string
  title: string
  description?: string
  completed: boolean
}

interface TodoCreationAttributes
  extends Optional<TodoAttributes, 'id' | 'completed'> {}

class Todo
  extends Model<TodoAttributes, TodoCreationAttributes>
  implements TodoAttributes
{
  public id!: string
  public title!: string
  public description?: string
  public completed!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Todo.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'todos',
    timestamps: true,
  }
)

export default Todo
