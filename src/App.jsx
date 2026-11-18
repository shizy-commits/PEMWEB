
import { useState } from 'react'
import './App.css'

const initialTodos = [
  {
    id: 1,
    title: 'Mengerjakan Proyek Computer Vision',
    description: 'Menyelesaikan proyek computer vision tentang deteksi penggunaan helm.',
    status: 'in progress',
    priority: 'high',
    deadline: '2026-11-20'
  },
  {
    id: 2,
    title: 'Mempelajari Dasar React',
    description: 'Mempelajari komponen, props, dan React State.',
    status: 'in progress',
    priority: 'low',
    deadline: '2026-11-22'
  },
  {
    id: 3,
    title: 'Membuat Website Portfolio',
    description: 'Membuat website portfolio menggunakan HTML dan CSS.',
    status: 'in progress',
    priority: 'low',
    deadline: '2026-11-25'
  },
  {
    id: 4,
    title: 'Mengerjakan Tugas Basis Data',
    description: 'Menyelesaikan latihan query SQL.',
    status: 'todo',
    priority: 'low',
    deadline: '2026-11-24'
  }
]

const emptyForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'low',
  deadline: ''
}

function App() {
  const [todos, setTodos] = useState(initialTodos)
  const [view, setView] = useState('list')
  const [selectedTodo, setSelectedTodo] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [notice, setNotice] = useState('')

  function openAddModal() {
    setForm(emptyForm)
    setEditingId(null)
    setShowModal(true)
  }

  function openEditModal() {
    setForm({
      title: selectedTodo.title,
      description: selectedTodo.description,
      status: selectedTodo.status,
      priority: selectedTodo.priority,
      deadline: selectedTodo.deadline
    })

    setEditingId(selectedTodo.id)
    setShowModal(true)
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (editingId !== null) {
      const updatedTodos = todos.map(todo =>
        todo.id === editingId ? { ...todo, ...form } : todo
      )

      setTodos(updatedTodos)

      const updatedTodo = updatedTodos.find(
        todo => todo.id === editingId
      )

      setSelectedTodo(updatedTodo)
      setNotice('Tugas berhasil diperbarui!')
    } else {
      const newTodo = {
        id: Date.now(),
        ...form
      }

      setTodos([...todos, newTodo])
      setNotice('Tugas berhasil ditambahkan!')
    }

    setShowModal(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  function handleDelete(id) {
    const confirmation = window.confirm(
      'Apakah Anda yakin ingin menghapus tugas ini?'
    )

    if (confirmation) {
      setTodos(todos.filter(todo => todo.id !== id))
      setView('list')
      setSelectedTodo(null)
      setNotice('Tugas berhasil dihapus!')
    }
  }

  function openDetail(todo) {
    setSelectedTodo(todo)
    setView('detail')
  }

  function formatDate(date) {
    if (!date) return '-'

    return new Date(date + 'T00:00:00').toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <main className="container">
      {notice && (
  <div className="notification">
    <div>
      <strong>Todo List</strong>
      <p>{notice}</p>
    </div>

    <button onClick={() => setNotice('')}>×</button>
  </div>
)}

      {view === 'list' && (
        <>
          <header className="header">
            <h1>Todo List</h1>

            <button className="add-button" onClick={openAddModal}>
              Tambah Todo
            </button>
          </header>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Status</th>
                  <th>Prioritas</th>
                  <th>Deadline</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {todos.map(todo => (
                  <tr key={todo.id}>
                    <td>{todo.title}</td>

                    <td>
                      <span className={`status ${todo.status.replace(' ', '-')}`}>
                        {todo.status}
                      </span>
                    </td>

                    <td>
                      <span className={`priority ${todo.priority}`}>
                        {todo.priority}
                      </span>
                    </td>

                    <td>{formatDate(todo.deadline)}</td>

                    <td>
                      <div className="actions">
                        <button
                          className="detail-button"
                          onClick={() => openDetail(todo)}
                          title="Detail"
                        >
                          ◉
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDelete(todo.id)}
                          title="Hapus"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {todos.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty">
                      Belum ada tugas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {view === 'detail' && selectedTodo && (
        <section className="detail-card">
          <div className="detail-content">
            <div>
              <label>Judul</label>
              <p>{selectedTodo.title}</p>

              <label>Deskripsi</label>
              <p>{selectedTodo.description || '-'}</p>
            </div>

            <div>
              <label>Status</label>
              <p>{selectedTodo.status}</p>

              <label>Prioritas</label>
              <p>{selectedTodo.priority}</p>

              <label>Deadline</label>
              <p>{formatDate(selectedTodo.deadline)}</p>
            </div>
          </div>

          <div className="detail-actions">
    <button
    className="cancel-button"
    onClick={() => {
      setView('list')
      setSelectedTodo(null)
    }}
  >
    Kembali
  </button>

  <button
    className="add-button"
    onClick={openEditModal}
  >
    Update
  </button>
</div>
        </section>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingId !== null ? 'Update Todo' : 'Tambah Todo'}</h2>

            <form onSubmit={handleSubmit}>
              <label>Judul</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Masukkan judul tugas"
                required
              />

              <label>Deskripsi</label>
              <textarea
                value={form.description}
                onChange={e => setForm({
                  ...form,
                  description: e.target.value
                })}
                placeholder="Masukkan deskripsi tugas"
              />

              <div className="form-row">
                <div>
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({
                      ...form,
                      status: e.target.value
                    })}
                  >
                    <option value="todo">todo</option>
                    <option value="in progress">in progress</option>
                    <option value="done">done</option>
                  </select>
                </div>

                <div>
                  <label>Prioritas</label>
                  <select
                    value={form.priority}
                    onChange={e => setForm({
                      ...form,
                      priority: e.target.value
                    })}
                  >
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                  </select>
                </div>
              </div>

              <label>Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => setForm({
                  ...form,
                  deadline: e.target.value
                })}
                required
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>

                <button type="submit" className="add-button">
                  {editingId !== null ? 'Update' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  )
}

export default App
