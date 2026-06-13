import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔑 replace with your own
const SUPABASE_URL = "https://wuhbzcdodjavtcrigpfg.supabase.co";
const SUPABASE_KEY = "sb_publishable_RQ_F06BTAYZSPvBfNK6hMw_bCPrvo53";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
    const postDiv = document.createElement("div");
    postDiv.className = "post";

    postDiv.innerHTML = `
      <p>${post.text}</p>

      <div class="comment-box">
        <input type="text" placeholder="write a reply..." />
        <button onclick="addComment('${post.id}', this)">Reply</button>
        <div class="comments"></div>
      </div>
    `;

    postsDiv.appendChild(postDiv);
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
    alert("Cannot post ❌ Check RLS or table");
    return;
  }

  input.value = "";
  loadPosts();
};

// 🌙 Add comment
window.addComment = async function (postId, btn) {
  const input = btn.parentElement.querySelector("input");
  const text = input.value.trim();

  if (!text) return;

  const { error } = await supabase
    .from("comments")
    .insert([
      { post_id: postId, text }
    ]);

  if (error) {
    console.log("Comment error:", error);
    alert("Cannot comment ❌");
    return;
  }

  input.value = "";
  alert("Reply sent 🤍");

  loadPosts();
};

// 🌙 init
loadPosts();
