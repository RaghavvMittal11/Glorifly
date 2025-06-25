document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitButton = this.querySelector('button[type="submit"]');
    const formData = {
        student_name: document.getElementById('student_name').value,
        student_email: document.getElementById('student_email').value,
        student_phone_number: document.getElementById('student_phone_number').value,
        student_password: document.getElementById('student_password').value, // changed from student_password1
        confirm_password: document.getElementById('confirm_password').value
    };

    // Form validation
    if (!validatePhoneNumber(formData.student_phone_number)) {   
        showToast("Please enter a valid phone number", "error");
        return;
    }

    if (!validatePassword(formData.student_password)) {
        showToast("Password must be at least 8 characters long and contain at least one number and one special character", "error");
        return;
    }

    if (formData.student_password !== formData.confirm_password) {
        showToast("Passwords do not match!", "error");
        return;
    }

    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="loading"></span> Registering...';

    try {
        // Test if the backend is running
        try {
            await fetch('http://127.0.0.1:8000/api/');
        } catch (error) {
            throw new Error('Backend server is not running. Please start the Django server with: python manage.py runserver');
        }

        const payload = {
            student_name: formData.student_name,
            student_email: formData.student_email,
            student_phone_number: formData.student_phone_number,
            student_password: formData.student_password
        };
        
        console.log('Sending registration data:', payload);
        
        const response = await fetch('http://127.0.0.1:8000/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        });

        const contentType = response.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
            // console.log('JSON response:', data);
        } else {
            const text = await response.text();
            console.error('Received non-JSON response:', text);
            data = { message: 'Server returned an unexpected response' };
        }
        
        console.log('Response:', data);
        
        if (response.ok) {
            showToast("Registration successful!", "success");
            document.getElementById('registerForm').reset();
            
            // Redirect after 1.5 seconds
            setTimeout(() => {
                window.location.href = '/login/';
            }, 1500);
        } else {
            if (data.errors) {
                const errorMessages = Object.entries(data.errors)
                    .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
                    .join('\n');
                showToast(errorMessages, "error");
            } else {
                showToast(data.message || "Registration failed", "error");
            }
        }
    } catch (error) {
        console.error('Error:', error);
        showToast(error.message || "Something went wrong. Please try again.", "error");
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Register';
    }
});

// Validation functions
function validatePhoneNumber(phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
}

function showToast(message, type) {
    const backgroundColor = type === 'success' ? '#22c55e' : '#ef4444';
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor,
    }).showToast();
    
    if (type === 'error') {
        console.error(message);
    } else {
        console.log(message);
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
