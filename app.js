import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔑 这里填你自己的
const SUPABASE_URL = "https://wuhbzcdodjavtcrigpfg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_rQ_F06BTAYZSPvBfNK6hMw_bCPrvo53";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🌙 load posts
async function loadPosts() {
  let { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  let postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  data.forEach(post => {
    let postDiv = document.createElement("div");
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

// 🌙 add post
window.addPost = async function () {
  let input = document.getElementById("postInput");
  let text = input.value;

  if (!text) return;

  await supabase.from("posts").insert([
    { text: text }
  ]);

  input.value = "";
  loadPosts();
};

// 🌙 add comment
window.addComment = async function (postId, btn) {
  let input = btn.parentElement.querySelector("input");
  let text = input.value;

  if (!text) return;

  await supabase.from("comments").insert([
    { post_id: postId, text: text }
  ]);

  input.value = "";
  alert("reply sent 🤍 (v3 basic)");
};

// 🌙 start
loadPosts();
