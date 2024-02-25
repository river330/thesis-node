require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/api/openai/images', async (req, res) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/images/generations', req.body, {
            headers: {
                'Authorization': `Bearer  ${process.env.OPENAI_API_KEY}`
            }
        });
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            // The server responded with a status code outside the 2xx range
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            res.status(500).json({ message: "No response received from OpenAI API" });
        } else {
            // Something else caused the error
            res.status(500).json({ message: error.message });
        }
    }
});
app.post('/api/openai/responses', async (req, res) => {
    // console.log(req.body); 
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', req.body, {
            headers: {
                'Authorization': `Bearer  ${process.env.OPENAI_API_KEY}`
            }
        });
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            // The server responded with a status code outside the 2xx range
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            res.status(500).json({ message: "No response received from OpenAI API" });
        } else {
            // Something else caused the error
            res.status(500).json({ message: error.message });
        }
    }
});

app.listen(port, () => console.log(`Proxy server running on port ${port}`));
