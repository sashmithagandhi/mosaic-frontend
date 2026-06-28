import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import API from '../api'
import RoleTag from '../components/RoleTag'

function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [roles, setRoles] = useState([])
  const [projectRoles, setProjectRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState('')
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [projectRes, rolesRes, projectRolesRes] = await Promise.all([
          API.get(`/projects/${id}`),
          API.get('/roles'),
          API.get(`/projects/${id}/roles`)
        ])
        setProject(projectRes.data)
        setRoles(rolesRes.data)
        setProjectRoles(projectRolesRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  function getRoleName(roleId) {
    const role = roles.find(r => r.id === roleId)
    return role ? role.name : 'Unknown'
  }

  async function handleApply() {
    if (!selectedRole) return
    setApplying(true)
    setError('')
    setMessage('')
    try {
      await API.post(`/projects/${id}/applications`, {
        role_id: parseInt(selectedRole)
      })
      setMessage('Application submitted successfully!')
      setSelectedRole('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>
  if (!project) return <div className="p-6 text-gray-500">Project not found.</div>

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full mb-2 inline-block ${
                project.status === 'open' ? 'bg-green-50 text-green-600' :
                project.status === 'in_progress' ? 'bg-blue-50 text-blue-600' :
                project.status === 'completed' ? 'bg-purple-50 text-purple-600' :
                'bg-gray-50 text-gray-500'
              }`}>
                {project.status.replace('_', ' ')}
              </span>
              <h1 className="text-2xl font-bold text-[#17345C]">{project.title}</h1>
            </div>
            <Link
              to={`/projects/${id}/workspace`}
              className="bg-[#17345C] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#1D5C85]"
            >
              Workspace
            </Link>
          </div>

          {project.description && (
            <p className="text-gray-600 text-sm mb-4">{project.description}</p>
          )}

          {project.repo_url && (
            <button
              onClick={() => window.open(project.repo_url, '_blank')}
              className="text-[#1D5C85] text-sm hover:underline"
            >
              GitHub Repository
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="font-bold text-[#17345C] mb-4">Roles Needed</h2>
          {projectRoles.length === 0 ? (
            <p className="text-gray-400 text-sm">No specific roles defined yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {projectRoles.map(pr => (
                <RoleTag key={pr.id} role={getRoleName(pr.role_id)} />
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="font-bold text-[#17345C] mb-4">Apply to this Project</h2>
          <p className="text-gray-500 text-sm mb-4">
            Select the role you want to contribute in.
          </p>

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

          <div className="flex gap-3">
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1D5C85] flex-1"
            >
              <option value="">Select your role</option>
              {projectRoles.map(pr => (
                <option key={pr.id} value={pr.role_id}>
                  {getRoleName(pr.role_id)}
                </option>
              ))}
            </select>
            <button
              onClick={handleApply}
              disabled={applying || !selectedRole}
              className="bg-[#17345C] text-white text-sm px-5 py-2 rounded-lg hover:bg-[#1D5C85] disabled:opacity-50"
            >
              {applying ? 'Applying...' : 'Apply'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProjectDetail