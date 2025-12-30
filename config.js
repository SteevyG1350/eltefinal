// Configuration for API endpoints
const CONFIG = {
    API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : (window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')),
    
    PRICING: {
        SOFTWARE: 500000,
        MOBILE: 800000,
        WEB: 300000,
        DATA: 250000,
        CCTV: 150000,
        SUPPORT: 10000
    },
    
    TIMELINE_MULTIPLIERS: {
        '1': 1.5,
        '2': 1.0,
        '3': 0.8,
        '4': 0.6
    },
    
    TEAM_MULTIPLIERS: {
        '1': 1.0,
        '2': 1.8,
        '3': 2.5,
        '4': 3.5
    }
};
