document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`/authenticate?username=${username}&password=${password}`);
        const data = await response.json();

        if (response.ok) {
            if (data.userType === 'admin') {
                window.location.href = './admin_dashbord/admin_dashboard.html';
            } else if (data.userType === 'user') {
                window.location.href = './user_dashbord/user_dashboard.html';
            }
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
});
