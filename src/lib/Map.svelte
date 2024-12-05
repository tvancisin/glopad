<script>
  import { onMount } from "svelte";
  import mapboxgl from "mapbox-gl";

  export let all_polygons;

  let height;
  let map;

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

  div {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
</style>
