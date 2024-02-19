async function chekLoginToken() {
    const token = localStorage.getItem('token');
    const response = await fetch('/login-token', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    // check status code if not 200 then logout
    if (!response.ok) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

}

export default chekLoginToken