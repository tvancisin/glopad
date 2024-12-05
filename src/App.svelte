<script>
  import { onMount } from "svelte";
  import { getGeo } from "./utils";
  import Map from "./lib/Map.svelte";

  let width, height;
  let all_polygons;

  // Load GEOJSON
  const json_path = "/data/country_polygons.json";
  getGeo(json_path).then((geo) => {
    all_polygons = geo;
  });

  // Scroll to a specific section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Dropdown options
  const sections = [
    { id: "intro", name: "Introduction" },
    { id: "research", name: "Research" },
    { id: "people", name: "People" },
    { id: "map", name: "Map" },
  ];

  let isMenuOpen = false; // Toggle menu visibility
  let showScrollToTop = false; // Visibility of the scroll-to-top button

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Check scroll position and update reactivity
  const handleScroll = () => {
    showScrollToTop = window.scrollY > 300; // Trigger button visibility
  };

  // Attach scroll listener on mount
  onMount(() => {
    console.log("Adding scroll listener");
    window.addEventListener("scroll", handleScroll);
    return () => {
      console.log("Removing scroll listener");
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<div id="wrapper" bind:clientWidth={width}>
  <div id="intro">
    <img
      id="intro_logo_usa"
      alt="University of St Andrews Logo"
      src="usa_logo.png"
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
            <li>
              <button
                type="button"
                on:click={() => {
                  scrollToSection(section.id);
                  isMenuOpen = false;
                }}
              >
                {section.name}
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>

    <h1>Global Fragmentation Initiative</h1>
    <h3>
      Understanding shifts in the geopolitical context of peace and transition
      processes
    </h3>
  </div>
  <div id="research">
    <h3 style="width: 90px; background-color: red; border-radius: 2px">Research</h3>
  </div>
  <div id="people">
    <h3 style="width: 70px; background-color: red; border-radius: 2px">People</h3>
  </div>
  <main
    id="map"
    bind:clientWidth={width}
    style="height: calc(var(--vh, 1vh) * 100);"
  >
    <Map {all_polygons} />
  </main>

  <!-- Scroll to Top Button -->
  {#if showScrollToTop}
    <button id="scrollToTop" on:click={scrollToTop}>
      <i class="fa fa-arrow-up" aria-hidden="true"></i>
    </button>
  {/if}
</div>

<style>
  /* General styling */
  #wrapper {
    width: 100vw;
  }

  #intro_logo_usa {
    position: absolute;
    top: 2px;
    right: 20px;
    height: 70px;
  }

  h1 {
    color: white;
    font-weight: 400;
  }

  h3 {
    color: white;
    font-weight: 400;
    padding: 10px;
    margin: 0px;
  }

  #intro {
    position: relative;
    align-content: center;
    text-align: center;
    background-color: black;
    width: 100vw;
    height: 400px;
  }

  #research {
    margin: 0px;
    position: relative;
    background-color: #252529;
    width: 100vw;
    height: 90vh;
  }

  #people {
    position: relative;
    background-color: black;
    width: 100vw;
    height: 90vh;
  }

  main {
    width: 100vw;
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
    border-radius: 2px;
    list-style: none;
    padding: 0;
    margin: 0;
    z-index: 10;
  }

  .dropdown li button {
    all: unset;
    font-weight: 300;
    padding: 10px 20px;
    color: white;
    cursor: pointer;
    display: block;
    text-align: left;
  }

  .dropdown li button:hover {
    background-color: #042645;
  }

  /* Scroll to Top Button */
  #scrollToTop {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background-color: #252529;
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
</style>
