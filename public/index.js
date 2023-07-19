const sign = document.getElementById('submit');

sign.addEventListener('click',AddUser)

async function AddUser(e){
    e.preventDefault();
    const name=document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if(name=="" || email=="" || password==""){
        window.alert("please enter all fields");
    } 

    const obj={
        name:name,
        email:email,
        password:password,
        
    }

    try{
        const response = await axios.post('/signup',obj);
        console.log(response.data.newSignUp);
        window.location.href="/";
    }
    catch(err){
        console.log(err);
    }
}