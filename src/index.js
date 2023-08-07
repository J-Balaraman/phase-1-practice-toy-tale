let addToy = false;

function addCard(character) {
  let card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h2>${character.name}</h2>
    <img src="${character.image}" class="toy-avatar" />
    <p>Likes: <span id="likes-${character.id}">${character.likes}</span></p>
    <button class="like-btn" id="${character.id}">Like ❤️</button>
  `;

  const likeButton = card.querySelector('.like-btn');
  const likesSpan = card.querySelector(`#likes-${character.id}`);
  
  likeButton.addEventListener('click', () => {
    const updatedLikes = parseInt(likesSpan.textContent) + 1;
    updateLikes(character.id, updatedLikes, likesSpan);
  });

  document.querySelector('#toy-collection').appendChild(card);
}

function addNewCard() {
  const nameInput = document.querySelector('[name="name"]');
  const imageInput = document.querySelector('[name="image"]');
  
  const newName = nameInput.value;
  const newImage = imageInput.value;

  if (!newName || !newImage) {
    console.error("Both name and image fields are required.");
    return;
  }

  fetch('http://localhost:3000/toys/', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "name": newName,
      "image": newImage,
      "likes": 0
    })
  })
  .then(resp => resp.json())
  .then(newToy => {
    addCard(newToy);
    nameInput.value = ''; 
    imageInput.value = '';
  })
}


function updateLikes(toyId, newLikes, likesSpan) {
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      likes: newLikes,
    }),
  })
  .then(resp => resp.json())
  .then(updatedToy => {
    likesSpan.textContent = updatedToy.likes;
  })
}

function getAllCharacters() {
  fetch('http://localhost:3000/toys')
    .then(resp => resp.json())
    .then(data => data.forEach(character => addCard(character)))
}

function initialize() {
  getAllCharacters();
}

document.addEventListener("DOMContentLoaded", () => {
  initialize();
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const addForm = document.querySelector(".add-toy-form");
  addForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addNewCard();
  });
});
