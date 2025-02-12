<script>
  import { onMount } from "svelte";
  import mapboxgl from "mapbox-gl";
  import turf from "turf";
  import { countryNames } from "../utils";

  let { inflate, all_polygons } = $props();

  let height = $state();
  let map;
  let isOverlayVisible = $state(true); // Controls the visibility of the overlay
  let hoveredPolygonId = null;

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
      logoPosition: "bottom-right",
    });
  });

  $effect(() => {
    if (all_polygons && map) {
      // Ensure this block runs only after the map has fully loaded
      map.once("idle", () => {
        //add source
        if (!map.getSource("countries")) {
          map.addSource("countries", {
            type: "geojson",
            data: all_polygons,
            generateId: true, // Ensures all features have unique IDs
          });

          //add fill layer
          map.addLayer({
            id: "countries_fill",
            type: "fill",
            source: "countries",
            paint: {
              "fill-color": "steelblue",
              "fill-opacity": 0.9,
            },
          });

          map.addLayer({
            id: "countries_outline",
            type: "line",
            source: "countries",
            layout: {},
            paint: {
              "line-color": "black",
              "line-width": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                1,
                0,
              ],
            },
            filter: ["in", ["get", "ADMIN"], ["literal", countryNames]],
          });

          // highlight polygon on hover
          map.on("mousemove", "countries_fill", (e) => {
            map.getCanvas().style.cursor = "pointer";
            if (e.features.length > 0) {
              if (hoveredPolygonId !== null) {
                map.setFeatureState(
                  { source: "countries", id: hoveredPolygonId },
                  { hover: false },
                );
              }
              hoveredPolygonId = e.features[0].id;
              map.setFeatureState(
                { source: "countries", id: hoveredPolygonId },
                { hover: true },
              );
            }
          });

          // on mouse leave, no highlight
          map.on("mouseleave", "countries_fill", () => {
            map.getCanvas().style.cursor = "";
            if (hoveredPolygonId !== null) {
              map.setFeatureState(
                { source: "countries", id: hoveredPolygonId },
                { hover: false },
              );
            }
            hoveredPolygonId = null;
          });

          map.on("click", "countries_fill", (e) => {
            let clicked_country = e.features[0].properties.ADMIN;
            zoomToCountry(clicked_country);
            inflate(clicked_country);
          });

          adjustMapForWindowSize();
          window.addEventListener("resize", adjustMapForWindowSize);
        }
      });
    }
  });

  function zoomToCountry(country) {
    let bound_box;
    if (country == "Russia") {
      bound_box = [
        68.1434025400001, 86.74555084800015, 97.36225305200006,
        35.49540557900009,
      ];
    } else if (country == "United States of America") {
      bound_box = [
        -160.3688042289999, 24.546282924364334, -36.7005916009999,
        32.71283640500015,
      ];
    } else if (country == "France") {
      bound_box = [
        -8.691314256999902, 40.909613348000065, 12.771169467000021, 50.84788646,
      ];
    } else {
      let countries = all_polygons.features;

      let the_country = countries.find(function (d) {
        return d.properties.ADMIN == country;
      });
      bound_box = turf.bbox(the_country);
    }

    if (bound_box) {
      map.fitBounds(bound_box, {
        padding: 50,
      });
    }
  }
</script>

<div class="map-container" bind:clientHeight={height}>
  <div id="map" bind:this={map}></div>
  {#if isOverlayVisible}
    <div class="overlay">
      <button class="remove-overlay" onclick={removeOverlay}
        >Click to Explore</button
      >
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
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .remove-overlay {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: none;
    background-color: rgba(0, 0, 0, 0.76);
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
  }

  .remove-overlay:hover {
    cursor: pointer;
    background-color: #8f2121;
  }
</style>
