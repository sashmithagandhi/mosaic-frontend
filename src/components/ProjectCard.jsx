function ProjectCard({ project }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <h3 className="font-bold text-[#17345C]">{project.title}</h3>
      <p className="text-gray-500 text-sm mt-1">{project.description}</p>
    </div>
  )
}
export default ProjectCard