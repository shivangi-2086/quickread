function BookCard({ book, onClick }) {
  const coverId = book.cover_i;
  const imageUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : "https://via.placeholder.com/200x280?text=No+Cover";

  return (
    <div
      onClick={onClick}
      className="book-card"

    >
      {/* BOOK COVER */}
      <img
        src={imageUrl}
        alt={book.title}
        className="book-cover"
      />

      {/* INFO */}
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author_name?.[0] || "Unknown Author"}</p>
        <p className="book-year">{book.first_publish_year || "Year N/A"}</p>
      </div>
    </div>
  );
}

export default BookCard;