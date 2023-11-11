const API_URL = 'https://hyper-inconclusive-cockatoo.glitch.me/api';

export async function getData(url) {
    try {
        const response = await fetch(`${API_URL}${url}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();

    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        throw error;
    }
}

export async function postData(url, data) {
    try {
        const response = await fetch(`${API_URL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();

    } catch (error) {
        console.error('Ошибка при отправке данных:', error);
        throw error;
    }
}