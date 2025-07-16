import { GetServerSideProps } from 'next'
import { Todo } from '../../lib/todosApi'
import TodoForm from '../../components/TodoForm'
import TodoItem from '../../components/TodoItem'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface Props {
  todos: Todo[]
  page: number
  isLastPage: boolean
}

export default function TodosPage({ todos, page, isLastPage }: Props) {
  const router = useRouter()
  const [todoList, setTodoList] = useState<Todo[]>(todos)

  useEffect(() => {
    setTodoList(todos)
  }, [todos])

  const handleToggle = (id: number) => {
    setTodoList(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const handleAdd = (todo: Todo) => {
    setTodoList(prev => [todo, ...prev])
  }

  const goToPage = (newPage: number) => {
    router.push(`/todos?page=${newPage}`)
  }

  return (
    <main className="min-h-screen p-4 max-w-2xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">📝 Todo List (SSR)</h1>

      <TodoForm onAdd={handleAdd} />

      <ul className="space-y-2 mb-4">
        {todoList.map((todo) => (
          <TodoItem
            key={todo.id + (todo.completed ? '-done' : '')}
            todo={todo}
            onToggle={() => handleToggle(todo.id)}
          />
        ))}
      </ul>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => goToPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="text-blue-400 disabled:opacity-50 cursor-pointer"
        >
          ⬅ Prev
        </button>
        <button
          onClick={() => goToPage(page + 1)}
          disabled={isLastPage}
          className="text-blue-400 disabled:opacity-50 cursor-pointer"
        >
          Next ➡
        </button>
      </div>

      <div className="text-center mt-8">
          <Link href="/todosISR">
            <button
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 cursor-pointer"
            >
              Lihat Versi ISR
            </button>
          </Link>
        </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = parseInt((context.query.page as string) || '0', 10)
  const limit = 10
  const start = page * limit

  const res = await fetch(`https://jsonplaceholder.typicode.com/todos?_start=${start}&_limit=${limit}`)
  const todos: Todo[] = await res.json()

  const isLastPage = todos.length < limit

  return {
    props: {
      todos,
      page,
      isLastPage,
    },
  }
}
