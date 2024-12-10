export async function getGeo(url) {
    let response = await fetch((import.meta.env.BASE_URL || "") + url);
    let json = await response.json();
    return json;
}

export let images = [
    { src: "./img/c1.png", name: "" },
    { src: "./img/c2.png", name: "" },
    { src: "./img/c3.png", name: "" },
    { src: "./img/c4.png", name: "" },
    { src: "./img/c5.png", name: "" },
    { src: "./img/m1.png", name: "" },
    { src: "./img/m2.png", name: "" },
    { src: "./img/m3.png", name: "" },
];

export let images_ppl = [
    { src: "./img/mateja.png", name: "Mateja Peter" },
    { src: "./img/sanja.png", name: "Sanja Badanjak" },
    { src: "./img/elisa.png", name: "Elisa D'Amico" },
    { src: "./img/kasia.png", name: "Kasia Houghton" },
    { src: "./img/niamh.png", name: "Niamh Henry" },
    { src: "./img/tom.png", name: "Tomas Vancisin" },
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


