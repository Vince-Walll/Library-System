const logInForm = document.getElementById('logInForm');
const createAccForm = document.getElementById('createAccForm');
const goToCreateAcc = document.getElementById('goToCreateAcc');
const goToLogIn = document.getElementById('goToLogIn');

goToCreateAcc.addEventListener('click', () => {
    logInForm.classList.add('hidden');
    createAccForm.classList.remove('hidden');
});
goToLogIn.addEventListener('click', () => {
    logInForm.classList.remove('hidden');
    createAccForm.classList.add('hidden');
});

logInForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(logInForm);
    const account = Object.fromEntries(data);
    fetch('/log-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account)
    })
        .then(res => res.json())
        .then(data => {
            if (data.found && data.admin) {
                window.location.href = '/admin.html';
            } else if (data.found && !data.admin) {
                window.location.href = '/client.html';
            } else {
                window.alert(data.error);
            }
        })
});
createAccForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(createAccForm);
    const account = Object.fromEntries(data);
    fetch('/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account)
    })
        .then(res => res.json())
        .then(data => {
            if (data.created) {
                window.alert(data.message);
                createAccForm.reset();
            } else {
                window.alert(data.error);
            }
        })
});
