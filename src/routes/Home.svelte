<script>
    import { onMount } from "svelte";
    import {
        getGeo,
        images,
        sections,
        scrollToSection,
        images_ppl,
    } from "../utils";
    import Map from "../lib/Map.svelte";
    import { navigate } from "svelte5-router";

    let width;
    let all_polygons;
    let showScrollToTop = false; // Visibility of the scroll-to-top button
    let isMenuOpen = false; // Toggle menu visibility
    let isSmallScreen = false; // Check if screen size is small

    // Load GEOJSON
    const json_path = "/data/geojson.json";
    getGeo(json_path).then((geo) => {
        all_polygons = geo;
    });

    // RESEARCH GALLERY
    let imageRowResearch;
    const scrollGalleryResearch = (direction) => {
        if (!imageRowResearch) return;

        const imageWidth = imageRowResearch.scrollWidth / images_ppl.length; // Ensure exact image width scroll
        let targetScroll = imageRowResearch.scrollLeft + direction * imageWidth;

        animateScroll(imageRowResearch, targetScroll, 500); // 500ms smooth scroll
    };

    // PEOPLE GALLERY
    let imageRowPeople;
    function scrollGalleryPeople(direction) {
        if (!imageRowPeople) return;

        const imageWidth = imageRowPeople.scrollWidth / images_ppl.length; // Ensure exact image width scroll
        let targetScroll = imageRowPeople.scrollLeft + direction * imageWidth;

        animateScroll(imageRowPeople, targetScroll, 500); // 500ms smooth scroll
    }

    function animateScroll(element, to, duration) {
        const start = element.scrollLeft;
        const change = to - start;
        const startTime = performance.now();

        function step(currentTime) {
            let progress = (currentTime - startTime) / duration;
            if (progress > 1) progress = 1;

            element.scrollLeft = start + change * easeInOutQuad(progress);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Check scroll position and update reactivity
    const handleScroll = () => {
        showScrollToTop = window.scrollY > 300; // Trigger button visibility
    };

    function checkScreenSize() {
        isSmallScreen = window.innerWidth < 768; // Adjust breakpoint as needed
    }

    // INIT
    onMount(() => {
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

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
            window.removeEventListener("resize", checkScreenSize);
        };
    });
    let contentVisible = false; // State to toggle content visibility
    let pubToggle = false; // State to toggle content visibility

    function toggleContent() {
        contentVisible = !contentVisible; // Toggle the content visibility
    }

    function togglePublication() {
        pubToggle = !pubToggle; // Toggle the content visibility
    }
</script>

<div id="wrapper" bind:clientWidth={width}>
    <div id="home">
        <div class="logos">
            <img alt="University of St Andrews Logo" src="uosa.png" />
            <img alt="University of St Andrews Logo" src="uoe_white.png" />
            <img alt="PeaceRep Logo" src="peacerep_logo.jpg" />
        </div>

        <div id="navigation">
            <!-- Hamburger Icon (Mobile) -->
            <i
                style="padding: 5px; cursor: pointer;"
                class="fa fa-bars menu-icon"
                role="button"
                tabindex="0"
                aria-label="Toggle menu"
                on:click={() => (isMenuOpen = !isMenuOpen)}
                on:keydown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        isMenuOpen = !isMenuOpen;
                    }
                }}
            ></i>

            <!-- Individual Buttons (Desktop) -->
            {#if !isSmallScreen}
                {#each sections as section}
                    <button
                        class="menu-button"
                        on:click={() => scrollToSection(section.id)}
                    >
                        {section.name}
                    </button>
                {/each}
            {/if}

            <!-- Dropdown Menu (Mobile) -->
            {#if isSmallScreen && isMenuOpen}
                <ul class="dropdown">
                    {#each sections as section}
                        <li>
                            <button
                                style="background: none; border: none; cursor: pointer; font-family: 'Montserrat', sans-serif;"
                                on:click={() => scrollToSection(section.id)}
                                class="menu-item"
                            >
                                {section.name}
                            </button>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>

        <!-- <h1>MEND: Mediation Events and Negotiators Database</h1> -->
        <h1 style="font-size: 50px;">Global PeaceHub</h1>
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
            padding: 10px;"
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

    <div id="about">
        <h3 style="padding: 10px;">About</h3>
        <div id="about_content">
            <p id="first-paragraph" style="text-align: justify;">
                Our research explores fragmentations in the global order and how
                these impact peace and transition processes. We seek to better
                understand why and how different third-party actors – state,
                intergovernmental, and non-governmental actors – intervene in
                attempts to broker peace, and how they see themselves
                contributing to reduction of conflict and risks of conflict
                relapse. We also study how local actors are navigating this
                multiplicity of mediators and peacebuilders and how this is
                shaping conflict outcomes and post-conflict governance.
                <br />
                <br />
                The project produces dedicated case and trends studies as part of
                the
                <a
                    href="https://peacerep.org/research/geopolitical-transitions/"
                    style="text-decoration: none">PeaceRep Global Transitions</a
                >
                series and is developing two complementary datasets:
                <strong
                    >Third Parties in Peace Agreements Dataset (PAA-X)</strong
                >
                and
                <strong>Mediation Event and Negotiators Database (MEND)</strong
                >.
            </p>

            <!-- Conditional rendering for the additional paragraphs -->
            {#if contentVisible}
                <p style="margin-left: 30px; margin-right: 30px;">
                    • <strong>Third Parties in Peace Agreements Dataset</strong
                    >. Most formal agreements in peace processes are supported
                    by parties external to the armed conflict, in the form of
                    third-party signature to the agreement. In the PA-X
                    collection of peace agreements that address inter- and
                    intra- state, or mixed conflicts, around sixty percent of
                    agreements feature a signatory which is not one of the main
                    conflict parties, and around one-third of all agreements
                    feature an international third-party signatory. The Third
                    Parties in Peace Agreements dataset draws on the Peace
                    Agreement Actors Dataset (PAA-X) and is the only existing
                    data resource on third-party signatories in peace
                    agreements. It allows for an in-depth examination of the
                    patterns of engagement in peace agreements and provides
                    valuable insights into what actors are necessary for
                    conflict parties to commit to a formal, written agreement.
                    This data is instrumental in discerning the regional and
                    topical priorities of individual interveners since 1990,
                    giving us insight into the types of agreements supported by
                    individual third parties.
                </p>
                <p style="margin-left: 30px; margin-right: 30px;">
                    • <strong
                        >Mediation Event and Negotiators Database (MEND)</strong
                    > is a new and growing resource for researchers and practitioners
                    with a focus on peace and conflict resolution. The dataset comprehensively
                    covers broader peacemaking efforts within major armed conflicts,
                    tracking all mediation and mediation-related events involving
                    external third-party actors, regardless of whether these events
                    result in a formal peace agreement. It captures mediation as
                    part of formal peace initiatives and mediation efforts running
                    in support or in parallel to these. Each record corresponds to
                    a unique event, providing detailed metadata about location, third
                    parties, local actors, and individuals involved. The MEND dataset
                    facilitates a nuanced understanding of the roles various actors
                    play in contributing to the peace processes and in brokering
                    agreements. It also enables the identification of unsuccessful
                    or spoiler mediation efforts that may still have influenced the
                    ongoing conflict management. In an era marked by global fragmentation,
                    this data plays a crucial role in providing insights into where,
                    when, how, and why actors engage in mediation activities, allowing
                    for the mapping of network dynamics between international and
                    local actors, and identification of the mediation conditions
                    conducive to the eventual signing of agreements.
                </p>
            {/if}

            <!-- "Read more" button -->
            <button id="read-more-btn" on:click={toggleContent}>
                {contentVisible ? "Show Less" : "Read More"}
            </button>
        </div>
    </div>

    <div id="people">
        <h3 style="width: 100px;text-align: left; padding: 10px">Team</h3>
        <div class="image-grid">
            {#each images_ppl as { src, name, position } (src)}
                <div class="image-container-people">
                    <img
                        style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);"
                        loading="lazy"
                        {src}
                        alt={name}
                    />
                    <p><strong>{name}</strong></p>
                    <p>{position}</p>
                </div>
            {/each}
        </div>
    </div>

    <!-- research section -->
    <div id="research">
        <h3
            style="width: 100px;text-align: left;border-radius: 2px; font-size:20px;"
        >
            Research
        </h3>
        <!-- <div class="gallery-container-research">
            <button
                class="arrow left"
                style="border: 2px solid white;"
                aria-label="Scroll left"
                on:click={() => scrollGalleryResearch(-1)}
            >
                <i
                    class="fa fa-arrow-left"
                    style="color: white;"
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
                style="border: 2px solid white;"
                on:click={() => scrollGalleryResearch(1)}
            >
                <i
                    class="fa fa-arrow-right"
                    style="color: white;"
                    aria-hidden="true"
                ></i>
            </button>
        </div> -->

        <div id="publications">
            <div class="publication_content">
                <h3>2025</h3>
                <p>
                    <strong>Elisa D’Amico</strong> (2025)
                    <a
                        style="color: #b6cee2; text-decoration: none;"
                        href="https://peacerep.org/publication/conflict-in-a-warming-world/"
                        >Conflict in a Warming World: How Climate Shocks Impact
                        Rebel Demands and Peace Agreement Outcomes. [Climate &
                        Natural Resources Series]. PeaceRep: The Peace and
                        Conflict Resolution Evidence Platform, University of
                        Edinburgh.</a
                    >
                </p>
                <h3>2024</h3>
                <p>
                    <strong>Mateja Peter</strong> (2024)
                    <a
                        style="color: #b6cee2;text-decoration: none;"
                        href="https://www.cogitatiopress.com/politicsandgovernance/article/view/7357"
                        >‘Global fragmentation and collective security
                        instruments: Weakening the liberal international order
                        from within.’ Politics and Governance, 12 (7357), 1-15.</a
                    >
                </p>
                <p>
                    <strong>Sanja Badanjak and Mateja Peter</strong> (2024)
                    <a
                        style="color: #b6cee2;text-decoration: none;"
                        href="https://www.c-r.org/accord/still-time-to-talk"
                        >‘Diversification and Congestion in Peacemaking: What
                        the Data Says’. in Theresa Whitfield (ed.), Still time
                        to talk: Adaptation and innovation in peace mediation,
                        Accord 30. London: Conciliation Resources.</a
                    >
                </p>
                <p>
                    <strong>Mateja Peter and Kasia Houghton</strong> (2024)
                    <a
                        style="color: #b6cee2;text-decoration: none;"
                        href="https://peacerep.org/publication/russia-and-china-in-liberal-peacebuilding/"
                        >Russia and China in Liberal Peacebuilding: Perceptions
                        and Engagement with the Dayton Peace Process in Bosnia
                        and Herzegovina. [Global Transitions Series]. PeaceRep:
                        The Peace and Conflict Resolution Evidence Platform,
                        University of Edinburgh.</a
                    >
                </p>
                <p>
                    <strong>Niamh Henry</strong> (2024)
                    <a
                        style="color: #b6cee2;text-decoration: none;"
                        href="https://peacerep.org/publication/extracting-named-actors-from-text/"
                        >Extracting Named Actors from Text: Using Named Entity
                        Recognition (NER) in Peace and Conflict Studies [Peace
                        Analytics Series]. PeaceRep: The Peace and Conflict
                        Resolution Evidence Platform, University of Edinburgh.</a
                    >
                </p>
                <p>
                    <strong>Elisa D’Amico</strong> (2024)
                    <a
                        style="color: #b6cee2;text-decoration: none;"
                        href="https://peacerep.org/publication/semi-automated-coding-for-conflict-mediation-research-database-development/"
                        >Semi-Automated Coding for Conflict Mediation Research:
                        Database Development. Peace Analytics Series, University
                        of Edinburgh: Peace and Conflict Resolution Evidence
                        Platform: November 2024.
                    </a>
                </p>
                <p>
                    <strong>Kasia Houghton</strong> (2024).
                    <a
                        style="color: #b6cee2;text-decoration: none;"
                        href="https://www.taylorfrancis.com/chapters/oa-edit/10.4324/9781003372011-6/competition-norms-kasia-houghton"
                        >‘The Competition over Norms: The Case of the Syrian
                        Conflict.’ In Benjamin Houghton and Kasia Houghton
                        (eds.) China, Russia and the USA in the Middle East: The
                        Contest for Supremacy. London: Routledge, 46-64.
                    </a>
                </p>
                <p>
                    <strong>Mateja Peter and Ruoxi Wang</strong> (2024)
                    <a
                        style="color: #b6cee2;text-decoration: none;"
                        href="https://brill.com/view/journals/joup/27/1/article-p85_005.xml"
                        >‘China’s Approach to Human Security within and outside
                        UN Peacekeeping: Drawing Lessons from South Sudan.’
                        Journal of International Peacekeeping, 27(1), 85-114.</a
                    >
                </p>
                {#if pubToggle}
                    <h3>2023</h3>
                    <p>
                        <strong>Mateja Peter and Kasia Houghton</strong> (2023)
                        <a
                            style="color: #b6cee2;text-decoration: none;"
                            href="https://peacerep.org/publication/third-party-mediation-in-sudan-and-south-sudan-longer-term-trends/"
                            >Congestion and Diversification of Third-Party
                            Mediation in Sudan and South Sudan: First Look at
                            some Longer-Term Trends. [Global Transitions
                            Series]. PeaceRep: The Peace and Conflict Resolution
                            Evidence Platform, University of Edinburgh.</a
                        >
                    </p>
                    <p>
                        <strong>Mateja Peter and Marcel Plichta</strong> (2023)
                        <a
                            style="color: #b6cee2;text-decoration: none;"
                            href="https://peacerep.org/publication/china-russia-sudan-economic-military-engagement/"
                            >China and Russia in Sudan: Surveying data on
                            economic and military engagement. [Global
                            Transitions Series]. PeaceRep: The Peace and
                            Conflict Resolution Evidence Platform, University of
                            Edinburgh.th Sudan.’ Journal of International
                            Peacekeeping, 27(1), 85-114.</a
                        >
                    </p>
                    <p>
                        <strong>Sanja Badanjak</strong> (2023)
                        <a
                            style="color: #b6cee2;text-decoration: none;"
                            href="https://peacerep.org/publication/third-parties-peace-agreements-data-trends/"
                            >Third Parties in Peace Agreements: First Look at
                            New Data and Key Trends. [Global Transitions
                            Series]. PeaceRep: The Peace and Conflict Resolution
                            Evidence Platform, University of Edinburgh.</a
                        >
                    </p>
                    <p>
                        <strong>Sanja Badanjak</strong> (2023)
                        <a
                            style="color: #b6cee2;text-decoration: none;"
                            href="https://peacerep.org/publication/eu-external-action-development-spending-covid/"
                            >EU External Action and Development Spending in a
                            Time of Covid-19. [Covid-19 Series]. PeaceRep: The
                            Peace and Conflict Resolution Evidence Platform,
                            University of Edinburgh.</a
                        >
                    </p>
                    <h3>2022</h3>
                    <p>
                        <strong>Mateja Peter and Haley Rice</strong> (2022)
                        <a
                            style="color: #b6cee2;text-decoration: none;"
                            href="https://peacerep.org/publication/non-western-approaches-to-peacemaking-and-peacebuilding-state-of-the-art-and-an-agenda-for-research/"
                            >Non-Western approaches to peacemaking and
                            peacebuilding: State-of-the-art and an agenda for
                            research. [Global Transitions Series]. PeaceRep: The
                            Peace and Conflict Resolution Evidence Platform,
                            University of Edinburgh.</a
                        >
                    </p>
                    <h3>Global Transitions Series</h3>
                    <p>
                        As part of the PeaceRep consortium, the project also
                        produces the <a
                            style="text-decoration: none;"
                            target="_blank"
                            href="https://peacerep.org/research/geopolitical-transitions/"
                            >Global Transitions</a
                        > series, edited by Mateja Peter. This includes publications
                        by the core team and further studies produced in the wider
                        consortium.
                    </p>
                {/if}
                <button id="read-more-btn-pub" on:click={togglePublication}>
                    {pubToggle ? "Show Less" : "Read More"}
                </button>
            </div>
        </div>
    </div>

    <div id="funding">
        <h3 style="padding: 10px;">Funding</h3>
        <div id="funding_content">
            <p>
                Our research is supported by the Peace and Conflict Resolution
                Evidence Platform (PeaceRep), funded by UK International
                Development from the UK government. However, the views expressed
                are those of the authors and do not necessarily reflect the UK
                government’s official policies. We receive additional support
                from the Universities of St Andrews and Edinburgh.
            </p>
        </div>
    </div>

    <div id="credit" style="background-color: #001c23;">
        <p style="text-align: center;">
            Web and Visualization Development: <strong
                ><a
                    style="text-decoration: none;"
                    href="https://tomasvancisin.co.uk/"
                    target="_blank">Tomas Vancisin</a
                ></strong
            >
        </p>
    </div>

    <!-- Scroll to Top Button -->
    <!-- {#if showScrollToTop}
        <button
            id="scrollToTop"
            on:click={scrollToTop}
            aria-label="Scroll to top"
        >
            <i class="fa fa-arrow-up" style="color: yellow;" aria-hidden="true"
            ></i>
        </button>
    {/if} -->
</div>

<style>
    /* General styling */
    #wrapper {
        width: 100%;
    }

    .logos {
        display: flex;
        gap: 5px;
        position: absolute;
        top: 5px;
        right: 5px;
    }

    img {
        height: 35px;
        margin-left: 5px;
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

    main {
        width: 100%;
        display: flex;
        overflow: hidden;
        text-align: center;
    }

    #navigation {
        position: absolute;
        top: -2px;
        display: flex;
        align-items: center;
        gap: 3px;
    }

    .menu-button {
        font-family: "Montserrat", sans-serif;
        background: #00303e;
        border: 1px solid rgb(78, 78, 78);
        border-radius: 2px;
        padding: 5px;
        width: 95px;
        font-size: 16px;
        cursor: pointer;
        color: white;
    }

    .menu-button:hover {
        background: rgb(78, 78, 78);
        color: white;
    }

    .dropdown {
        list-style: none;
        position: absolute;
        background: black;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 10px;
        top: 30px;
        left: 5px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .menu-icon {
        display: none;
        cursor: pointer;
        font-size: 24px;
    }

    @media (max-width: 767px) {
        .menu-button {
            display: none;
        }

        .menu-icon {
            display: block;
        }
    }

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

    #research,
    #people,
    #about {
        position: relative;
    }

    #about_content {
        position: relative;
        margin: auto;
        width: 70%;
        padding-top: 100px;
        padding-bottom: 120px;
    }
    .publication_content {
        position: relative;
        margin: auto;
        width: 80%;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    #funding_content {
        position: relative;
        margin: auto;
        width: 65%;
        padding-top: 40px;
        padding-bottom: 80px;
    }

    #research {
        background-color: #001c23;
    }
    #people {
        background-color: #003645;
    }
    #about {
        position: relative;
        background-color: #001c23;
        padding-bottom: 20px;
        font-weight: 200;
    }
    #publications {
        position: relative;
        margin: auto;
        width: 80%;
        padding: 20px;
        font-weight: 200;
    }
    #credit {
        position: relative;
        margin: auto;
        width: 100%;
        padding: 10px;
        background-color: #001c23;
        font-weight: 200;
    }

    #people {
        text-align: center;
    }

    .image-grid {
        display: grid;
        gap: 20px;
        width: 90%;
        max-width: 1200px;
        margin: auto;

        /* Default: 1 column (mobile first) */
        grid-template-columns: 1fr;
    }

    /* Medium screens: 2 rows of 3 */
    @media (min-width: 600px) {
        .image-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    /* Large screens: 1 row of 6 */
    @media (min-width: 1024px) {
        .image-grid {
            grid-template-columns: repeat(6, 1fr);
        }
    }

    .image-container-people {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding-top: 100px;
        padding-bottom: 100px;
    }

    .image-container-people img {
        width: 100%;
        height: auto;
        border-radius: 3px;
    }

    .image-container-people p {
        margin: 10px 0 0;
        font-size: 13px;
        color: white;
        line-height: 1;
    }

    /* Optional: Styling for the button */
    #read-more-btn,
    #read-more-btn-pub {
        font-family: "Montserrat", sans-serif;
        margin-top: 10px;
        padding: 8px 16px;
        background-color: #635c7e;
        color: white;
        border: none;
        border-radius: 2px;
        cursor: pointer;
    }

    #read-more-btn:hover,
    #read-more-btn-pub:hover {
        background-color: rgb(78, 78, 78);
        color: white;
    }
</style>
