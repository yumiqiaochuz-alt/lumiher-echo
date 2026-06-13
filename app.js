const supabaseUrl = "https://wuhbzcdodjavtcrigpfg.supabase.co";
// Keep your exact supabaseKey string from your original file here:
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1aGJ6Y2RvZGphdnRjcmlncGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDk4NjIsImV4cCI6MjA5NjkyNTg2Mn0.Zr5ejcdWi2gw-mc0ULHaQfk4LO5Nhg5naVALcDqMzU4"; 

// Create client (NO import version)
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 🌙 Load posts
async function loadPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Load error:", error);
    alert("Connection Fail: " + error.message);
    return;
  }

  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  data.forEach((post) => {
    const postEl = document.createElement("div");
    postEl.className = "post";
    postEl.innerHTML = `<p>${post.text}</p>`;
    postsDiv.appendChild(postEl);
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
    alert("Database Error: " + error.message + " (" + error.code + ")");
    return;
  }

  input.value = "";
  loadPosts();
};

// Load posts immediately when page opens
loadPosts();
