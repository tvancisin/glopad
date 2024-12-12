export async function getGeo(url) {
    let response = await fetch((import.meta.env.BASE_URL || "") + url);
    let json = await response.json();
    return json;
}

export let images = [
    { src: "./img/c1-min.png", name: "" },
    { src: "./img/c2-min.png", name: "" },
    { src: "./img/c3-min.png", name: "" },
    { src: "./img/c4-min.png", name: "" },
    { src: "./img/c5-min.png", name: "" },
    { src: "./img/m1-min.png", name: "" },
    { src: "./img/m2-min.png", name: "" },
    { src: "./img/m3-min.png", name: "" },
];

export let images_ppl = [
    { src: "./img/mateja-min.png", name: "Mateja Peter" },
    { src: "./img/sanja-min.png", name: "Sanja Badanjak" },
    { src: "./img/elisa-min.png", name: "Elisa D'Amico" },
    { src: "./img/kasia-min.png", name: "Kasia Houghton" },
    { src: "./img/niamh-min.png", name: "Niamh Henry" },
    { src: "./img/tom-min.png", name: "Tomas Vancisin" },
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


export const countryNames = [
    "Burkina Faso",
    "Central African Republic",
    "Democratic Republic of Congo",
    "Ethiopia",
    "Libya",
    "Mali",
    "Mozambique",
    "Nigeria",
    "Somalia",
    "South Sudan",
    "Sudan",
    "Western Sahara",
    "Colombia",
    "Haiti",
    "Afghanistan",
    "Myanmar",
    "Pakistan",
    "Philippines",
    "Azerbaijan",
    "Russia",
    "Ukraine",
    "Iraq",
    "Israel",
    "Syria",
    "Turkey",
    "Yemen",
];


