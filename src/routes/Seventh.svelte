<script>
    import * as d3 from "d3";

    export let width;
    export let height;
    export let nodes;
    export let r_scale;
    export let categories;
    export let x_circle;

    $: categoryPositions = categories.map((category) => {
        let categoryNodes = nodes.filter((node) => node.category === category);
        let avgX =
            categoryNodes.length > 0
                ? d3.mean(categoryNodes, (d) => d.x) // Compute average X position
                : x_circle(category); // Fallback to scale if no nodes exist

        return { category, x: avgX };
    });
</script>

<!-- text circle packing -->
<div class="actor_types" bind:clientWidth={width}>
    <h2>Mediators by Actor Type</h2>
    <svg {width} {height}>
        <g transform="translate(50, 0)">
            {#each nodes as point}
                <circle
                    class="node"
                    r={r_scale(point["value"])}
                    fill="steelblue"
                    cx={point.x}
                    cy={point.y}
                    ><title>{point.name}</title>
                </circle>
            {/each}
            {#each nodes as point}
                {#if point.value > 10}
                    <text
                        x={point.x}
                        y={point.y}
                        dy=".35em"
                        font-size="12"
                        text-anchor="middle"
                        font-weight="500"
                        fill="white"
                    >
                        {point.name}
                    </text>
                {/if}
            {/each}
            {#each categoryPositions as { category, x }}
                <text
                    {x}
                    y={height - 20}
                    text-anchor="middle"
                    font-size="14"
                    font-weight="600"
                    fill="white"
                >
                    {category}
                </text>
            {/each}
        </g>
    </svg>
</div>

<style>
    .actor_types {
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
