import * as d3 from "d3";

export async function getGeo(url) {
    let response = await fetch((import.meta.env.BASE_URL || "") + url);
    let json = await response.json();
    return json;
}

export async function getIndividualCSV(path) {
    let loadedData = await d3.csv(path);
    return loadedData;
  }
  
  export async function getCSV(paths) {
    const promises = paths.map(path => getIndividualCSV(path));
    const results = await Promise.all(promises);
    return results;
    // let loadedData = await d3.csv(path);
    // return loadedData
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
    "Afghanistan",
    "Azerbaijan",
    "Burkina Faso",
    "Central African Republic",
    "Colombia",
    "Democratic Republic of Congo",
    "Ethiopia",
    "Haiti",
    "Israel",
    "Iraq",
    "Libya",
    "Mali",
    "Mozambique",
    "Myanmar",
    "Nigeria",
    "Pakistan",
    "Philippines",
    "Russia",
    "Somalia",
    "South Sudan",
    "Sudan",
    "Syria",
    "Turkey",
    "Ukraine",
    "Western Sahara",
    "Yemen"
];


