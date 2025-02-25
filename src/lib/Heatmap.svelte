<script>
    import { onMount } from "svelte";
    import mapboxgl from "mapbox-gl";

    export let mediations;

    let heat_geojson;
    let isOverlayVisible = true; // Controls the visibility of the overlay
    let unknown_count;

    function removeOverlay() {
        isOverlayVisible = false;
    }

    function constructGeoJSON(data) {
        return {
            type: "FeatureCollection",
            features: data
                .filter((d) => {
                    return (
                        d.med_loc_x !== null &&
                        d.med_loc_x !== "" &&
                        d.med_loc_x !== " " &&
                        d.med_loc_y !== "Virtual"
                    );
                })
                .map((d) => {
                    return {
                        type: "Feature",
                        properties: {
                            med_event_ID: d.med_event_ID,
                            intensity: parseInt(d.num_med) || 1, // Optional: Set heatmap weight
                        },
                        geometry: {
                            type: "Point",
                            coordinates: [
                                parseFloat(d.med_loc_x), // Longitude
                                parseFloat(d.med_loc_y), // Latitude
                            ],
                        },
                    };
                }),
        };
    }

    $: if (mediations) {
        heat_geojson = constructGeoJSON(mediations);
    }

    let map;
    let height = 300;

    onMount(() => {
        mapboxgl.accessToken =
            "pk.eyJ1Ijoic2FzaGFnYXJpYmFsZHkiLCJhIjoiY2xyajRlczBlMDhqMTJpcXF3dHJhdTVsNyJ9.P_6mX_qbcbxLDS1o_SxpFg";
        map = new mapboxgl.Map({
            container: map,
            attributionControl: false,
            style: "mapbox://styles/sashagaribaldy/cm6ktkpxn00m901s2fo0bh1e4",
            center: [10, 15],
            zoom: 1.3,
            projection: "naturalEarth",
            maxZoom: 5,
            logoPosition: "bottom-right",
        });

        // Wait for the map to load before adding the heatmap
        map.on("load", () => {
            // Add the heatmap source
            map.addSource("heatmap-source", {
                type: "geojson",
                data: heat_geojson,
            });

            // Add the heatmap layer
            map.addLayer({
                id: "heatmap-layer",
                type: "heatmap",
                source: "heatmap-source",
                maxzoom: 5,
                paint: {
                    "heatmap-weight": [
                        "interpolate",
                        ["linear"],
                        ["get", "intensity"],
                        0,
                        0, // Minimum intensity
                        10,
                        1, // Maximum intensity
                    ],
                    "heatmap-intensity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        1,
                        1, // Low zoom → lower intensity
                        5,
                        3, // High zoom → higher intensity
                    ],
                    "heatmap-color": [
                        "interpolate",
                        ["linear"],
                        ["heatmap-density"],
                        0,
                        "rgba(33,102,172,0)",
                        0.2,
                        "rgb(103,169,207)",
                        0.4,
                        "steelblue",
                        0.6,
                        "rgb(253,219,199)",
                        0.8,
                        "gray",
                        1,
                        "white",
                    ],
                    "heatmap-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        1,
                        15, // Small radius at low zoom
                        5,
                        20, // Large radius at high zoom
                    ],
                    "heatmap-opacity": 0.8,
                },
            });
        });
    });
</script>

<div class="map-container" bind:clientHeight={height}>
    <div id="map" bind:this={map}></div>
    {#if isOverlayVisible}
        <div class="overlay">
            <button class="remove-overlay" onclick={removeOverlay}>Zoom</button>
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
        background-color: rgba(0, 0, 0, 0);
        display: flex;
        /* justify-content: center; */
        /* align-items: center; */
        z-index: 100;
    }

    .remove-overlay {
        position: absolute;
        bottom: 0px;
        width: 110px;
        height: 35px;
        border-radius: 3px;
        border: none;
        background-color: #991f30;
        font-family: "Montserrat", sans-serif;
        font-size: 16px;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
    }

    .remove-overlay:hover {
        cursor: pointer;
        background-color: #dc3939;
    }
</style>
