"use client"

import { Search } from "lucide-react";
import { useRouter } from "next/navigation"
import { useState } from "react";

function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if(query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    }

  return (
    <div>
        <form onSubmit={handleSearch} className="relative">
           <input
           type="text"
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           placeholder="Search for events..."
           className="w-full py-3 pl-12 bg-white rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-300 focus:border-transparent transition-all duration-200"/> 
        
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
        <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-pink-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-500 transition-colors duration-200">
            Search
        </button>
        </form>
    </div>
  )
}
export default SearchBar