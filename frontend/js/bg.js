function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
//Avaa kirjautumismodaalin
let kirjaudu = () => {
  var x = document.getElementById("login-wrapper");
  if (x.style.display === "none") {
    x.style.display = "flex";
  } else {
    x.style.display = "none";
  }
}
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

// Get the modal
var modal = document.getElementById('register-wrapper');
var modallog = document.getElementById("login-wrapper");
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modallog) {
    modallog.style.display = "none";
  }
  if (event.target == modal) {
    modal.style.display = "none";
  }
};


