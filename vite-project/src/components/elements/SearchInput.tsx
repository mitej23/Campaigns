import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type SearchInputParams = {
  query: string;
  setQuery: (value: string) => void;
};

const SearchInput: React.FC<SearchInputParams> = ({ query, setQuery }) => {
  return (
    <div className="flex flex-row items-center">
      <Search size={20} className="absolute ml-4 text-gray-400" />
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Campaigns..."
        className="pl-12 w-[25rem]"
      />
    </div>
  );
};

export default SearchInput;
