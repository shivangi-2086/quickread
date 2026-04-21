import { useState } from "react";
import BookCard from "./components/BookCard";
import Loader from "./components/Loader";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const searchBooks = async () => {
    if (!query) return;
    setLoading(true);
    setSelectedBook(null);

    const res = await fetch(
      `https://openlibrary.org/search.json?q=${query}`
    );
    const data = await res.json();
    setBooks(data.docs.slice(0, 20));
    setLoading(false);
  };

  const openBook = async (book) => {
    setSelectedBook(book);
    setDescription("Loading description...");

    if (!book.key) {
      setDescription("No description available.");
      return;
    }

    try {
      const res = await fetch(`https://openlibrary.org${book.key}.json`);
      const data = await res.json();

      if (typeof data.description === "string") {
        setDescription(data.description);
      } else if (data.description?.value) {
        setDescription(data.description.value);
      } else {
        setDescription("No description available for this book.");
      }
    } catch {
      setDescription("Failed to load description.");
    }
  };

  const saveForLater = () => {
    const saved =
      JSON.parse(localStorage.getItem("readLater")) || [];
    saved.push(selectedBook);
    localStorage.setItem("readLater", JSON.stringify(saved));
    alert("Saved to Read Later 📚");
  };

  return (
    <div className="app-container">
      <h1>📘 QuickRead</h1>
      <p>Decide what to read — faster.</p>

      <div className="search-container">
        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books, topics, authors..."
        />
        <button
          className="search-button"
          onClick={searchBooks}
        >
          Search
        </button>
      </div>

      {/* EMPTY STATE */}
      {!loading && books.length === 0 && (
        <p className="empty-state">
          Search for a topic to explore books.
        </p>
      )}

      {/* LOADER */}
      {loading && <Loader />}

      {/* FLEXBOX GRID */}
      <div className="books-container">
        {books.map((book, index) => (
          <BookCard
            key={index}
            book={book}
            onClick={() => openBook(book)}
          />
        ))}
      </div>

      {/* MODAL */}
      {selectedBook && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setSelectedBook(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#020617",
              padding: "24px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "600px",
            }}
          >
            <h2>{selectedBook.title}</h2>
            <p style={{ color: "#94a3b8", marginBottom: "10px" }}>
              {selectedBook.author_name?.[0]} •{" "}
              {selectedBook.first_publish_year}
            </p>

            <p
              style={{
                fontSize: "14px",
                color: "#cbd5f5",
                lineHeight: "1.6",
              }}
            >
              {description}
            </p>

            <button
              onClick={saveForLater}
              style={{
                marginTop: "20px",
                padding: "10px 16px",
                borderRadius: "8px",
                background: "#22c55e",
                color: "black",
                border: "none",
                cursor: "pointer",
              }}
            >
              📌 Read Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;