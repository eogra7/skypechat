export default {
    post: (url, data) => {
        return fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
    },
    get: (url) => {
        return fetch(url, {
            credentials: 'include'
        });
    }
}
