<script>
  import { onMount } from "svelte";
  import mapboxgl from "mapbox-gl";

  export let all_polygons;

  let height;
  let map;
  let isOverlayVisible = true; // Controls the visibility of the overlay

  function adjustMapForWindowSize() {
    let centerCoordinates = map.getCenter();
    if (window.innerWidth <= 750) {
      map.flyTo({
        center: [centerCoordinates.lng, centerCoordinates.lat],
        zoom: 0.8,
      });
    } else if (window.innerWidth <= 900) {
      map.flyTo({
        center: [centerCoordinates.lng, centerCoordinates.lat],
        zoom: 1.1,
      });
    } else if (window.innerWidth <= 1050) {
      map.flyTo({
        center: [centerCoordinates.lng, centerCoordinates.lat],
        zoom: 1.3,
      });
    } else {
      map.flyTo({
        center: [centerCoordinates.lng, centerCoordinates.lat],
        zoom: 1.5,
      });
    }
  }

  function removeOverlay() {
    isOverlayVisible = false;
  }

  onMount(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2FzaGFnYXJpYmFsZHkiLCJhIjoiY2xyajRlczBlMDhqMTJpcXF3dHJhdTVsNyJ9.P_6mX_qbcbxLDS1o_SxpFg";
    map = new mapboxgl.Map({
      container: map,
      attributionControl: false,
      style: "mapbox://styles/sashagaribaldy/cm4aigyc400qc01s6bzp76jjf",
      center: [10, 15],
      zoom: 1.5,
      projection: "naturalEarth",
      maxZoom: 5,
    });
    window.addEventListener("resize", adjustMapForWindowSize);
    adjustMapForWindowSize();
  });
</script>

<div class="map-container" bind:clientHeight={height}>
  <div id="map" bind:this={map}></div>
  {#if isOverlayVisible}
    <div class="overlay">
      <button class="remove-overlay" on:click={removeOverlay}>Click to Interact</button>
    </div>
  {/if}
</div>

<style>
  .map-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  #map {
    width: 100%;
    height: 100%;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .remove-overlay {
    background-color: #252529;
    color: white; 
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
  }

  .remove-overlay:hover {
    background-color: #8f2121;
  }
</style>
