//validate data on form before allowing it to be sent on
function validate() {
    let isValid = true;
    let data1 = document.getElementById('data1');
    let data1text = data1.value;

    if (data1text == 'first') isValid = false;

    //returning true allows the form to proceed with the submission
    return isValid;
}

//have the server compare the two values to see if they are the same
async function compare() {
    //get the two values
    let data1 = document.getElementById('data1');
    let data2 = document.getElementById('data2');
    //create an object to send to the server containing the two values
    let data = { data1: data1.value, data2: data2.value };

    //send the data in a POST to the route /data and wait for a response
    var result = await fetch('/data', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(data)
    });
    //now wait for the text of the response
    let resp = await result.text();
    //the server sent us some JSON in string form, so parse it into an object
    let response = JSON.parse(resp);

    if (response.isLoggedIn) {
        //check the object to see if isMatch == true
        if (response.isMatch)
            alert("the two values are a match");
    } else {
        window.location = '/login';
    }
}

//upload a file to the server
async function upload() {
    //we need to send a FormData object
    var formData = new FormData();
    //get the input with id (and type) of file
    var fileField = document.getElementById("file");

    //add the file name to the formData object
    formData.append('file', fileField.files[0]);

    //send the formData object to the server to the /upload route and wait
    let result = await fetch('/upload', { method: 'POST', credentials: 'include', body: formData });
    //now wait for the text of the response
    let resp = await result.text();
    //parse the string into a json object
    let response = JSON.parse(resp);
    //the object tells us whether it worked or not
    if (response.success)
        alert("you uploaded");
}

async function download() {
    //send the formData object to the server to the /upload route and wait
    let result = await fetch('/getlist', { method: 'POST', credentials: 'include' });
    //now wait for the text of the response
    let resp = await result.text();
    //parse the string into a json object
    let listData = JSON.parse(resp);

    //loop over all data and insert into the div
    document.getElementById('list').innerHTML = listData.reduce(
        (listHtml, li) => listHtml += `<div>${li._id}</div><div>${li.name}</div><div>${li.value}</div>`
        , '');
}

async function insert() {
    //get the two values
    let data1 = document.getElementById('data1');
    let data2 = document.getElementById('data2');
    //create an object to send to the server containing the two values
    let data = { data1: data1.value, data2: data2.value };

    //send the data in a POST to the route /data and wait for a response
    var result = await fetch('/addlist', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(data),
    });
    //now wait for the text of the response
    let resp = await result.text();
    //the server sent us some JSON in string form, so parse it into an object
    let li = JSON.parse(resp);
    document.getElementById('list').innerHTML += `<div>${li._id}</div><div>${li.name}</div><div>${li.value}</div>`;
}

async function getUser() {
    var result = await fetch('/getUser', {
        method: 'GET', credentials: 'include'
    });
    //now wait for the text of the response
    let resp = await result.text();
    //the server sent us some JSON in string form, so parse it into an object
    let user = JSON.parse(resp);

    document.getElementById('user').innerHTML = user.email ? `Hello ${user.email}` : 'Hello unknown person';
}