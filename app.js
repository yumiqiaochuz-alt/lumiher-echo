function addPost() {
  let input = document.getElementById("postInput");
  let text = input.value;

  if (text.trim() === "") return;

  let postDiv = document.createElement("div");
  postDiv.className = "post";

  postDiv.innerHTML = `
    <p>${text}</p>

    <div class="comment-box">
      <input type="text" placeholder="write a reply..." />
      <button onclick="addComment(this)">Reply</button>
      <div class="comments"></div>
    </div>
  `;

  document.getElementById("posts").prepend(postDiv);

  input.value = "";
}

function addComment(btn) {
  let post = btn.parentElement;
  let input = post.querySelector("input");
  let commentsDiv = post.querySelector(".comments");

  if (input.value.trim() === "") return;

  let comment = document.createElement("div");
  comment.className = "comment";
  comment.innerText = "🤍 " + input.value;

  commentsDiv.appendChild(comment);

  input.value = "";
}
