const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = 4000;
const cors = require('cors');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Middleware to parse JSON POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: '*'
}));

// Replace 'your-client-id' and 'your-client-secret' with your Keycloak client values
const keycloakConfig = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    // Other Keycloak configuration properties
};

const scope = 'openid';
const oidc_url = process.env.OIDC_URL;

app.post('/get-token', async (req, res) => {
    try {
        // Perform the authentication flow and retrieve tokens
        const response = await axios.post(oidc_url, {
            grant_type: 'password',
            scope: scope,
            client_id: keycloakConfig.client_id,
            client_secret: keycloakConfig.client_secret,
            username: req.body.username,
            password: req.body.password
        },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

        // Log the response type
        console.log('Response Data:', response.data);

        // Send the ID token as the response
        const idToken = response.data.access_token;
        res.json({ access_token: idToken });
    } catch (error) {
        console.log('Catching error');
        console.error('Error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
