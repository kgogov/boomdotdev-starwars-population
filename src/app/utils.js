/**
 * Here you can define helper functions to use across your app.
 */
export async function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
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