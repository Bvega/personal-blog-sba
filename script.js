// Load posts from localStorage or start with an empty array
let posts = JSON.parse(localStorage.getItem('posts')) || [];

// State variables
let editMode = false;
let editId = null;
let searchTerm = ''; // Current text input from search bar

// Get DOM elements
const postForm = document.getElementById('post-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const titleError = document.getElementById('title-error');
const contentError = document.getElementById('content-error');
const postsContainer = document.getElementById('posts-container');
const searchInput = document.getElementById('search');

/**
 * Save posts to localStorage
 */
function savePosts() {
  localStorage.setItem('posts', JSON.stringify(posts));
}

/**
 * Generate a unique ID for a new post
 */
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Render blog posts on the page, applying search filter
 */
function renderPosts() {
  postsContainer.innerHTML = '';

  // Filter posts based on search term (case-insensitive)
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm)
  );

  // Render each filtered post
  filteredPosts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.classList.add('post');

    postEl.innerHTML = `
      <h3>${post.title}</h3>
      <small>Posted on: ${new Date(post.timestamp).toLocaleString()}</small>
      <p>${post.content}</p>
      <button onclick="editPost('${post.id}')">Edit</button>
      <button class="delete" onclick="deletePost('${post.id}')">Delete</button>
    `;

    postsContainer.appendChild(postEl);
  });
}

/**
 * Clear form validation error messages
 */
function clearErrors() {
  titleError.textContent = '';
  contentError.textContent = '';
}

/**
 * Validate form input fields
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
 * Handle form submission to add or update a blog post
 */
postForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!validateForm(title, content)) return;

  if (editMode) {
    const index = posts.findIndex(post => post.id === editId);
    if (index !== -1) {
      posts[index].title = title;
      posts[index].content = content;
    }
    editMode = false;
    editId = null;
  } else {
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
 * Delete a post by its unique ID
 */
function deletePost(id) {
  posts = posts.filter(post => post.id !== id);
  savePosts();
  renderPosts();
}

/**
 * Populate form with selected post for editing
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
 * Listen for search input and update the post list accordingly
 */
searchInput.addEventListener('input', function () {
  searchTerm = this.value.toLowerCase();
  renderPosts();
});

// On page load, show saved posts
renderPosts();
