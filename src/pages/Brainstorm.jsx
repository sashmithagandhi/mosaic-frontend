import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api'
import BrainstormCard from '../components/BrainstormCard'

function Brainstorm() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get('/brainstorm')
        setPosts(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')
    try {
      const res = await API.post('/brainstorm', form)
      setPosts([res.data, ...posts])
      setForm({ title: '', description: '' })
      setMessage('Idea posted successfully!')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#17345C]">Brainstorm</h1>
          <p className="text-gray-500 text-sm mt-1">
            Have an idea but not sure where to start? Post it here.
            Someone will claim it and turn it into a real project.
          </p>
        </div>

        {/* Post Idea Form */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
          <h2 className="font-bold text-[#17345C] mb-4">Post an Idea</h2>
          {message && (
            <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Idea title (e.g. AI tutor for rural students)"
              required
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
            />
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the problem you want to solve..."
              rows={3}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#17345C] text-white text-sm font-semibold py-2 rounded-lg hover:bg-[#1D5C85] disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Idea'}
            </button>
          </form>
        </div>

        {/* Ideas List */}
        <h2 className="font-bold text-[#17345C] mb-4">All Ideas</h2>
        {posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>No ideas posted yet. Be the first!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map(post => (
              <Link to={`/brainstorm/${post.id}`} key={post.id}>
                <BrainstormCard post={post} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Brainstorm