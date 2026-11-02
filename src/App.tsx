import { useEffect, useState } from 'react'
import './App.css'

type Todo = {
  id: number
  text: string
  completed: boolean
}

const STORAGE_KEY = 'todos'

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [text, setText] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  function addTodo() {
    const trimmed = text.trim()
    if (!trimmed) return

    setTodos([
      ...todos,
      { id: Date.now(), text: trimmed, completed: false },
    ])
    setText('')
  }

  function toggleTodo(id: number) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  function deleteTodo(id: number) {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const visibleTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  return (
    <main className="app">
      <h1>Задачи</h1>

      <div className="add-form">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addTodo()
          }}
          placeholder="Новая задача"
        />
        <button type="button" onClick={addTodo}>
          Добавить
        </button>
      </div>

      <div className="filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Все
        </button>
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Активные
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Выполненные
        </button>
      </div>

      {visibleTodos.length === 0 ? (
        <p className="empty">Нет задач</p>
      ) : (
        <ul className="todo-list">
          {visibleTodos.map((todo) => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span>{todo.text}</span>
              </label>
              <button type="button" className="delete" onClick={() => deleteTodo(todo.id)}>
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
