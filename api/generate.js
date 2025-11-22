const axios = require('axios'); 

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    if (!req.body || !req.body.prompt) {
        return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    const { prompt } = req.body; 
    const API_KEY = process.env.DALL_E_KEY;

    if (!API_KEY) {
        return res.status(500).json({ success: false, message: "API key not configured on server" });
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/images/generations', {
            model: "dall-e-2",
            prompt: prompt,
            n: 1,
            size: "512x512"
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const imageUrl = response.data.data[0].url;
        res.status(200).json({ success: true, url: imageUrl });

    } catch (error) {
        console.error("OpenAI API Error:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: "فشل إنشاء الصورة. قد يكون الوصف غير مسموح به." });
    }
};
