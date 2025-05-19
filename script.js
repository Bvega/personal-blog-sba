// Load saved posts from localStorage or initialize an empty array
let posts = JSON.parse(localStorage.getItem('posts')) || [];

// Track whether we are editing an existing post
let editMode = false;
let editId = null;

// Store the current search filter
let searchTerm = '';

// DOM references
const postForm = document.getElementById('post-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const titleError = document.getElementById('title-error');
const contentError = document.getElementById('content-error');
const postsContainer = document.getElementById('posts-container');
const searchInput = document.getElementById('search');

/**
 * Save the posts array to localStorage
 */
function savePosts() {
  localStorage.setItem('posts', JSON.stringify(posts));
}

/**
 * Generate a unique ID for each post
 */
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Render the posts that match the search filter
 */
function renderPosts() {
  postsContainer.innerHTML = '';

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm)
  );

  filteredPosts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = "bg-gray-50 border border-gray-300 p-4 rounded-md shadow-sm";

    postEl.innerHTML = `
      <h3 class="text-xl font-semibold text-gray-800">${post.title}</h3>
      <small class="block text-sm text-gray-500 mb-2">Posted on: ${new Date(post.timestamp).toLocaleString()}</small>
      <p class="text-gray-700 mb-4">${post.content}</p>
      <div class="space-x-2">
        <button onclick="editPost('${post.id}')"
          class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-sm transition">
          Edit
        </button>
        <button onclick="deletePost('${post.id}')"
          class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm transition">
          Delete
        </button>
      </div>
    `;

    postsContainer.appendChild(postEl);
  });
}

/**
 * Clear validation error messages
 */
function clearErrors() {
  titleError.textContent = '';
  contentError.textContent = '';
}

/**
 * Validate form fields before submitting
 */
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

/**
 * Handle form submission for creating or editing a post
 */
postForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!validateForm(title, content)) return;

  if (editMode) {
    // Update existing post
    const index = posts.findIndex(post => post.id === editId);
    if (index !== -1) {
      posts[index].title = title;
      posts[index].content = content;
    }
    editMode = false;
    editId = null;
  } else {
    // Add new post
    const newPost = {
      id: generateId(),
      title,
      content,
      timestamp: new Date().toISOString()
    };
    posts.push(newPost);
  }

  savePosts();
  renderPosts();
  postForm.reset();
});

/**
 * Delete a post by ID
 */
function deletePost(id) {
  posts = posts.filter(post => post.id !== id);
  savePosts();
  renderPosts();
}

/**
 * Load post data into form for editing
 */
function editPost(id) {
  const post = posts.find(p => p.id === id);
  if (post) {
    titleInput.value = post.title;
    contentInput.value = post.content;
    editMode = true;
    editId = id;
  }
}

/**
 * Listen for search input changes and update the post display
 */
searchInput.addEventListener('input', function () {
  searchTerm = this.value.toLowerCase();
  renderPosts();
});

// On page load, render posts
renderPosts();

