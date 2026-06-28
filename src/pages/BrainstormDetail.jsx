import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api'

function BrainstormDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [converting, setConverting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [convertForm, setConvertForm] = useState({
    title: '',
    description: '',
    repo_url: ''
  })

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get(`/brainstorm/${id}`)
        setPost(res.data)
        setConvertForm(f => ({ ...f, title: res.data.title, description: res.data.description || '' }))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleClaim() {
    setClaiming(true)
    setError('')
    setMessage('')
    try {
      await API.post(`/brainstorm/${id}/claim`)
      setMessage('You claimed this idea! Now write a PRD and convert it to a project.')
      setPost({ ...post, status: 'claimed' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to claim')
    } finally {
      setClaiming(false)
    }
  }

  async function handleConvert(e) {
    e.preventDefault()
    setConverting(true)
    setError('')
    try {
      const res = await API.post(`/brainstorm/${id}/convert`, convertForm)
      setMessage('Idea converted to project successfully!')
      setTimeout(() => navigate(`/projects/${res.data.project_id}`), 1500)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to convert')
    } finally {
      setConverting(false)
    }
  }

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>
  if (!post) return <div className="p-6 text-gray-500">Idea not found.</div>

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-xl border border-gray-100 p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              post.status === 'open' ? 'bg-green-50 text-green-600' :
              post.status === 'claimed' ? 'bg-yellow-50 text-yellow-600' :
              'bg-purple-50 text-purple-600'
            }`}>
              {post.status}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#17345C] mb-3">{post.title}</h1>
          {post.description && (
            <p className="text-gray-600 text-sm">{post.description}</p>
          )}
        </div>

        {message && (
          <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {post.status === 'open' && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-[#17345C] mb-2">Claim this Idea</h2>
            <p className="text-gray-500 text-sm mb-4">
              Claim this idea, write a PRD for it, and convert it into a real project.
            </p>
            <button
              onClick={handleClaim}
              disabled={claiming}
              className="bg-[#17345C] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#1D5C85] disabled:opacity-50"
            >
              {claiming ? 'Claiming...' : 'Claim Idea'}
            </button>
          </div>
        )}

        {post.status === 'claimed' && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#17345C] mb-2">Convert to Project</h2>
            <p className="text-gray-500 text-sm mb-4">
              Ready to turn this idea into a real project? Fill in the details below.
            </p>
            <form onSubmit={handleConvert} className="flex flex-col gap-4">
              <input
                value={convertForm.title}
                onChange={e => setConvertForm({ ...convertForm, title: e.target.value })}
                placeholder="Project title"
                required
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
              />
              <textarea
                value={convertForm.description}
                onChange={e => setConvertForm({ ...convertForm, description: e.target.value })}
                placeholder="Project description"
                rows={3}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
              />
              <input
                value={convertForm.repo_url}
                onChange={e => setConvertForm({ ...convertForm, repo_url: e.target.value })}
                placeholder="GitHub repo URL (optional)"
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
              />
              <button
                type="submit"
                disabled={converting}
                className="bg-[#17345C] text-white text-sm font-semibold py-2 rounded-lg hover:bg-[#1D5C85] disabled:opacity-50"
              >
                {converting ? 'Converting...' : 'Convert to Project'}
              </button>
            </form>
          </div>
        )}

        {post.status === 'converted' && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <p className="text-gray-600 text-sm">This idea has been converted into a project.</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default BrainstormDetail