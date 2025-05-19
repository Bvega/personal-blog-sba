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
      <h3 class="text-xl font-semibold text-gray-800">${post.title}</h3>
      <small class="block text-sm text-gray-500 mb-2">Posted on: ${new Date(post.timestamp).toLocaleString()}</small>
      <p class="text-gray-700 mb-4">${post.content}</p>
      <div class="space-x-2">
        <button onclick="editPost('${post.id}')" class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-sm transition">
          Edit
        </button>
        <button onclick="deletePost('${post.id}')" class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm transition">
          Delete
        </button>
      </div>
    `;

    postsContainer.appendChild(postEl);
  });
}

// Clear error messages
function clearErrors() {
  titleError.textContent = '';
  contentError.textContent = '';
}

// Validate input fields and show errors if needed
function validateForm(title, content) {
  clearErrors();
  let valid = true;

  if (!title) {
    titleError.textContent = 'Title is required.';
    valid = false;
  }

  if (!content) {
    contentError.textContent = 'Content is required.';
    valid = false;
  }

  return valid;
}

// Handle form submission for creating or editing posts
postForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  // Validate input
  if (!validateForm(title, content)) return;

  if (editMode) {
    const index = posts.findIndex(post => post.id === editId);
    if (index !== -1) {
      posts[index].title = title;
      posts[index].content = content;
    }

    // Reset editing state
    editMode = false;
    editId = null;
  } else {
    // Create a new post object with timestamp
    const newPost = {
      id: generateId(),
      title,
      content,
      timestamp: new Date().toISOString()
    };
    posts.push(newPost);
  }

  savePosts();     // Save to localStorage
  renderPosts();   // Refresh UI
  postForm.reset(); // Clear form
});

// Delete post by ID
function deletePost(id) {
  posts = posts.filter(post => post.id !== id);
  savePosts();
  renderPosts();
}

// Load a post into form fields for editing
function editPost(id) {
  const post = posts.find(p => p.id === id);
  if (post) {
    titleInput.value = post.title;
    contentInput.value = post.content;
    editMode = true;
    editId = id;
  }
}

// Filter posts based on search input
searchInput.addEventListener('input', function () {
  searchTerm = this.value.toLowerCase();
  renderPosts();
});

// Initial load: show all saved posts
renderPosts();

