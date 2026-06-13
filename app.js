const supabaseUrl = "https://wuhbzcdodjavtcrigpfg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1aGJ6Y2RvZGphdnRjcmlncGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDk4NjIsImV4cCI6MjA5NjkyNTg2Mn0.Zr5ejcdWi2gw-mc0ULHaQfk4LO5Nhg5naVALcDqMzU4";

let supabase;

// Safely initialize Supabase once the CDN is ready
function initSupabase() {
  if (window.supabase) {
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    loadPosts();
  } else {
    // If it's not ready yet, check again in 100ms
    setTimeout(initSupabase, 100);
  }
}

// 🌙 Load posts and their comments
async function loadPosts() {
  if (!supabase) return;

  // Fetch posts
  const { data: posts, error: postError } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (postError) {
    alert("Database Error (Loading Posts): " + postError.message);
    return;
  }

  // Fetch comments
  const { data: comments, error: commentError } = await supabase
    .from("comments")
    .select("*")
    .order("created_at", { ascending: true });

  if (commentError) {
    alert("Database Error (Loading Comments): " + commentError.message);
    return;
  }

  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";

    // Filter comments that belong to this specific post
    const postComments = comments ? comments.filter(c => c.post_id === post.id) : [];
    
    // Generate HTML for the comments list
    let commentsHtml = '<div class="comments-list">';
    postComments.forEach(comment => {
      commentsHtml += `<p class="comment-text">↳ ${comment.text}</p>`;
    });
    commentsHtml += '</div>';

    div.innerHTML = `
      <p class="post-main-text">${post.text}</p>
      
      ${commentsHtml}

      <div class="comment-box">
        <input type="text" placeholder="write a reply..." />
        <button onclick="addComment('${post.id}', this)">Reply</button>
      </div>
    `;

    postsDiv.appendChild(div);
  });
}

// 🌙 Add post
window.addPost = async function () {
  if (!supabase) return;
  const input = document.getElementById("postInput");
  const text = input.value.trim();

  if (!text) return;

  const { error } = await supabase
    .from("posts")
    .insert([{ text }]);

  if (error) {
    alert("Cannot post ❌ Error: " + error.message);
    return;
  }

  input.value = "";
  loadPosts();
};

// 🌙 Add comment
window.addComment = async function (postId, btn) {
  if (!supabase) return;
  const input = btn.parentElement.querySelector("input");
  const text = input.value.trim();

  if (!text) return;

  const { error } = await supabase
    .from("comments")
    .insert([{ post_id: postId, text }]);

  if (error) {
    alert("Cannot comment ❌ Error: " + error.message);
    return;
  }

  input.value = "";
  loadPosts();
};

// Start initialization checking
initSupabase();
