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
    { src: "./img/mateja.JPG", name: "Mateja Peter", position: "Research Lead" }, 
    { src: "./img/sanja.jpg", name: "Sanja Badanjak",position: "Research Co-Lead" },
    { src: "./img/elisa.jpg", name: "Elisa D'Amico", position: "Postdoc Researcher" },
    { src: "./img/kasia.jpg", name: "Kasia Houghton", position: "Postdoc Researcher" },
    { src: "./img/niamh.jpg", name: "Niamh Henry", position: "Research Fellow"  },
    { src: "./img/tom-min.png", name: "Tomas Vancisin", position: "Research Associate" },
];

// Dropdown options
export const sections = [
    { id: "home", name: "Home" },
    { id: "map", name: "VIS" },
    { id: "about", name: "About" },
    { id: "people", name: "Team" },
    { id: "research", name: "Research" },
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

export function fillMissingMonths(data) {
    if (data.length === 0) return [];

    let completeData = [];
    let minYear = Math.min(...data.map((d) => +d.year));
    let maxYear = Math.max(...data.map((d) => +d.year));

    for (let year = minYear; year <= maxYear; year++) {
        for (let month = 1; month <= 12; month++) {
            let monthStr = String(month); // Keep as number format for matching
            let existingEntry = data.find(
                (d) => d.year == year && d.month == monthStr,
            );

            if (existingEntry) {
                completeData.push(existingEntry);
            } else {
                completeData.push({
                    year: String(year),
                    month: String(month),
                    count: [],
                }); // Add empty count
            }
        }
    }

    return completeData;
}

