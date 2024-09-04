import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../Context/Context";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { setSearchQuery } = useContext(Context);

  const handleSearchChange = (e) => {
    navigate("/shop");
    const query = e.target.value;
    setSearchQuery(query);
    setQuery(query);
  };

  return (
    <div>
      <input
        onChange={handleSearchChange}
        type="text"
        name="search"
        placeholder="Search"
        value={query}
        id="search-input"
      />
    </div>
  );
};

export default SearchBar;
