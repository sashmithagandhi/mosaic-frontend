import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api'
import RoleTag from '../components/RoleTag'

function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, rolesRes] = await Promise.all([
          API.get('/users/me'),
          API.get('/roles')
        ])
        setProfile(profileRes.data)
        // Get user roles by checking role counts
        const userRolesRes = await API.get('/roles/counts')
        setRoles(rolesRes.data)
      } catch (err) {
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>
  if (!profile) return null

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#17345C]">{profile.name}</h1>
              <p className="text-gray-400 text-sm mt-1">{profile.email}</p>
            </div>
            <Link
              to="/profile/edit"
              className="text-sm text-[#1D5C85] border border-[#1D5C85] px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              Edit Profile
            </Link>
          </div>

          {profile.bio && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
              <p className="text-gray-700 text-sm">{profile.bio}</p>
            </div>
          )}

          {profile.career_goals && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Career Goals</h3>
              <p className="text-gray-700 text-sm">{profile.career_goals}</p>
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Member since</h3>
            <p className="text-gray-700 text-sm">
              {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#17345C]">My Portfolio</h2>
          </div>
          <Link
            to={`/portfolio/${profile.id}`}
            className="text-sm text-[#1D5C85] hover:underline"
          >
            View public portfolio →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="font-bold text-[#17345C] mb-4">Quick Links</h2>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/projects"
              className="bg-[#17345C] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#1D5C85]"
            >
              Browse Projects
            </Link>
            <Link
              to="/projects/create"
              className="border border-[#17345C] text-[#17345C] text-sm px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              Create Project
            </Link>
            <Link
              to="/brainstorm"
              className="border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Brainstorm Ideas
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile