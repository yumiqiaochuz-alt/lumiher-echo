const supabaseUrl = "https://wuhbzcdodjavtcrigpfg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1aGJ6Y2RvZGphdnRjcmlncGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDk4NjIsImV4cCI6MjA5NjkyNTg2Mn0.Zr5ejcdWi2gw-mc0ULHaQfk4LO5Nhg5naVALcDqMzU4";

// create client (NO import version)
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 🌙 Load posts
async function loadPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Load error:", error);
    return;
  }

  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  data.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <p>${post.text}</p>

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
  const input = document.getElementById("postInput");
  const text = input.value.trim();

  if (!text) return;

  const { error } = await supabase
    .from("posts")
    .insert([{ text }]);

  if (error) {
    console.log("Insert error:", error);
    alert("Cannot post ❌ Check Supabase RLS or table");
    return;
  }

  input.value = "";
  loadPosts();
};

// 🌙 Add comment (simple version)
window.addComment = async function (postId, btn) {
  const input = btn.parentElement.querySelector("input");
  const text = input.value.trim();

  if (!text) return;

  const { error } = await supabase
    .from("comments")
    .insert([{ post_id: postId, text }]);

  if (error) {
    console.log("Comment error:", error);
    alert("Cannot comment ❌");
    return;
  }

  input.value = "";
  loadPosts();
};

// 🌙 start app
loadPosts();
