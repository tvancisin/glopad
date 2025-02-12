<script>
    import { onMount } from "svelte";
    import { getGeo, images, sections, scrollToSection } from "../utils";
    import Map from "../lib/Map.svelte";
    import { navigate } from "svelte5-router";

    let width;
    let all_polygons;
    let showScrollToTop = false; // Visibility of the scroll-to-top button
    let isMenuOpen = false; // Toggle menu visibility

    // Load GEOJSON
    const json_path = "/data/geojson.json";
    getGeo(json_path).then((geo) => {
        all_polygons = geo;
        
    });

    // RESEARCH GALLERY
    let imageRowResearch;
    const scrollGalleryResearch = (direction) => {
        if (imageRowResearch) {
            const scrollAmount = imageRowResearch.offsetWidth / 5; // Scroll width of one image
            imageRowResearch.scrollBy({
                left: direction * scrollAmount,
                behavior: "smooth",
            });
        }
    };

    // PEOPLE GALLERY
    let imageRowPeople;
    const scrollGalleryPeople = (direction) => {
        if (imageRowPeople) {
            const scrollAmount = imageRowPeople.offsetWidth / 5; // Scroll width of one image
            imageRowPeople.scrollBy({
                left: direction * scrollAmount,
                behavior: "smooth",
            });
        }
    };

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Check scroll position and update reactivity
    const handleScroll = () => {
        showScrollToTop = window.scrollY > 300; // Trigger button visibility
    };

    // INIT
    onMount(() => {
        // Disable automatic scroll restoration
        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }

        // Scroll to top on page load
        window.scrollTo({ top: 0, behavior: "auto" });

        // Add event listener for scrolling to top
        window.addEventListener("scroll", handleScroll);
        imageRowResearch = document.querySelector(".image-row-research");
        imageRowPeople = document.querySelector(".image-row-people");

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });
</script>

