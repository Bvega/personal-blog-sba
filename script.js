// Load saved posts or initialize an empty array
let posts = JSON.parse(localStorage.getItem('posts')) || [];

// Flags to track editing state
let editMode = false;
let editId = null;
let searchTerm = ''; // Current text input from search bar

// DOM element references
const postForm = document.getElementById('post-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const titleError = document.getElementById('title-error');
const contentError = document.getElementById('content-error');
const postsContainer = document.getElementById('posts-container');
const searchInput = document.getElementById('search');

// Save the current posts array to localStorage
function savePosts() {
  localStorage.setItem('posts', JSON.stringify(posts));
}

// Generate a simple unique ID for each post
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Display all blog posts dynamically on the page, filtered by search input
function renderPosts() {
  postsContainer.innerHTML = ''; // Clear previous posts

  // Filter posts based on search term (title or content)
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm)
  );

  filteredPosts.forEach(post => {
    const postEl = document.createElement('div');

    // Tailwind classes to style the post
    postEl.className = "bg-gray-50 border border-gray-300 p-4 rounded-md shadow-sm";

    // Insert styled post HTML
    postEl.innerHTML = `
      <h3 class="text-xl font-semibold text-gray-800">${post.title}</
