const btn = document.getElementById('submit');

btn.addEventListener('click',forgetPassword);

async function forgetPassword(e){
    e.preventDefault();
    const email = document.getElementById('email').value;
    console.log(email);
    const obj={
        email:email
    }
    try{
        const response =await axios.post("/password/forgetpassword",obj);
        console.log(response.data.message);
    }
    catch(err){
        console.log(err);
    }
}