function validate() {
    let isValid = true;
    let data1 = document.getElementById('data1');
    let data1text = data1.value;

    if (data1text == 'first') isValid = false;

    return isValid;
}
