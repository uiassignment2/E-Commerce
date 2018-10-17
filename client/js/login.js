async function login() {
    let error = document.getElementById('error');
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    if (email && email.length > 0 && password && password.length > 0) {
        let data = { email: email, password: password };
        //send the data in a POST to the route /login and wait for a response
        let result = await fetch('/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(data),
        });
        //now wait for the text of the response
        let resp = await result.text();
        //the server sent us some JSON in string form, so parse it into an object
        let response = JSON.parse(resp);

        if (response.success)
            window.location = '/';
        else
            error.innerHTML = response.message;
    } else {
        error.innerHTML = "Please provide both email and password";
    }
}