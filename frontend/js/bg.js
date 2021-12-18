//Navivalikko aukee kun hampurilaista painaa
let myFunction = () => {
  const x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
};
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
    document.getElementById("kayttajatunnus").placeholder = user.kayttajanimi;
    document.getElementById("kayttajaemail").placeholder =
      user.sahkopostiosoite;
  } else {
    x.style.display = "none";
  }
};
document
  .getElementById("naytaOmatTiedot")
  .addEventListener("click", omatTiedot);

//Avaa muokkaa lintu modaalin
let muokkaaKuvaus = () => {
  const x = document.getElementById("edit-bird-wrapper");
  if (x.style.display === "none") {
    x.style.display = "flex";
  } else {
    x.style.display = "none";
  }
};
//document.getElementById("muokkaaLintua").addEventListener("click", muokkaaKuvaus);

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

const input = document.getElementById("ajaxi");
const dataList = document.getElementById("listaa");
//bird names from db
const getBirdsNames = async () => {
  try {
    // Update the placeholder text.
    input.placeholder = "Loading options...";

    const response = await fetch(url + "/bird/names");
    const birdnames = await response.json();
    console.log("birdnames", birdnames);

    // Loop over the JSON array.
    birdnames.forEach((item) => {
      // Create a new <option> element.
      const option = document.createElement("option");
      // Set the value using the item in the JSON array.
      
      option.value = item.suominimi;
      //option.innerHTML = item.suominimi;

      // Add the <option> element to the <datalist>.
      input.appendChild(option);
      dataList.appendChild(option);
    });

    // Update the placeholder text.
    input.placeholder = "Kirjoita lajin nimi ja valitse se valikosta";
  } catch (e) {
    console.log(e.message);
    input.placeholder =
      "Lajiasi ei löydy tietokannasta. Ota yhtyes ylläpitoon :)";
  }
};
getBirdsNames();
