export async function getGeo(url) {
    let response = await fetch((import.meta.env.BASE_URL || "") + url);
    let json = await response.json();
    return json;
}