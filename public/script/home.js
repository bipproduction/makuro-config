import chekLoginToken from "./chek_login_token.js";

async function script_home() {
    // check token GET /login-token
    await chekLoginToken();
    await loadListApikey()

    // logout function
    $('#logout').click(() => {
        alert('Logout Success');
        localStorage.removeItem('token');
        window.location.href = '/login';
    })

    // show token
    $('#token').val(localStorage.getItem('token'));


    // function generate apikey
    $('#createApiKey').click(async () => {
        const name = $('#name').val();

        // exired_data default now + 30 day
        const expiresAt = $('#expired_date').val() === '' ? null : new Date($('#expired_date').val());

        // check null or empty value
        if (!name) {
            return alert('Input cannot be empty');
        }
        const token = localStorage.getItem('token');
        const response = await fetch('/create-apikey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, expiresAt })
        })
        const data = await response.json();
        alert(data.message);
        // clean input
        $('#name').val('');

        // reload list apikey
        await loadListApikey()


    })
}

export default script_home;


async function loadListApikey() {
    // get list apikey use fetch
    const listApiKey = document.getElementById('listApiKey');
    const token = localStorage.getItem('token');
    const response = await fetch('/list-apikey', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    const data = await response.json();
    listApiKey.innerHTML = data.apiKeys.map((apiKey, key) => `<div style="display: flex; flex-direction: column; gap: 10px; padding: 8px; " >
            <div>${apiKey.name}</div>
            <input id="apikey_text${key}" type="password" value="${apiKey.key}" readonly  style="overflow: scroll; width: 300px;" />
            <div>${apiKey.expiresAt ? (new Date(apiKey.expiresAt).toLocaleDateString("id")) : 'null'}</div>
           <div style="display: flex; gap: 10px;">
            <button class="btn-show" data-key="${key}" data-apikey="${apiKey.key}" style="width: fit-content;" id="show${key}">show</button>
            <button class="btn-show" data-key="${key}" data-apikey="${apiKey.key}" style="width: fit-content;" id="copy${key}" >copy</button>
            <button class="btn-delete" data-key="${key}" data-apikey="${apiKey.key}" data-id="${+apiKey.id}" style="width: fit-content;" id="delete${key}">delete</button>
            </div>
        </div>`).join('')

    // click show
    $('.btn-show').click(function () {
        const key = $(this).data('key');
        const text = $(this).data('apikey');
        show(text, key);
    })

    // click copy
    $('.btn-show').click(function () {
        const key = $(this).data('key');
        const text = $(this).data('apikey');
        navigator.clipboard.writeText(text);
        document.getElementById(`copy${key}`).innerText = 'copied';

        // normalize
        setTimeout(() => {
            document.getElementById(`copy${key}`).innerText = 'copy';
            document.getElementById(`apikey_text${key}`).type = 'password';
        }, 500)
    })

    // click delete
    $('.btn-delete').click(function () {
        const key = $(this).data('key');
        const text = $(this).data('apikey');
        const id = $(this).data('id');
        deleteApiKey(text, id);
    })




}

function show(text, key) {
    // toggle type password / text
    if (document.getElementById(`apikey_text${key}`).type == 'password') {
        document.getElementById(`apikey_text${key}`).type = 'text';
    } else {
        document.getElementById(`apikey_text${key}`).type = 'password';
    }
}

function copy(text, key) {
    navigator.clipboard.writeText(text);
    document.getElementById(`copy${key}`).innerText = 'copied';

}

async function deleteApiKey(text, id) {
    // confirm make sure you want to delete
    if (!confirm('Are you sure you want to delete this api key?')) {
        return
    }
    const token = localStorage.getItem('token');
    const response = await fetch('/delete-apikey', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: +id })
    })
    const data = await response.json();
    alert(data.message);
    // reload list apikey
    await loadListApikey()
}


