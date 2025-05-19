// Load posts from localStorage or initialize as empty array
let posts = JSON.parse(localStorage.getItem('posts')) || [];

// Flags for edit mode
let editMode = false;
let editId = null;

// Get references to form and display elements
const postForm = document.getElementById('post-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const titleError = document.getElementById('title-error');
const contentError = document.getElementById('content-error');
const postsContainer = document.getElementById('posts-container');

/**
 * Save current posts array to localStorage
 */
function savePosts() {
  localStorage.setItem('posts', JSON.stringify(posts));
}

/**
 * Generate a simple unique ID for new posts
 */
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Render all blog posts to the screen
 */
function renderPosts() {
  postsContainer.innerHTML = ''; // Clear existing posts

  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.classList.add('post');

    // Display title, timestamp, and content
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
 * Clear all error messages
 */
function clearErrors() {
  titleError.textContent = '';
  contentError.textContent = '';
}

/**
 * Validate form fields and display error messages if needed
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
 * Handle form submission to create or update a blog post
 */
postForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  // Validate input
  if (!validateForm(title, content)) return;

  if (editMode) {
    // Update existing post
    const index = posts.findIndex(post => post.id === editId);
    if (index !== -1) {
      posts[index].title = title;
      posts[index].content = content;
      // Timestamp stays the same to preserve original post time
    }

    editMode = false;
    editId = null;
  } else {
    // Create new post object with timestamp
    const newPost = {
      id: generateId(),
      title,
      content,
      timestamp: new Date().toISOString() // Save creation time
    };

    posts.push(newPost);
  }

  savePosts();         // Persist to localStorage
  renderPosts();       // Refresh display
  postForm.reset();    // Clear form inputs
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
 * Load a post's data into the form for editing
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

// Initial load: display all posts on page load
renderPosts();
