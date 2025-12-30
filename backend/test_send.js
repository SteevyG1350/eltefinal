(async () => {
    try {
        const payload = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '',
            company: 'Acme',
            budget: '1000',
            services: ['Web Design'],
            timeline: '1 month',
            message: 'Hello from test',
            newsletter: false
        };

        const res = await fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const text = await res.text();
        console.log('Response:', text);
    } catch (err) {
        console.error('Error during test POST:', err);
        process.exit(1);
    }
})();
