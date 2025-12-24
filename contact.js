// Contact form functionality
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        spinner.style.display = 'inline-block';

        const selectedServices = Array.from(document.querySelectorAll('.service-option.selected')).map(option => option.dataset.service);

        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            company: document.getElementById('company').value,
            budget: document.getElementById('budget').value,
            services: selectedServices,
            timeline: document.getElementById('timeline').value,
            message: document.getElementById('message').value,
            newsletter: document.getElementById('newsletter').checked
        };

        try {
            const response = await fetch('http://localhost:3000/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showMessage('Thank you! We\'ll contact you within 24 hours to discuss your project.', 'success');
                form.reset();
                clearServiceSelection();
            } else {
                showMessage('Oops! Something went wrong. Please try again later.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Oops! Something went wrong. Please try again later.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            spinner.style.display = 'none';
        }
    });
}

// Form validation
function validateForm() {
    const requiredFields = document.querySelectorAll('.form-input[required]');
    const selectedServices = document.querySelectorAll('.service-option.selected');
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('error');
    });

    // Check required fields
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        }
    });

    // Check if at least one service is selected
    if (selectedServices.length === 0) {
        showMessage('Please select at least one service.', 'error');
        isValid = false;
    }

    return isValid;
}

// Service selection
function initializeServiceSelection() {
    const serviceOptions = document.querySelectorAll('.service-option');

    serviceOptions.forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });
}

// Clear service selection
function clearServiceSelection() {
    document.querySelectorAll('.service-option.selected').forEach(option => {
        option.classList.remove('selected');
    });
}

// Show message
function showMessage(text, type) {
    const messageEl = document.getElementById('form-message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';

    // Hide message after 5 seconds
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

// FAQ functionality
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');

    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Initialize map
function initializeMap() {
    // Initialize Google Map
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -1.0235, lng: 37.0528 }, // Kenol, Murang'a County, Kenya
        zoom: 15,
        styles: [
            { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#00d4ff' }] },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#2d3748' }]
            }
        ]
    });

    // Add marker for office location
    const marker = new google.maps.Marker({
        position: { lat: -1.0235, lng: 37.0528 },
        map: map,
        title: 'EliteSolutions - Kenol, Murang\'a County'
    });

    const infoWindow = new google.maps.InfoWindow({
        content: '<div style="color: #1a1a1a;"><b>EliteSolutions</b><br>Kenol<br>Murang\'a County, Kenya</div>'
    });

    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
}

// Utility functions
function scrollToMap() {
    document.getElementById('map-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function scrollToForm() {
    document.getElementById('contact-form').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeServiceSelection();
    initializeMap();
});
