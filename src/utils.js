export async function getGeo(url) {
    let response = await fetch((import.meta.env.BASE_URL || "") + url);
    let json = await response.json();
    return json;
}

export let images = [
    "./img/c1.png",
    "./img/c2.png",
    "./img/c3.png",
    "./img/c4.png",
    "./img/c5.png",
    "./img/m1.png",
    "./img/m2.png",
    "./img/m4.png",
];

// Dropdown options
export const sections = [
    { id: "home", name: "Home" },
    { id: "research", name: "Research" },
    { id: "people", name: "People" },
    { id: "map", name: "Map" },
];


// Scroll to a specific section
export const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
};


