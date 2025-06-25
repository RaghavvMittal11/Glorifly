document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitButton = this.querySelector('button[type="submit"]');
    const email = document.getElementById('student_email').value;
    const password = document.getElementById('student_password').value;

    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="loading"></span> Logging in...';

    try {
        await fetch('http://127.0.0.1:8000/api/'); // check server

        const response = await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                student_email: email,
                student_password: password
            }),
            credentials: 'include'
        });

        const data = await response.json();        
        console.log('Response:', data);
        const token = localStorage.getItem('token');

         localStorage.setItem('data', data);
         localStorage.setItem('token', data.token); // Store token in local storage
        localStorage.setItem('student_id', data.student.id); // Store student ID in local storage

        if (response.ok) {
            showToast("Login successful!", "success");

            setTimeout(() => {
                window.location.href = '/homepage/';
            }, 15);
        } else {
            showToast(data.message || "Login failed", "error");
        }
    } catch (error) {
        console.error('Error:', error);
        showToast(error.message || "Something went wrong. Try again.", "error");
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Login';
    }
});

function showToast(message, type) {
    const backgroundColor = type === 'success' ? '#22c55e' : '#ef4444';
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor
    }).showToast();
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
