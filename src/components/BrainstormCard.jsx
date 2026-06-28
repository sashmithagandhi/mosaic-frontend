function BrainstormCard({ post }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <h3 className="font-bold text-[#17345C]">{post.title}</h3>
      <p className="text-gray-500 text-sm mt-1">{post.description}</p>
      <span className="text-xs text-blue-500 mt-2 inline-block capitalize">{post.status}</span>
    </div>
  )
}
export default BrainstormCard