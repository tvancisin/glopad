<script>
    export let width;
    export let height;
    export let margin;
    export let top_ten_mediators;
    export let horizontal_xScale;
    export let horizontal_yScale;
    export let horizontal_mediator_yScale;
</script>

<!-- top mediators -->
<div class="mediators" bind:clientWidth={width}>
    <h2>Top Mediators (2018-2024)</h2>
    <svg {width} {height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
            {#each top_ten_mediators as mediator}
                <rect
                    x={0}
                    y={horizontal_mediator_yScale(mediator[0])}
                    rx="2"
                    width={horizontal_xScale(mediator[1])}
                    height={horizontal_yScale.bandwidth()}
                    fill="steelblue"
                />
                <text
                    x={horizontal_xScale(mediator[1]) + 10}
                    y={horizontal_mediator_yScale(mediator[0]) +
                        horizontal_yScale.bandwidth() / 2}
                    dy=".35em"
                    font-size="12"
                    text-anchor="start"
                    fill="white"
                >
                    {mediator[0] + " (" + mediator[1] + ")"}
                </text>
            {/each}
        </g>
    </svg>
</div>

<style>
    .mediators {
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
</style>
