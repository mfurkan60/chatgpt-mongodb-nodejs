class Update {
    constructor(api_key) {
        this.api_key = api_key;
    }

    update_prompt(prompt_id, new_prompt) {
        const url = `https://api.openai.com/v1/engines/davinci-codex/completions/${prompt_id}`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.api_key}`,
        };

        const body = JSON.stringify({
            prompt: new_prompt,
        });

        return fetch(url, {
            method: 'PATCH',
            headers: headers,
            body: body,
        })
            .then(response => response.json())
            .catch(error => console.error(error));
    }
}


