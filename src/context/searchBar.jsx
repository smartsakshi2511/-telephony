import React, { useState, useCallback, useRef } from "react";
import { IconButton, TextField, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debounceTimeout = useRef(null);

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchQuery(value);

      // Clear old timeout
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Set new timeout
      debounceTimeout.current = setTimeout(() => {
        if (onSearch) onSearch(value.trim());
      }, 300); // 300ms delay
    },
    [onSearch]
  );

  return (
    <>
      <Tooltip title="Search">
        <IconButton
          onClick={() => setShowSearch((prev) => !prev)}
          style={{ marginRight: "10px" }}
        >
          <SearchIcon />
        </IconButton>
      </Tooltip>

      {showSearch && (
        <TextField
          variant="outlined"
          size="small"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ marginRight: "10px" }}
          autoFocus
        />
      )}
    </>
  );
};

export default SearchBar;
