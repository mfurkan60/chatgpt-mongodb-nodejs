class GET {
    constructor(api_key) {
        this.api_key = api_key;
    }

    async get_response(message) {
        const response = await fetch(`https://api.openai.com/v1/engines/davinci-codex/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.api_key}`,
            },
            body: JSON.stringify({
                prompt: message,
                max_tokens: 100,
                temperature: 0.5,
                n: 1,
                stop: '\n',
            }),
        });

        const json = await response.json();
        return json.choices[0].text.trim();
    }

    async get(url) {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${this.api_key}`,
            },
        });

        const json = await response.json();
        return json;
    }
}
