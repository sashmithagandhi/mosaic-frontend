import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api'
import ContributionEntry from '../components/ContributionEntry'

function Workspace() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [updates, setUpdates] = useState([])
  const [links, setLinks] = useState([])
  const [contributions, setContributions] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)

  const [newTask, setNewTask] = useState({ title: '', deadline: '' })
  const [newUpdate, setNewUpdate] = useState('')
  const [newLink, setNewLink] = useState({ label: '', url: '' })
  const [newContribution, setNewContribution] = useState({ role_id: '', description: '', link: '' })

  useEffect(() => {
    async function load() {
      try {
        const [projectRes, tasksRes, updatesRes, linksRes, contribRes, rolesRes] = await Promise.all([
          API.get(`/projects/${id}`),
          API.get(`/projects/${id}/tasks`),
          API.get(`/projects/${id}/updates`),
          API.get(`/projects/${id}/links`),
          API.get(`/projects/${id}/contributions`),
          API.get('/roles')
        ])
        setProject(projectRes.data)
        setTasks(tasksRes.data)
        setUpdates(updatesRes.data)
        setLinks(linksRes.data)
        setContributions(contribRes.data)
        setRoles(rolesRes.data)
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

  async function addTask(e) {
    e.preventDefault()
    try {
      const res = await API.post(`/projects/${id}/tasks`, newTask)
      setTasks([...tasks, res.data])
      setNewTask({ title: '', deadline: '' })
    } catch (err) { console.error(err) }
  }

  async function updateTaskStatus(taskId, status) {
    try {
      const res = await API.put(`/projects/${id}/tasks/${taskId}`, { status })
      setTasks(tasks.map(t => t.id === taskId ? res.data : t))
    } catch (err) { console.error(err) }
  }

  async function addUpdate(e) {
    e.preventDefault()
    try {
      const res = await API.post(`/projects/${id}/updates`, { content: newUpdate })
      setUpdates([...updates, res.data])
      setNewUpdate('')
    } catch (err) { console.error(err) }
  }

  async function addLink(e) {
    e.preventDefault()
    try {
      const res = await API.post(`/projects/${id}/links`, newLink)
      setLinks([...links, res.data])
      setNewLink({ label: '', url: '' })
    } catch (err) { console.error(err) }
  }

  async function addContribution(e) {
    e.preventDefault()
    try {
      const res = await API.post(`/projects/${id}/contributions`, {
        ...newContribution,
        role_id: parseInt(newContribution.role_id)
      })
      setContributions([...contributions, res.data])
      setNewContribution({ role_id: '', description: '', link: '' })
    } catch (err) { console.error(err) }
  }

  function LinkItem({ link }) {
    return (
      <div className="border border-gray-100 rounded-lg p-3">
        <p className="text-sm font-medium text-[#17345C]">{link.label}</p>
        <p className="text-xs text-gray-400 break-all">{link.url}</p>
        <button
          onClick={() => window.open(link.url, '_blank')}
          className="text-xs text-[#1D5C85] mt-1 hover:underline"
        >
          Open link
        </button>
      </div>
    )
  }

  if (loading) return <div className="p-6 text-gray-500">Loading workspace...</div>
  if (!project) return <div className="p-6 text-gray-500">Project not found.</div>

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#17345C]">{project.title}</h1>
          <p className="text-gray-500 text-sm mt-1">Project Workspace</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Tasks */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#17345C] mb-4">Tasks</h2>
            <form onSubmit={addTask} className="flex flex-col gap-2 mb-4">
              <input
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title"
                required
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
              />
              <input
                type="date"
                value={newTask.deadline}
                onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
              />
              <button
                type="submit"
                className="bg-[#17345C] text-white text-sm py-2 rounded-lg hover:bg-[#1D5C85]"
              >
                Add Task
              </button>
            </form>
            <div className="flex flex-col gap-2">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between border border-gray-100 rounded-lg p-3">
                  <div>
                    <p className="text-sm text-gray-700">{task.title}</p>
                    {task.deadline && (
                      <p className="text-xs text-gray-400">Due: {task.deadline}</p>
                    )}
                  </div>
                  <select
                    value={task.status}
                    onChange={e => updateTaskStatus(task.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-gray-400 text-sm">No tasks yet.</p>
              )}
            </div>
          </div>

          {/* Shared Links */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#17345C] mb-4">Shared Links</h2>
            <form onSubmit={addLink} className="flex flex-col gap-2 mb-4">
              <input
                value={newLink.label}
                onChange={e => setNewLink({ ...newLink, label: e.target.value })}
                placeholder="Label (e.g. Google Meet)"
                required
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
              />
              <input
                value={newLink.url}
                onChange={e => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="https://..."
                required
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
              />
              <button
                type="submit"
                className="bg-[#17345C] text-white text-sm py-2 rounded-lg hover:bg-[#1D5C85]"
              >
                Add Link
              </button>
            </form>
            <div className="flex flex-col gap-2">
              {links.map(link => (
                <LinkItem key={link.id} link={link} />
              ))}
              {links.length === 0 && (
                <p className="text-gray-400 text-sm">No links yet.</p>
              )}
            </div>
          </div>

          {/* Updates */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#17345C] mb-4">Updates</h2>
            <form onSubmit={addUpdate} className="flex flex-col gap-2 mb-4">
              <textarea
                value={newUpdate}
                onChange={e => setNewUpdate(e.target.value)}
                placeholder="Post an update to the team..."
                rows={2}
                required
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
              />
              <button
                type="submit"
                className="bg-[#17345C] text-white text-sm py-2 rounded-lg hover:bg-[#1D5C85]"
              >
                Post Update
              </button>
            </form>
            <div className="flex flex-col gap-3">
              {updates.map(update => (
                <div key={update.id} className="border-l-4 border-[#1D5C85] pl-3 py-1">
                  <p className="text-sm text-gray-700">{update.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(update.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {updates.length === 0 && (
                <p className="text-gray-400 text-sm">No updates yet.</p>
              )}
            </div>
          </div>

          {/* Contributions */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#17345C] mb-4">Log Contribution</h2>
            <form onSubmit={addContribution} className="flex flex-col gap-2 mb-4">
              <select
                value={newContribution.role_id}
                onChange={e => setNewContribution({ ...newContribution, role_id: e.target.value })}
                required
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
              >
                <option value="">Select your role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              <textarea
                value={newContribution.description}
                onChange={e => setNewContribution({ ...newContribution, description: e.target.value })}
                placeholder="What did you contribute?"
                rows={2}
                required
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
              />
              <input
                value={newContribution.link}
                onChange={e => setNewContribution({ ...newContribution, link: e.target.value })}
                placeholder="Link to commit/PR (optional)"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1D5C85]"
              />
              <button
                type="submit"
                className="bg-[#17345C] text-white text-sm py-2 rounded-lg hover:bg-[#1D5C85]"
              >
                Log Contribution
              </button>
            </form>
            <div className="flex flex-col gap-3">
              {contributions.map(c => (
                <div key={c.id} className="border border-gray-100 rounded-lg p-3">
                  <span className="text-xs font-medium text-[#1D5C85]">
                    {getRoleName(c.role_id)}
                  </span>
                  <ContributionEntry contribution={c} />
                </div>
              ))}
              {contributions.length === 0 && (
                <p className="text-gray-400 text-sm">No contributions logged yet.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Workspacex