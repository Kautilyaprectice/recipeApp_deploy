document.getElementById('loginForm').addEventListener('submit', function(event){
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginDetails = {
        email: email,
        password: password
    };

    if(email && password){

        axios.post('https://recipe-management-jet.vercel.app/', loginDetails)
            .then((res) => {
                if(res.status === 200){
                    alert("Login Successful");
                    localStorage.setItem('token', res.data.token);
                    window.location.href = "../recipe/recipe.html";
                }
            })
            .catch((err) => {
                if(err.response && err.response.status === 404){
                    alert("User does not exist");
                }
                else if(err.response && err.response.status === 401){
                    alert("Incorrect password");
                }
                else{
                    console.log(err);
                }
            });
    }
    else{
        alert("Enter all details");
    }
});
