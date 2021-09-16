/**
 * Here you can define helper functions to use across your app.
 */
export async function delay(seconds) { 
    return new Promise(resolve => setTimeout(resolve, seconds * 1000)); 
}

export async function fetchAndDecode(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.log(error);
    }
}