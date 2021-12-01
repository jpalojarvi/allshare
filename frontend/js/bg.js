function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  } 
  function kirjauduFunktio(){
    console.log('nappia painettu')
    var x = document.getElementById("login-wrapper");
    if (x.style.display === "none") {
      x.style.display = "flex";
    } else {
      x.style.display = "none";
    }
  }
  function rekisteroidyFunktio(){
    console.log('nappia painettu')
    var x = document.getElementById("register-wrapper");
    if (x.style.display === "none") {
      x.style.display = "flex";
    } else {
      x.style.display = "none";
    }
  }
  // Get the modal
  var modal = document.getElementById("id01");
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };