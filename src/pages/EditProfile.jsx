import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

function EditProfile() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', bio: '', career_goals: '' })
  const [roles, setRoles] = useState([])
  const [selectedRoles, setSelectedRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, rolesRes] = await Promise.all([
          API.get('/users/me'),
          API.get('/roles')
        ])
        setForm({
          name: profileRes.data.name || '',
          bio: profileRes.data.bio || '',
          career_goals: profileRes.data.career_goals || ''
        })
        setRoles(rolesRes.data)
      } catch (err) {
        setError('Failed to load profile')
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
      await API.put('/users/me', form)
      for (const roleId of selectedRoles) {
        try {
          await API.post(`/users/me/roles?role_id=${roleId}`)
        } catch {}
      }
      navigate('/profile')
    } catch (err) {
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-[#17345C] mb-2">Set up your profile</h1>
        <p className="text-gray-500 text-sm mb-6">Tell us who you are and what you specialize in.</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Name</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
              placeholder="Tell us about yourself"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Career Goals</label>
            <textarea
              value={form.career_goals}
              onChange={e => setForm({ ...form, career_goals: e.target.value })}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
              placeholder="What do you want to achieve?"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Your Specialization(s)
            </label>
            <p className="text-xs text-gray-400 mb-3">Select all that apply. You can select multiple.</p>
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
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProfile