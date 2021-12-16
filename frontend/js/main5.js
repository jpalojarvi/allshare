'use strict';
//const url = 'http://localhost:3000'; // change url when uploading to server
const url = 'https://10.114.34.20/app'
// select existing html elements
const loginWrapper = document.querySelector('#login-wrapper');
const navBarPublic = document.querySelector('#navbar-public');
const navBarUser = document.querySelector('#navbar-user');
const userInfo = document.querySelector('#user-info');
const logOut = document.querySelector('#log-out');
const otsikko = document.querySelector('#otsikko');
const linnunlisays = document.querySelector('#linnun-lisays');
const loginForm = document.querySelector('#login-form');
const addUserForm = document.querySelector('#add-user-form');
const addForm = document.querySelector('#add-bird-form');
const modForm = document.querySelector('#mod-cat-form');
const modFormBird = document.querySelector('#mod-bird-form');
const omatKuvat = document.querySelector('#omatkuvat');
const ul = document.querySelector('ul');
const userList = document.querySelector('.add-owner');
const imageModal = document.querySelector('#image-modal');
const modalImage = document.querySelector('#image-modal img');
const searchForm = document.querySelector('#search-form');
const close = document.querySelector('#image-modal a');

// luxon date libary
const dt = luxon.DateTime;

// get user from sessionStorage
let user = JSON.parse(sessionStorage.getItem('user'));
if(!user){
  user = {roolinumero: 3}
}
console.log(user);
const startApp = (logged) => {
  console.log(logged);
  // show/hide forms + cats
  navBarPublic.style.display = logged ? 'none' : 'block';
  navBarUser.style.display = logged ? 'block' : 'none';
  loginWrapper.style.display = logged ? 'none' : 'none';
  //logOut.style.display = logged ? 'flex' : 'none';
  otsikko.style.display = logged ? 'none' : 'block';
  omatKuvat.style.display = logged ? 'block' : 'none';
  linnunlisays.style.display = logged ? 'block' : 'none';
  userInfo.innerHTML = logged ? `<span id="nimi">Hei</span> ${user.kayttajanimi}` : '';
  userInfo.style.display = logged? 'block' : 'none';
  
  if (logged) {
    if (user?.roolinumero > 0) {
      
      userList.remove();
    }
    getUserBird();
    getUsers();
    
  }else{
    getPublicBirds();
  }
};

// create bird cards
const createBirdCards = (birds) => {
  // clear ul
  ul.innerHTML = '';
  birds.forEach((bird) => {
    // create li with DOM methods
    const img = document.createElement('img');
    img.src = url + '/thumbnails/' + bird.tiedostonimi;
    img.alt = "kuva linnusta";
    img.classList.add('resp');

    // open large image when clicking image
    
    img.addEventListener('click', () => {
      modalImage.src = url + '/' + bird.tiedostonimi;
      imageModal.alt = bird.suominimi;
      imageModal.classList.toggle('hide');
      /*try {
        const coords = JSON.parse(bird.coords);
        // console.log(luomispaikka);
        addMarker(luomispaikka);
      } catch (e) {}*/
    }); 

    const figure = document.createElement('figure').appendChild(img);

    const h2 = document.createElement('h3');
    h2.innerHTML = bird.suominimi;
    const p1 = document.createElement('p');
    p1.innerHTML = `Lisätty: <spam id="nimi">${dt
      .fromISO(bird.lisaysaika)
      .setLocale('fi')
      .toLocaleString()}</spam>`;

    const p2 = document.createElement('p');
    p2.innerHTML = `<spam id="nimi">Kuvaus:</spam> ${bird.kuvaus}`;

    const p3 = document.createElement('p');
    p3.innerHTML = `<spam id="nimi">@</spam> ${bird.kayttajanimi}`;

    const li = document.createElement('li');
    li.classList.add('lintutaulu');

    li.appendChild(figure);
    li.appendChild(h2);
    li.appendChild(p2);

    li.appendChild(p1);
    li.appendChild(p3);
    ul.appendChild(li);
    
    if (user.roolinumero === 0 || user.kayttajanumero === bird.kayttajanumero) {    
      // add modify button

      const modButton = document.createElement('button');
      modButton.innerHTML = 'Muokkaa';
      modButton.addEventListener('click', () => {

        muokkaaKuvaus();
        const inputs = modForm.querySelectorAll('input');
        const inputsB = modFormBird.querySelectorAll('input');
        const textarea = modFormBird.querySelectorAll('textarea');
        inputs[0].value = bird.suominimi;
        inputs[1].value = bird.kuvaus;
        inputsB[0].value = bird.suominimi;
        textarea[0].value = bird.kuvaus;
        modForm.action = `${url}/bird/${bird.tiedostonumero}`;
        modFormBird.action = `${url}/bird/${bird.tiedostonumero}`;
        //if (user.roolinumero=== 0) modForm.querySelector('select').value = bird.kayttajanumero;
      }); 

      // delete selected bird
      const delButton = document.createElement('button');
      delButton.innerHTML = 'Poista';
      //console.log('käyttäjänumero', user.kayttajanumero, 'roolinumero', user.roolinumero);
      delButton.addEventListener('click', async () => {
        if(confirm('Haluatko varmasti poistaa kuvan?')){
          const fetchOptions = {
            method: 'DELETE',
            headers: {
              Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
          };
          try {
            const response = await fetch(
              url + '/bird/' + bird.tiedostonumero,
              fetchOptions
            );
            const json = await response.json();
            console.log('delete response', json);
            getUserBird();
          } catch (e) {
            console.log(e.message());
          }
        }
      });
      li.appendChild(modButton);
      li.appendChild(delButton);
    }
  });
};

// close modal
close.addEventListener('click', (evt) => {
  evt.preventDefault();
  imageModal.classList.toggle('hide');
});

// AJAX call

const getUserBird = async () => {
  console.log('getBird token ', sessionStorage.getItem('token'));
  try {
    const options = {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/bird', options); 
    const birds = await response.json();
    console.log('käyttäjän hakemat linnut', birds);
    createBirdCards(birds);
  } catch (e) {
    console.log(e.message);
  }
};

const getPublicBirds = async () => {
  try {
    const response = await fetch(url + '/bird');
    const birds = await response.json();
    console.log('public Birds', birds);
    createBirdCards(birds);
  } catch (e) {
    console.log(e.message);
  }
};

//search birds form
searchForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = new FormData(searchForm);
  const kysely = new URLSearchParams(data);
  console.log('haku sanaa haetaan', kysely.toString());
  const response = await fetch(url + '/bird/search?' + kysely);
  const birdSearch = await response.json();
  console.log('haku responce', response);
 
  if (!birdSearch.message) {
    createBirdCards(birdSearch);
    document.getElementById('uusimmat').innerHTML = 'Tulokset';
  } else {
    alert('Haullasi ei löydy kuvia.');
  }
});

// create user options to <select>
const createUserOptions = (users) => {
  // clear user list
  userList.innerHTML = '';
  users.forEach((user) => {
    // create options with DOM methods
    const option = document.createElement('option');
    option.value = user.kayttajanumero;
    option.innerHTML = user.kayttajanimi;
    option.classList.add('light-border');
    userList.appendChild(option);
  });
};

// get users to form options
const getUsers = async () => {
  try {
    const options = {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/user', options);
    const users = await response.json();
    createUserOptions(users);
  } catch (e) {
    console.log(e.message);
  }
};

// submit add bird form
addForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const fd = new FormData(addForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: fd,
  };
  //console.log('dataa session storagesta', sessionStorage);
  const response = await fetch(url + '/bird', fetchOptions);
  const json = await response.json();
  console.log('add response', json);
  getUserBird();
});

// submit modify form
modForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(modForm);
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: JSON.stringify(data),
  };

  console.log(fetchOptions);
  const response = await fetch(modForm.action, fetchOptions);
  const json = await response.json();
  console.log('modify response', json);
  getUserBird();
});
// submit modify bird modal
modFormBird.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(modFormBird);
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: JSON.stringify(data),
  };

  console.log(fetchOptions);
  const response = await fetch(modFormBird.action, fetchOptions);
  const json = await response.json();
  console.log('modify response', json);
  getUserBird();
});

// login
loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(loginForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url + '/auth/login', fetchOptions);
  const json = await response.json();
  if (!json.user) {
    alert(json.error.message);
  } else {
    // save token and user
    sessionStorage.setItem('token', json.token);
    sessionStorage.setItem('user', JSON.stringify(json.user));
    user = JSON.parse(sessionStorage.getItem('user'));
    startApp(true);
  }
});

// logout
logOut.addEventListener('click', async (evt) => {
  evt.preventDefault();
  try {
    const options = {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/auth/logout', options);
    const json = await response.json();
    console.log(json);
    // remove token
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    alert('Olet kirjautunut ulos');
    startApp(false);
    location.reload(); //ladataan sivu uudestaan
  } catch (e) {
    console.log(e.message);
  }
});

// submit register form
addUserForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(addUserForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(url + '/auth/register', fetchOptions);
  const json = await response.json();
  if (json.error) {
    alert(json.error.message);
  } else {
    alert(json.message);
  }
});

// when app starts, check if token exists and hide login form, show logout button and main content, get cats and users
(async () => {
  if (sessionStorage.getItem('token') && sessionStorage.getItem('user')) {
    // check if token valid
    try {
      const fetchOptions = {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const response = await fetch(url + '/user/token', fetchOptions);
      if (!response.ok) {
        startApp(false);
      } else {
        startApp(true);
      }
    } catch (e) {
      console.log(e.message);
    }
  } else {
    // when starting app and nothing in sessionStorage  = false
    startApp(false);
  }
})();
