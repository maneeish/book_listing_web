let booksData = [];

//fetching data from the FreeAPI
async function fetchingBooks() {
  const url =
    "https://api.freeapi.app/api/v1/public/books?page=1&limit=18&inc=kind%252Cid%252Cetag%252CvolumeInfo&query=tech";
  const options = { method: "GET", headers: { accept: "application/json" } };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.data.data;
  } catch (error) {
    console.error(error);
  }
}

//Adding fetched data in the card
async function displayBooks() {
  const cardContainer = document.querySelector(".card-container");

  let data = await fetchingBooks();
  if (!data) {
    console.error("No data received from API");
    return [];
  }

  booksData = data.map((e) => {
    const volumeInfo = e.volumeInfo || {};
    const authors = volumeInfo.authors?.join(", ") ?? "Info not available";
    const publisher = volumeInfo.publisher ?? "Info not available";
    const publishedDate = volumeInfo.publishedDate ?? "Info not available";
    const title = volumeInfo.title ?? "Untitled";
    const link = volumeInfo.infoLink ?? "";
    const imageLink =
      volumeInfo.imageLinks?.thumbnail ?? "./assets/images/noCover.webp";

    let linkTag = document.createElement("a");
    linkTag.href = link;
    linkTag.target = "_blank";

    let bookCard = document.createElement("div");
    bookCard.classList.add("card");

    linkTag.appendChild(bookCard);
    bookCard.innerHTML = ` 
      <div class="image-container">
        <div class="image">
          <img
            src="${imageLink}"
            alt="${title} book cover"
            loading="lazy"
          />
        </div>
      </div>
      <div class="about">
        <h2 class="title">${title}</h2>
        <div class="book-meta">
          <div class="Author"><strong>Author:</strong> ${authors}</div>
          <div class="Publisher"><strong>Publisher:</strong> ${publisher}</div>
        </div>
        <div class="publish-date"><strong>Published on:</strong> ${publishedDate}</div>
      </div>
    `;
    cardContainer.appendChild(linkTag);

    return { title, authors, publisher, publishedDate, bookCard };
  });
}

// function to filter search books
function searchBooks() {
  const searchBar = document.querySelector(".search-field");
  searchBar.addEventListener("input", () => {
    let searchInput = searchBar.value.toLowerCase();

    booksData.forEach((e) => {
      let isVisible =
        e.title.toLowerCase().includes(searchInput) ||
        e.authors.toLowerCase().includes(searchInput);
      e.bookCard.classList.toggle("hide", !isVisible);
    });
  });
}

//function to changeViewType
function changeViewType() {
  const viewBtn = document.getElementById("view-type");
  const cardContainer = document.querySelector(".card-container");

  viewBtn.addEventListener("click", () => {
    cardContainer.classList.toggle("grid");
  });
}

// funtion to trigger sort btn
function setupSorting() {
  const sortSelect = document.getElementById("sort");

  sortSelect.addEventListener("change", () => {
    const sortBy = sortSelect.value;

    if (sortBy === "byNameASC") {
      sortBooks("titleASC");
    } else if (sortBy === "byNameDES") {
      sortBooks("titleDES");
    } else if (sortBy === "byDateNew") {
      sortBooks("dateNew");
    } else if (sortBy === "byDateOld") {
      sortBooks("dateOld");
    }
  });
}

// function to sort books according to title and date
function sortBooks(by = "title") {
  if (by === "titleASC") {
    booksData.sort((a, b) => a.title.localeCompare(b.title));
  } else if (by === "titleDES") {
    booksData.sort((a, b) => b.title.localeCompare(a.title));
  } else if (by === "dateNew") {
    booksData.sort((a, b) => {
      const dateA =
        a.publishedDate === "Info not available"
          ? new Date(0)
          : new Date(a.publishedDate);
      const dateB =
        b.publishedDate === "Info not available"
          ? new Date(0)
          : new Date(b.publishedDate);
      return dateB - dateA;
    });
  } else if (by === "dateOld") {
    booksData.sort((a, b) => {
      const dateA =
        a.publishedDate === "Info not available"
          ? new Date(0)
          : new Date(a.publishedDate);
      const dateB =
        b.publishedDate === "Info not available"
          ? new Date(0)
          : new Date(b.publishedDate);
      return dateA - dateB;
    });
  }

  //redenring the book cards
  const cardContainer = document.querySelector(".card-container");
  cardContainer.innerHTML = "";
  booksData.forEach((book) => {
    cardContainer.appendChild(book.bookCard.parentElement);
  });
}

//executing functions
displayBooks();
searchBooks();
changeViewType();
setupSorting();
