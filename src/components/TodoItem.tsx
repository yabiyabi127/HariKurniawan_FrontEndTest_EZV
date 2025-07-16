import { Todo } from '../lib/todosApi'

type Props = {
  todo: Todo
  onToggle: () => void
}

export default function TodoItem({ todo, onToggle }: Props) {
  return (
    <li
      onClick={onToggle}
      className={`cursor-pointer p-2 rounded-md border ${
        todo.completed ? 'bg-green-600 line-through' : 'bg-gray-800'
      }`}
    >
      {todo.title}
    </li>
  )
}
