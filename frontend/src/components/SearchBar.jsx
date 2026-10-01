export default function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 w-72 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
    />
  );
}