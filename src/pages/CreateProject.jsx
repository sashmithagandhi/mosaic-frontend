import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

function CreateProject() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', repo_url: '' })
  const [roles, setRoles] = useState([])
  const [selectedRoles, setSelectedRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get('/roles')
        setRoles(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  function toggleRole(roleId) {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const projectRes = await API.post('/projects', form)
      const projectId = projectRes.data.id
      for (const roleId of selectedRoles) {
        try {
          await API.post(`/projects/${projectId}/roles`, {
            role_id: roleId,
            slots_needed: 1
          })
        } catch {}
      }
      navigate(`/projects/${projectId}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-[#17345C] mb-2">Create a Project</h1>
        <p className="text-gray-500 text-sm mb-6">
          Define your project and select the roles you need.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Project Title</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
              placeholder="e.g. ReBloom — AI companion for working mothers"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
              placeholder="What is this project about? What problem does it solve?"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              GitHub Repo URL <span className="text-gray-400">(optional)</span>
            </label>
            <input
              value={form.repo_url}
              onChange={e => setForm({ ...form, repo_url: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Roles Needed
            </label>
            <p className="text-xs text-gray-400 mb-3">
              Select the roles your project needs contributors for.
            </p>
            <div className="flex flex-wrap gap-2">
              {roles.map(role => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => toggleRole(role.id)}
                  className={`px-3 py-1 rounded-full text-sm border transition-all ${
                    selectedRoles.includes(role.id)
                      ? 'bg-[#17345C] text-white border-[#17345C]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#1D5C85]'
                  }`}
                >
                  {role.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#17345C] text-white font-semibold py-2 rounded-lg hover:bg-[#1D5C85] disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateProject