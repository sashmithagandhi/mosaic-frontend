function ContributionEntry({ contribution }) {
  return (
    <div className="border-l-4 border-[#1D5C85] pl-4 py-2">
      <p className="text-sm text-gray-700">{contribution.description}</p>
      {contribution.link && (
        <a href={contribution.link} target="_blank" className="text-xs text-[#1D5C85] hover:underline">
          {contribution.link}
        </a>
      )}
    </div>
  )
}
export default ContributionEntry