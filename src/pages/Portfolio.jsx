import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api'
import RoleTag from '../components/RoleTag'
import ContributionEntry from '../components/ContributionEntry'

function Portfolio() {
  const { userId } = useParams()
  const [portfolio, setPortfolio] = useState(null)
  const [roles, setRoles] = useState([])
  const [projects, setProjects] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [portfolioRes, rolesRes] = await Promise.all([
          API.get(`/users/${userId}/portfolio`),
          API.get('/roles')
        ])
        setPortfolio(portfolioRes.data)
        setRoles(rolesRes.data)

        // Load project details for each project
        const projectIds = [...new Set(portfolioRes.data.projects.map(p => p.project_id))]
        const projectDetails = {}
        await Promise.all(
          projectIds.map(async (pid) => {
            try {
              const res = await API.get(`/projects/${pid}`)
              projectDetails[pid] = res.data
            } catch {}
          })
        )
        setProjects(projectDetails)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  function getRoleName(roleId) {
    const role = roles.find(r => r.id === roleId)
    return role ? role.name : 'Unknown'
  }

  if (loading) return <div className="p-6 text-gray-500">Loading portfolio...</div>
  if (!portfolio) return <div className="p-6 text-gray-500">Portfolio not found.</div>

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="bg-[#17345C] text-white rounded-xl p-8 mb-6">
          <h1 className="text-3xl font-bold mb-1">{portfolio.user.name}</h1>
          {portfolio.user.bio && (
            <p className="text-blue-200 text-sm">{portfolio.user.bio}</p>
          )}
          <div className="mt-4 text-blue-200 text-sm">
            {portfolio.projects.length} project{portfolio.projects.length !== 1 ? 's' : ''} •{' '}
            {portfolio.contributions.length} contribution{portfolio.contributions.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-[#17345C] mb-4">Projects</h2>
          {portfolio.projects.length === 0 ? (
            <p className="text-gray-400 text-sm">No projects yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {portfolio.projects.map((p, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-[#17345C]">
                      {projects[p.project_id]?.title || `Project #${p.project_id}`}
                    </h3>
                    <RoleTag role={getRoleName(p.role_id)} />
                  </div>
                  {projects[p.project_id]?.description && (
                    <p className="text-gray-500 text-sm">
                      {projects[p.project_id].description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contributions */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-bold text-[#17345C] mb-4">Contributions</h2>
          {portfolio.contributions.length === 0 ? (
            <p className="text-gray-400 text-sm">No contributions logged yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {portfolio.contributions.map((c, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <RoleTag role={getRoleName(c.role_id)} />
                    <span className="text-xs text-gray-400">
                      {projects[c.project_id]?.title || `Project #${c.project_id}`}
                    </span>
                  </div>
                  <ContributionEntry contribution={c} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Portfolio