function SearchBar({ setBooks, setLoading, setError }) {
  const handleSearch = async (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (!query) return;

    setLoading(true);
    setError("");
    setBooks([]);

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${query}`
      );
      const data = await res.json();

      if (data.docs.length === 0) {
        setError("No books found. Try a different keyword.");
      } else {
        setBooks(data.docs.slice(0, 12));
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="search-container"
    >
      <input
        name="search"
        placeholder="Search books, topics, authors..."
        className="search-input"
      />

      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}

export default SearchBar;