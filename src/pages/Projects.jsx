import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api'
import ProjectCard from '../components/ProjectCard'

function Projects() {
  const [projects, setProjects] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [projectsRes, rolesRes] = await Promise.all([
          API.get('/projects'),
          API.get('/roles')
        ])
        setProjects(projectsRes.data)
        setRoles(rolesRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function applyFilters() {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (filterRole) params.append('role_id', filterRole)
      if (filterStatus) params.append('status', filterStatus)
      const res = await API.get(`/projects?${params.toString()}`)
      setProjects(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="p-6 text-gray-500">Loading projects...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#17345C]">Projects</h1>
            <p className="text-gray-500 text-sm mt-1">Find a project that needs your specialization.</p>
          </div>
          <Link
            to="/projects/create"
            className="bg-[#17345C] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#1D5C85]"
          >
            + Create Project
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex flex-wrap gap-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1D5C85] flex-1 min-w-[200px]"
          />
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
          >
            <option value="">All Roles</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={applyFilters}
            className="bg-[#1D5C85] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#17345C]"
          >
            Filter
          </button>
        </div>

        {/* Project Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">No projects yet.</p>
            <Link to="/projects/create" className="text-[#1D5C85] hover:underline text-sm">
              Be the first to create one →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(project => (
              <Link to={`/projects/${project.id}`} key={project.id}>
                <ProjectCard project={project} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects