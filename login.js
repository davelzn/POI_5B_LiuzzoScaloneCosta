export const createLogin = () => {
  const inputName = document.querySelector("#user");
  const inputPassword = document.querySelector("#psw");
  const loginButton = document.getElementById("loginBtn");
  const esitoLog = document.getElementById("esitoLog");
  let isLogged = false;

  // Funzione login
  const login = (name, password) => {
    return new Promise((resolve, reject) => {
      fetch("http://ws.cipiaceinfo.it/credential/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "key": myToken
        },
        body: JSON.stringify({
          username: name,
          password: password
        })
      })
        .then(r => r.json())
        .then(r => {
          console.log(r)
          resolve(r.result);
        })
        .catch(reject);
    });
  };

  loginButton.onclick = () => {
    console.log(inputName.value, inputPassword.value);
    login(inputName.value, inputPassword.value).then(result => {
      if (result) {
        isLogged = true;
        console.log(isLogged);
        loginModal.style.display = "none";
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
        window.location.hash = 'admin';
        headerAd.classList.remove = "hidden"
        cTableAdmin(tableContAd,list)
      } else {
        esitoLog.innerHTML =
          '<div class="alert alert-danger">Credenziali Errate!</div>';
      }
    }).catch(error => {
      console.error('Errore durante il login:', error);
      esitoLog.innerHTML =
        '<div class="alert alert-danger">Si è verificato un errore durante il login!</div>';
    });
  };
  return {
    isLogged: () => isLogged
  };
};