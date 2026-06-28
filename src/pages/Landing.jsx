import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#17345C] text-white text-center py-24 px-6">
        <h1 className="text-5xl font-bold mb-4">Every role is a piece.</h1>
        <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
          Mosaic transforms collaboration into attributable experience.
          Contribute through your specialization. Build your portfolio. Gain real team experience.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/register"
            className="bg-white text-[#17345C] font-semibold px-6 py-3 rounded-lg hover:bg-blue-100"
          >
            Get Started
          </Link>
          <Link
            to="/projects"
            className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#17345C]"
          >
            Browse Projects
          </Link>
        </div>
      </div>

      {/* Value Props */}
      <div className="max-w-5xl mx-auto py-20 px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="font-bold text-[#17345C] text-lg mb-2">Specialize</h3>
          <p className="text-gray-600 text-sm">
            Contribute only through your role — PM, BA, Designer, Developer, or Researcher.
            No more doing everything alone.
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-3">🤝</div>
          <h3 className="font-bold text-[#17345C] text-lg mb-2">Collaborate</h3>
          <p className="text-gray-600 text-sm">
            Work with people outside your circle. Build with a real cross-functional team
            before entering industry.
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-3">📁</div>
          <h3 className="font-bold text-[#17345C] text-lg mb-2">Attribute</h3>
          <p className="text-gray-600 text-sm">
            Every contribution is logged under your role. Your portfolio shows exactly
            what you did — not just that a project exists.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#1D5C85] text-white text-center py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">Ready to build something real?</h2>
        <p className="text-blue-200 mb-8">
          Instead of asking "do you have experience?" — employers will ask "what did you build on Mosaic?"
        </p>
        <Link
          to="/register"
          className="bg-white text-[#17345C] font-semibold px-8 py-3 rounded-lg hover:bg-blue-100"
        >
          Join Mosaic
        </Link>
      </div>
    </div>
  )
}

export default Landing