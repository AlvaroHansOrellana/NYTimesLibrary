// Configuración de la API
const API_KEY = 'KwCx0gWhrX55ne0bYo9JC1fNtNgx5KL0';
const API_BASE_URL = 'https://api.nytimes.com/svc/books/v3';

// Función para mostrar el spinner de carga
function toggleSpinner(visible) {
  const spinner = document.getElementById('loading');
  spinner.style.display = visible ? 'block' : 'none';
}

// Llamada para obtener las listas de libros
const getBookLists = async () => {
  toggleSpinner(true);
  try {
    const response = await fetch(`${API_BASE_URL}/lists/names.json?api-key=${API_KEY}`);
    if (!response.ok) throw new Error("No se pudo obtener la lista.");
    const data = await response.json();
    displayBookLists(data.results);
  } catch (error) {
    console.error("Error al cargar listas:", error);
    alert('Error al cargar listas de libros. Intenta de nuevo.');
  } finally {
    toggleSpinner(false);
  }
};

// Renderizar el dashboard con todas las listas de libros
const displayBookLists = (lists) => {
  const listsContainer = document.getElementById('lists-container');
  listsContainer.innerHTML = ''; // Limpia el contenedor de listas
  listsContainer.style.display = 'block';

  lists.forEach((list) => {
    const listDiv = document.createElement('div');
    listDiv.className = 'list-item';
    listDiv.innerHTML = `
      <h2>${list.display_name}</h2>
      <p>Antiguo: ${list.oldest_published_date}</p>
      <p>Última actualización: ${list.newest_published_date}</p>
      <p>Actualización: ${list.updated}</p>
      <button data-list="${list.list_name_encoded}" class="load-list-btn">Ver Lista</button>
    `;
    listsContainer.appendChild(listDiv);
  });
};

// Escuchar los clics para cargar una lista específica
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('load-list-btn')) {
    const listName = event.target.getAttribute('data-list');
    loadBookList(listName);
  }
});

// Llamada a la API para cargar una lista específica de libros
const loadBookList = async (listName) => {
  toggleSpinner(true);
  try {
    const response = await fetch(`${API_BASE_URL}/lists/current/${listName}.json?api-key=${API_KEY}`);
    if (!response.ok) throw new Error("No se pudo cargar la lista.");
    const data = await response.json();
    showBookList(data.results.books);
  } catch (error) {
    console.error("Error al cargar lista de libros:", error);
    alert('Error al cargar la lista. Intenta nuevamente.');
  } finally {
    toggleSpinner(false);
  }
};

// Renderizar la lista de libros específica en el DOM
const showBookList = (books) => {
  const listsContainer = document.getElementById('lists-container');
  const booksContainer = document.getElementById('books-container');
  listsContainer.style.display = 'none';
  booksContainer.style.display = 'block';
  booksContainer.innerHTML = `<button onclick="getBookLists()">Atrás</button>`;

  books.forEach((book, index) => {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book-item';
    bookDiv.innerHTML = `
      <h3>#${index + 1} - ${book.title}</h3>
      <img src="${book.book_image}" alt="Imagen de ${book.title}">
      <p>Semanas en lista: ${book.weeks_on_list}</p>
      <p>${book.description}</p>
      <a href="${book.amazon_product_url}" target="_blank">Compra en Amazon</a>
      <button class="favorite-btn" data-isbn="${book.primary_isbn13}">Agregar a favoritos</button>
    `;
    booksContainer.appendChild(bookDiv);
  });

  // Add event listeners for favorite buttons
  const favoriteButtons = document.querySelectorAll('.favorite-btn');
  favoriteButtons.forEach(button => {
    button.addEventListener('click', addToFavorites);
  });
};

// Function to add a book to favorites
const addToFavorites = async (event) => {
  const user = auth.currentUser;
  if (!user) {
    alert('Debes iniciar sesión para agregar libros a favoritos.');
    return;
  }

  const isbn = event.target.getAttribute('data-isbn');
  const bookTitle = event.target.parentElement.querySelector('h3').textContent.split(' - ')[1];

  try {
    await db.collection('favorites').doc(user.uid).set({
      [isbn]: bookTitle
    }, { merge: true });
    alert(`"${bookTitle}" ha sido agregado a tus favoritos.`);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    alert('Error al agregar el libro a favoritos. Intenta nuevamente.');
  }
};

// Function to initialize the app
function initApp() {
  getBookLists();
}