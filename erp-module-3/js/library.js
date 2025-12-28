/**
 * LIBRARY MODULE LOGIC
 * FR-30: Book catalog, issuance, returns, fines, library cards
 */

let libraryData = {
  books: [],
  cards: []
};

/* Load library data */
async function loadLibrary() {
  try {
    const response = await fetch("library.json");
    libraryData = await response.json();
    renderBooks();
  } catch (error) {
    console.error("Error loading library data:", error);
  }
}

/* Render book catalog */
function renderBooks() {
  const table = document.getElementById("bookTable");
  table.innerHTML = "";

  libraryData.books.forEach(book => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${book.isbn}</td>
      <td>${book.title}</td>
      <td>${book.status}</td>
      <td>${book.fine}</td>
      <td>
        ${book.status === "Available"
          ? `<button onclick="issueBook('${book.isbn}')">Issue</button>`
          : `<button onclick="returnBook('${book.isbn}')">Return</button>`
        }
      </td>
    `;

    table.appendChild(row);
  });
}

/* Issue book */
function issueBook(isbn) {
  const book = libraryData.books.find(b => b.isbn === isbn);

  if (!book) return;

  book.status = "Issued";
  book.fine = 0;
  renderBooks();
}

/* Return book and calculate fine */
function returnBook(isbn) {
  const book = libraryData.books.find(b => b.isbn === isbn);

  if (!book) return;

  // Simulated fine calculation
  book.status = "Available";
  book.fine = Math.floor(Math.random() * 500);

  renderBooks();
}

/* Create library card */
function createLibraryCard(studentName) {
  libraryData.cards.push({
    cardId: "LIB-" + (libraryData.cards.length + 1001),
    student: studentName
  });

  alert("Library card created for " + studentName);
}

/* Initialize Library Module */
loadLibrary();