<div id="wrapper" bind:clientWidth={width}>
    <div id="home">
        <img
            id="intro_logo_usa"
            alt="University of St Andrews Logo"
            src="uosa.png"
        />
        <img
            id="intro_logo_uoe"
            alt="University of St Andrews Logo"
            src="uoe_white.png"
        />
        <img
            id="intro_logo_peace"
            alt="PeaceRep Logo"
            src="peacerep_logo.jpg"
        />

        <!-- Navigation Menu -->
        <div id="navigation">
            <i
                class="fa fa-bars"
                aria-hidden="true"
                on:click={() => (isMenuOpen = !isMenuOpen)}
            ></i>

            {#if isMenuOpen}
                <ul class="dropdown">
                    {#each sections as section}
                        <li on:click={() => scrollToSection(section.id)}>
                            {section.name}
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>

        <!-- <h1>MEND: Mediation Events and Negotiators Database</h1> -->
        <h1>Global Fragmentation PeaceHub</h1>
        <h3>
            Understanding shifts in the geopolitical context of peace and
            transition processes
        </h3>
    </div>

    <main
        id="map"
        bind:clientWidth={width}
        style="height: calc(var(--vh, 1vh) * 100);"
    >
        <h3
            style="
      z-index: 400; 
      position: absolute; 
      width: 100px;
      text-align: left; 
      font-size: 20px;
      border-radius: 2px"
        >
            Explore
        </h3>
        <Map
            {all_polygons}
            inflate={(data) => {
                navigate("/glopad/" + data);
                // window.open("/glopad/" + data, "_blank");
            }}
        />
    </main>

    <!-- research section -->
    <div id="research">
        <h3
            style="width: 100px;text-align: left;border-radius: 2px; font-size:20px;"
        >
            Research
        </h3>
        <div class="gallery-container-research">
            <button
                class="arrow left"
                aria-label="Scroll left"
                on:click={() => scrollGalleryResearch(-1)}
            >
                <i
                    class="fa fa-arrow-left"
                    style="color: yellow;"
                    aria-hidden="true"
                ></i>
            </button>
            <div class="image-row-research">
                {#each images as { src, name } (src)}
                    <div class="image-container">
                        <img loading="lazy" {src} alt={name} />
                        <p>{name}</p>
                    </div>
                {/each}
            </div>
            <button
                class="arrow right"
                aria-label="Scroll right"
                on:click={() => scrollGalleryResearch(1)}
            >
                <i
                    class="fa fa-arrow-right"
                    style="color: yellow;"
                    aria-hidden="true"
                ></i>
            </button>
        </div>
    </div>

    <!-- people section -->
    <div id="people">
        <h3
            style="width: 100px;text-align: left; font-size:20px; border-radius: 2px"
        >
            About
        </h3>
        <div id="about">
            <div class="row">
                <div class="column left">
                    <img src="./img/mateja-min.png" />
                </div>
                <div class="column right">
                    <p>
                        <strong>Dr Mateja Peter</strong> is leading Global Transitions,
                        PeaceRep’s non-ODA work strand. She is also Lecturer in International
                        Relations and Director of the Centre for Global Law and Governance
                        at the University of St Andrews. Mateja's research seeks
                        to better understand theoretical and policy implications
                        of the shift from short-term to sustained third-party engagements
                        in contemporary interventions; and the subsequent push-back
                        against these developments. Her work employs archival research
                        and fieldwork.
                    </p>
                </div>
            </div>
            <hr />
            <div class="row">
                <div class="column left"><img src="./img/sanja-min.png" /></div>
                <div class="column right">
                    <p>
                        <strong>Dr Sanja Badanjak</strong> is a Chancellor’s Fellow
                        in Global Challenges at the University of Edinburgh School
                        of Law, PeaceRep’s Data Director, and Data Manager for the
                        PA-X Peace Agreements Database and Dataset. Her research
                        interests include the applications of quantitative and text-as-data
                        methods in the study of institutions, elections, and peace
                        processes. She completed her PhD in political science at
                        the University of Wisconsin – Madison, and holds and MA in
                        political science from the Central European University.
                    </p>
                </div>
            </div>
            <hr />
            <div class="row">
                <div class="column left"><img src="./img/elisa-min.png" /></div>
                <div class="column right">
                    <p>
                        <strong>Dr Elisa D’Amico</strong> currently serves as a Postdoctoral
                        Research Fellow within the School of International Relations
                        at the University of St Andrews. Her primary focus lies within
                        the Global Fragmentation project, where her role is building
                        the mediation event database. In addition to her scholarly
                        contributions in conflict resolution and mediation, her research
                        extends to examining the intricate dynamics of the climate-migration-conflict
                        nexus via rigorous quantitative methodology.
                    </p>
                </div>
            </div>
            <hr />
            <div class="row">
                <div class="column left"><img src="./img/kasia-min.png" /></div>
                <div class="column right">
                    <p>
                        <strong>Dr Kasia Houghton</strong> is an ESRC Doctoral Researcher
                        in International Relations at the University of St Andrews,
                        researching Russian intervention in the Syrian conflict.
                        She is a researcher on the PeaceRep Global Transitions project,
                        working on the third-party mediation database. She is also
                        a tutor of international relations at Durham University.
                        Kasia is a fellow of the Centre for Global Law and Governance,
                        Institute for Middle Eastern, Central Asian, and Caucasus
                        Studies, and Centre for Syrian Studies at the University
                        of St Andrews.
                    </p>
                </div>
            </div>
            <hr />
            <div class="row">
                <div class="column left"><img src="./img/niamh-min.png" /></div>
                <div class="column right">
                    <p>
                        <strong>Niamh Henry</strong> is a Data Engineer with the
                        Peace and Conflict Resolution Evidence Programme (PeaceRep)
                        at the University of Edinburgh. She works on the organisation
                        and extension of peace and conflict data and develops innovative
                        PeaceTech tools to support better understanding peace and
                        transition processes. Niamh is a co-creator of the PA-X Tracker,
                        a new Peace And Transition Process Tracker. Niamh holds an
                        MS in Information Science from the University of Amsterdam,
                        and an MA in Digital Media and Information Studies from the
                        University of Glasgow.
                    </p>
                </div>
            </div>
            <hr />
            <div class="row">
                <div class="column left"><img src="./img/tom-min.png" /></div>
                <div class="column right">
                    <p>
                        <strong>Dr Tomas Vancisin</strong> is an Information Visualization
                        and Digital Humanities researcher. At PeaceRep, he focuses
                        on visualization of transition trajectories, and the mediation
                        space of peace and transition processes. Tomas recently finished
                        his PhD in Computer Science. He holds an MSc in Computing
                        and Information Technology, and MA(Hons) in Comparative Literature
                        and Russian, all from the University of St Andrews. Before
                        joining PeaceRep, Tomas worked on his PhD, focusing on the
                        visualization of historical textual collections from the
                        University of St Andrews dating back to 1579.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Scroll to Top Button -->
    {#if showScrollToTop}
        <button
            id="scrollToTop"
            on:click={scrollToTop}
            aria-label="Scroll to top"
        >
            <i class="fa fa-arrow-up" style="color: yellow;" aria-hidden="true"
            ></i>
        </button>
    {/if}
</div>

<style>
    /* General styling */
    #wrapper {
        width: 100%;
    }

    #intro_logo_usa {
        position: absolute;
        top: 2px;
        right: 5px;
        height: 40px;
    }

    #intro_logo_uoe {
        position: absolute;
        top: 50px;
        right: 5px;
        height: 40px;
    }

    #intro_logo_peace {
        position: absolute;
        top: 100px;
        right: 5px;
        height: 40px;
    }

    @media only screen and (max-width: 1450px) {
        #intro_logo_usa,
        #intro_logo_uoe,
        #intro_logo_peace {
            height: 40px;
        }
        #intro_logo_uoe {
            top: 50px;
        }
        #intro_logo_peace {
            top: 100px;
        }
    }

    @media only screen and (max-width: 1200px) {
        #intro_logo_usa,
        #intro_logo_uoe,
        #intro_logo_peace {
            height: 30px;
        }
        #intro_logo_uoe {
            top: 40px;
        }
        #intro_logo_peace {
            top: 80px;
        }
    }

    @media only screen and (max-width: 768px) {
        #intro_logo_usa,
        #intro_logo_uoe,
        #intro_logo_peace {
            height: 20px;
        }
        #intro_logo_uoe {
            top: 25px;
        }
        #intro_logo_peace {
            top: 50px;
        }
    }

    h1 {
        color: white;
        font-weight: 800;
        margin-bottom: 5px;
    }

    h3 {
        color: white;
        font-weight: 500;
        padding: 10px;
        margin: 0px;
    }

    #home {
        position: relative;
        width: 100%;
        height: 300px;
        align-content: center;
        text-align: center;
        background-color: #001c23;
    }

    #research {
        position: relative;
        width: 100%;
        height: auto;
        margin: 0px;
        background-color: #001c23;
    }

    #people {
        position: relative;
        background-color: #003645;
        width: 100%;
    }

    #about {
        position: relative;
        width: 80%;
        display: flex; /* Enable flexbox layout */
        flex-wrap: wrap; /* Allow wrapping on smaller screens */
        margin: auto;
    }

    .row {
        display: flex; /* Create a flex row for each pair of columns */
        flex-wrap: wrap; /* Allow wrapping for responsive design */
        width: 100%; /* Ensure rows take full width */
        margin-bottom: 30px; /* Add spacing between rows */
    }

    .column {
        flex: 1; /* Equal width for left and right columns */
        padding: 10px; /* Add spacing inside columns */
        box-sizing: border-box; /* Ensure padding doesn't affect width */
        text-align: center; /* Center-align content (optional) */
        color: white; /* Text color for better contrast */
    }

    .column img {
        height: 350px;
        border-radius: 3px;
        -webkit-box-shadow: 0 0 10px #22222293;
        box-shadow: 0 0 10px #22222293;
    }

    .right p {
        text-align: left;
        line-height: 1.5;
    }

    @media (max-width: 768px) {
        .column {
            flex-basis: 100%; /* Stack columns vertically on smaller screens */
        }
    }

    main {
        width: 100%;
        display: flex;
        overflow: hidden;
        text-align: center;
    }

    /* Navigation Menu */
    #navigation {
        position: absolute;
        top: 10px;
        left: 20px;
        z-index: 10;
    }

    #navigation .fa-bars {
        font-size: 24px;
        color: white;
        cursor: pointer;
    }

    .dropdown {
        position: absolute;
        top: 30px;
        left: 0;
        text-align: left;
        background-color: #252529;
        border-radius: 1px;
        list-style: none;
        padding: 0;
        margin: 0;
        z-index: 10;
    }

    .dropdown li {
        all: unset;
        font-weight: 300;
        padding: 10px 20px;
        color: white;
        cursor: pointer;
        display: block;
        text-align: left;
    }

    .dropdown li:hover {
        background-color: #042645;
    }

    /* Scroll to Top Button */
    #scrollToTop {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background-color: #000000;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
        z-index: 1000;
    }

    #scrollToTop:hover {
        background-color: #042645;
    }

    #scrollToTop i {
        font-size: 20px;
    }

    .gallery-container-research {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        width: 100%;
        height: 70vh;
        background-color: #003645;
        margin-top: 50px;
    }

    .gallery-container-research {
        background-color: #001c23;
    }

    .image-row-research {
        display: flex;
        overflow-x: auto;
        scroll-behavior: smooth;
        scrollbar-width: none; /* Hide scrollbar for Firefox */
        -ms-overflow-style: none; /* Hide scrollbar for IE/Edge */
        width: 100%;
        height: 100%;
        align-items: center; /* Center items vertically */
    }

    .image-row-research::-webkit-scrollbar {
        display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
    }

    .image-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center; /* Center image and text vertically within the container */
        margin: 0 8px;
        height: 100%; /* Ensures it takes up the full height of the row */
    }

    .image-container img {
        height: 80%;
        object-fit: cover;
        border-radius: 3px;
    }

    .image-container p {
        margin: 10px 0 0;
        font-size: 1rem;
        color: white;
        text-align: center;
        line-height: 1.2;
    }

    .arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgb(0, 0, 0);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
    }

    .arrow.left {
        left: 10px;
    }

    .arrow.right {
        right: 10px;
    }

    .arrow:hover {
        background: rgba(0, 0, 0, 0.8);
    }

    hr {
        width: 80%;
        height: 1px;
        border: 0;
        border-top: 2px solid #001c23;
        padding-bottom: 30px;
    }
</style>
