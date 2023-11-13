document.addEventListener("DOMContentLoaded", function () {
  // Load contacts on page load
  loadContacts();

  // Search form submit
  document
    .getElementById("search-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const searchTerm = document.getElementById("search-input").value;
      searchContacts(searchTerm);
    });

  // Add contact form submit
  document
    .getElementById("add-contact-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const phone_number = document.getElementById("phone_number").value;
      const address = document.getElementById("address").value;
      addContact({ name, email, phone_number, address });
    });
});

function loadContacts() {
  fetch("/contacts") // Updated fetch URL
    .then((response) => response.json())
    .then((contacts) => displayContacts(contacts))
    .catch((error) => console.error("Error:", error));
}

function searchContacts(searchTerm) {
  fetch(`/contacts?search=${searchTerm}`) // Updated fetch URL
    .then((response) => response.json())
    .then((contacts) => displayContacts(contacts))
    .catch((error) => console.error("Error:", error));
}

function addContact(contact) {
  $.post("/contacts", contact, (response) => {
    alert(response.message);
    loadContacts();
  });
}
function displayContacts(contacts) {
  const container = document.getElementById("contacts-container");
  container.innerHTML = "";

  if (contacts.length === 0) {
    container.innerHTML = "<p>No contacts found.</p>";
  } else {
    const ul = document.createElement("ul");
    contacts.forEach((contact) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${contact.name}</strong><br>Email: ${
        contact.email
      }<br>Phone: ${contact.phone_number}<br>Address: ${
        contact.address || "N/A"
      }<br>`;

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => editContact(contact.id));
      li.appendChild(editButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteContact(contact.id));
      li.appendChild(deleteButton);

      ul.appendChild(li);
    });
    container.appendChild(ul);
  }
}

function editContact(id) {
  const name = prompt("Enter new name:");
  const email = prompt("Enter new email:");
  const phone_number = prompt("Enter new phone number:");
  const address = prompt("Enter new address:");

  const updatedContact = { name, email, phone_number, address };
  fetch(`/contacts/${id}`, {
    // Updated fetch URL
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedContact),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      loadContacts();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function deleteContact(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this contact?"
  );
  if (confirmDelete) {
    fetch(`/contacts/${id}`, {
      // Updated fetch URL
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        loadContacts();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
