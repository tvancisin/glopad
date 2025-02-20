<script>
    import Heatmap from "../lib/Heatmap.svelte";

    export let width;
    export let height;
    export let margin;
    export let mediations;
    export let locationList;
    export let horizontal_xScale;
    export let horizontal_yScale;
</script>

<!-- top mediation locations -->
<div class="mediation_location" bind:clientWidth={width}>
    <h2>Mediation Locations</h2>
    <div class="location_map">
        <Heatmap {mediations} />
    </div>
    <svg {width} {height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
            {#each locationList as { location, count }}
                <rect
                    x={0}
                    y={horizontal_yScale(location)}
                    width={horizontal_xScale(count)}
                    height={horizontal_yScale.bandwidth()}
                    fill="steelblue"
                    rx="2"
                />
                <text
                    x={horizontal_xScale(count) - 20}
                    y={horizontal_yScale(location) +
                        horizontal_yScale.bandwidth() / 2}
                    dy=".35em"
                    font-size="12"
                    text-anchor="start"
                    fill="white"
                >
                    {count}
                </text>
                <text
                    x={horizontal_xScale(count) + 5}
                    y={horizontal_yScale(location) +
                        horizontal_yScale.bandwidth() / 2}
                    dy=".35em"
                    font-size="12"
                    text-anchor="start"
                    fill="white"
                >
                    {location}
                </text>
            {/each}
        </g>
    </svg>
</div>

<style>
    .mediation_location {
        max-width: 100%;
        margin: 20px auto; /* Adds spacing between sections */
        display: flex; /* Makes content alignment easier */
        flex-direction: column; /* Stacks content vertically */
        justify-content: center;
        align-items: center;
        background-color: var(
            --bg-color,
            #001c23
        ); /* Allows easy customization of background */
        padding: 20px; /* Adds padding for better visuals */
        box-sizing: border-box;
        border-radius: 10px; /* Optional: Gives rounded corners */
    }
    .location_map {
        width: 100%;
        height: 500px;
        background-color: #001c23;
        margin: 20px auto;
    }
</style>
