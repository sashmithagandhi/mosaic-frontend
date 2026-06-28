import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import CreateProject from './pages/CreateProject'
import Workspace from './pages/Workspace'
import Portfolio from './pages/Portfolio'
import Brainstorm from './pages/Brainstorm'
import BrainstormDetail from './pages/BrainstormDetail'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/create" element={<CreateProject />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/workspace" element={<Workspace />} />
        <Route path="/portfolio/:userId" element={<Portfolio />} />
        <Route path="/brainstorm" element={<Brainstorm />} />
        <Route path="/brainstorm/:id" element={<BrainstormDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App