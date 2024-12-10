<script>
  import { onMount, onDestroy } from "svelte";
  import { getGeo } from "./utils";
  import Map from "./lib/Map.svelte";
  import { images, sections, scrollToSection } from "./utils";

  let width;
  let all_polygons;
  let showScrollToTop = false; // Visibility of the scroll-to-top button
  let isMenuOpen = false; // Toggle menu visibility

  // Load GEOJSON
  const json_path = "/data/country_polygons.json";
  getGeo(json_path).then((geo) => {
    all_polygons = geo;
  });

  // RESEARCH GALLERY
  let imageRow;
  const scrollGallery = (direction) => {
    if (imageRow) {
      const scrollAmount = imageRow.offsetWidth / 5; // Scroll width of one image
      imageRow.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
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
    imageRow = document.querySelector(".image-row");

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

    <h1>Global Fragmentation</h1>
    <h3>
      Understanding shifts in the geopolitical context of peace and transition
      processes
    </h3>
  </div>
  <!-- <hr /> -->

  <div id="research">
    <h3 style="width: 90px; background-color: #003645; border-radius: 2px">
      Research
    </h3>
    <div class="gallery-container">
      <button
        class="arrow left"
        aria-label="Scroll left"
        on:click={() => scrollGallery(-1)}
      >
        <i class="fa fa-arrow-left" style="color: yellow;" aria-hidden="true"
        ></i>
      </button>
      <div class="image-row">
        {#each images as image (image)}
          <img src={image} alt="Research image" />
        {/each}
      </div>
      <button
        class="arrow right"
        aria-label="Scroll right"
        on:click={() => scrollGallery(1)}
      >
        <i class="fa fa-arrow-right" style="color: yellow;" aria-hidden="true"
        ></i>
      </button>
    </div>
  </div>
  <!-- <hr /> -->
  <div id="people">
    <h3 style="width: 70px; background-color: #001C23; border-radius: 2px">
      People
    </h3>
  </div>
  <!-- <hr /> -->
  <main
    id="map"
    bind:clientWidth={width}
    style="height: calc(var(--vh, 1vh) * 100);"
  >
    <h3
      style=" 
      z-index: 400; 
      position: absolute; 
      background-color: #003645; 
      text-align: left; 
      border-radius: 2px"
    >
      Map
    </h3>
    <Map {all_polygons} />
  </main>

  <!-- Scroll to Top Button -->
  {#if showScrollToTop}
    <button id="scrollToTop" on:click={scrollToTop} aria-label="Scroll to top">
      <i class="fa fa-arrow-up" style="color: yellow;" aria-hidden="true"></i>
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

  @media only screen and (max-width: 1450px) {
    #intro_logo_usa,
    #intro_logo_uoe {
      height: 40px;
    }
    #intro_logo_uoe {
      top: 50px;
    }
  }

  @media only screen and (max-width: 1200px) {
    #intro_logo_usa,
    #intro_logo_uoe {
      height: 30px;
    }
    #intro_logo_uoe {
      top: 40px;
    }
  }

  @media only screen and (max-width: 768px) {
    #intro_logo_usa,
    #intro_logo_uoe {
      height: 20px;
    }
    #intro_logo_uoe {
      top: 25px;
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
    background-color: #003645;
  }

  #people {
    position: relative;
    background-color: #001c23;
    width: 100%;
    height: 90vh;
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

  #research_info {
    display: flex;
    flex-wrap: wrap; /* Allows wrapping for small screens */
    gap: 20px; /* Adds space between columns */
    margin-left: 50px;
    margin-right: 50px;
  }

  #research_info > * {
    flex: 1 1 calc(50% - 20px); /* Two columns with equal width */
    box-sizing: border-box; /* Ensures padding and border don't affect width */
  }

  @media (max-width: 768px) {
    #research_info > * {
      flex: 1 1 100%; /* Full width on small screens */
    }
  }

  .gallery-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    width: 100%;
    height: 70vh;
    background-color: #003645;
    padding-bottom: 80px;
    padding-top: 50px;
  }

  .image-row {
    display: flex;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none; /* Hide scrollbar for Firefox */
    -ms-overflow-style: none; /* Hide scrollbar for IE/Edge */
    width: 100%;
    height: 100%;
  }

  .image-row::-webkit-scrollbar {
    display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
  }

  .image-row img {
    margin: 0 5px;
    height: 100%;
    object-fit: cover;
    border-radius: 3px;
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
</style>
