// Ensure the script wrapper starts safely
(function() {
  const supabaseUrl = "https://wuhbzcdodjavtcrigpfg.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1aGJ6Y2RvZGphdnRjcmlncGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDk4NjIsImV4cCI6MjA5NjkyNTg2Mn0.Zr5ejcdWi2gw-mc0ULHaQfk4LO5Nhg5naVALcDqMzU44OTE1Mn0.4f1Z3f9m4H1J8mQ4m3m8M5m6m7m8m9m0m1m2m3m4m5m"; 

  let supabase;

  // 1. Safely initialize Supabase
  try {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      alert("❌ Critical Error: Supabase library failed to load from the internet CDN!");
      return;
    }
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
  } catch (e) {
    alert("❌ Initialization Failed: " + e.message);
    return;
  }

  // 2. Load posts function
  async function loadPosts() {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        alert("❌ Supabase Database Error: " + error.message);
        return;
      }

      const postsDiv = document.getElementById("posts");
      if (!postsDiv) return;
      postsDiv.innerHTML = "";

      if (data) {
        data.forEach((post) => {
          const postEl = document.createElement("div");
          postEl.className = "post";
          postEl.innerHTML = `<p>${post.text || ''}</p>`;
          postsDiv.appendChild(postEl);
        });
      }
    } catch (e) {
      alert("❌ System Error during load: " + e.message);
    }
  }

  // 3. Attach addPost directly to the global window object
  window.addPost = async function () {
    const input = document.getElementById("postInput");
    if (!input) return;
    
    const text = input.value.trim();
    if (!text) return;

    try {
      const { error } = await supabase
        .from("posts")
        .insert([{ text }]);

      if (error) {
        alert("❌ Cannot save post: " + error.message);
        return;
      }

      input.value = "";
      await loadPosts();
    } catch (e) {
      alert("❌ System Error during post: " + e.message);
    }
  };

  // 4. Run initial load safely once the page content is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadPosts);
  } else {
    loadPosts();
  }
})();
