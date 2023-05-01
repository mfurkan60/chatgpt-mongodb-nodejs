class POST {
    constructor(api_key) {
        this.api_key = api_key;
    }

    async get_response(message) {
        // API sorgusu burada yapılacak
        // ChatGPT API'ya istek atmak için gerekli kodlar burada yazılacak
        // Yanıt alınacak ve geri döndürülecek
        const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.api_key}`
            },
            body: JSON.stringify({
                prompt: message,
                max_tokens: 100,
                temperature: 0.5,
                n: 1,
                stop: '\n',
            }),
        });
        const data = await response.json();
        return data.choices[0].text;
    }

    async post_data(data) {
        // ChatGPT API'ya veri göndermek için gerekli kodlar burada yazılacak
        const response = await fetch('https://api.openai.com/v1/data/engines/davinci-codex', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.api_key}`
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }
}

