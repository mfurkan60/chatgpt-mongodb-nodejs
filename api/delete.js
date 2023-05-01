class Delete {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async deletePrompt(promptId) {
        const url = `https://api.openai.com/v1/engines/davinci-codex/prompts/${promptId}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        };

        const response = await fetch(url, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        return true;
    }
}
