//Navivalikko aukee kun hampurilaista painaa
let myFunction = () => {
  const x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
//Avaa kirjautumismodaalin
let kirjaudu = () => {
  const x = document.getElementById("login-wrapper");
  if (x.style.display === "none") {
    x.style.display = "flex";
  } else {
    x.style.display = "none";
  }
};
document.getElementById("kirjaudu").addEventListener("click", kirjaudu);

//Avaa rekistreröitymismodaalin
let rekisteroi = () => {
  const x = document.getElementById("register-wrapper");
  if (x.style.display === "none") {
    x.style.display = "flex";
  } else {
    x.style.display = "none";
  }
};
document.getElementById("rekisteroidy").addEventListener("click", rekisteroi);

//Avaa omat tiedot modaalin
let omatTiedot = () => {
  const x = document.getElementById("user-wrapper");
  if (x.style.display === "none") {
    x.style.display = "flex";
  } else {
    x.style.display = "none";
  }
};
document.getElementById("naytaOmatTiedot").addEventListener("click", omatTiedot);

//Avaa muokkaa lintu modaalin
let muokkaaKuvaus = () => {
  const x = document.getElementById("edit-bird-wrapper");
  if (x.style.display === "none") {
    x.style.display = "flex";
  } else {
    x.style.display = "none";
  }
};
document.getElementById("muokkaaLintua").addEventListener("click", muokkaaKuvaus);

// Get the modal
const modal = document.getElementById("register-wrapper");
const modallog = document.getElementById("login-wrapper");
const modaladd = document.getElementById("add-bird-wrapper");
// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
  if (event.target == modallog) {
    modallog.style.display = "none";
  }
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (event.target == modaladd) {
    modaladd.style.display = "none";
  }
};

// DATALIST AJAX HÄRVELI
// Get the <datalist> and <input> elements.
var dataList = document.getElementById("json-datalist");
var input = document.getElementById("ajax");

// Create a new XMLHttpRequest.
var request = new XMLHttpRequest();

// Handle state changes for the request.
request.onreadystatechange = (response) => {
  if (request.readyState === 4) {
    if (request.status === 200) {
      // Parse the JSON
      var jsonOptions = JSON.parse(request.responseText);

      // Loop over the JSON array.
      jsonOptions.forEach(function (item) {
        // Create a new <option> element.
        var option = document.createElement("option");
        // Set the value using the item in the JSON array.
        option.value = item;
        // Add the <option> element to the <datalist>.
        dataList.appendChild(option);
      });

      // Update the placeholder text.
      input.placeholder = "Valitse laji";
    } else {
      // An error occured :(
      input.placeholder = "Lajiasi ei löydy tietokannasta. Ota yhtyes ylläpitoon :)";
    }
  }
};

// Update the placeholder text.
input.placeholder = "Loading options...";

// Set up and make the request.
request.open(
  "GET",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/4621/html-elements.json",
  true
);
request.send();
