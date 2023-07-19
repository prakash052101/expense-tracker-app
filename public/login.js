const loginButton = document.getElementById('submit');
loginButton.addEventListener('click', handleLogin);


async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const obj = {
    email: email,
    password: password,
  };
  // console.log(obj);
  try {
    const response = await axios.post(
      "login/success",
      obj
    );
    alert(response.data.message);
    localStorage.setItem('token',response.data.token);
    console.log(response.data.token);
    window.location.href="/expense";
  } catch (err) {
    console.log(err);
    document.getElementById("err").innerText = err.response.data.message;
  }
}