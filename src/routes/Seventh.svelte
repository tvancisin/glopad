<script>
    import * as d3 from "d3";

    export let width;
    export let innerWidthAdjusted;
    export let height;
    export let margin;
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

    function splitText(text, maxChars) {
        const words = text.split(" ");
        const lines = [];
        let currentLine = "";

        words.forEach((word) => {
            if ((currentLine + word).length > maxChars) {
                lines.push(currentLine.trim());
                currentLine = word + " ";
            } else {
                currentLine += word + " ";
            }
        });

        if (currentLine.trim()) {
            lines.push(currentLine.trim());
        }

        return lines;
    }

</script>

<!-- text circle packing -->
<div class="actor_types" bind:clientWidth={width}>
    <h2>Actors Involved in Mediation & Mediation-Related Activities by Type</h2>
    <svg {width} {height}>
        <g transform="translate({innerWidthAdjusted / 6 / 2 + margin.left}, 0)">
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
                {#if point.value > 15}
                    {#await Promise.resolve(splitText(point.name, 10)) then lines}
                        <text
                            x={point.x}
                            y={point.y - (lines.length - 1) * 6}
                            font-size="12"
                            text-anchor="middle"
                            font-weight="500"
                            fill="white"
                        >
                            {#each lines as line, i}
                                <tspan x={point.x} dy={i === 0 ? "0" : "1.2em"}
                                    >{line}</tspan
                                >
                            {/each}
                        </text>
                    {/await}
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
                    {#if category === "international"}
                        <tspan {x} dy="-0.6em">International</tspan>
                        <tspan {x} dy="1.2em">Organizations</tspan>
                    {:else if category === "regional"}
                        <tspan {x} dy="-0.6em">Regional</tspan>
                        <tspan {x} dy="1.2em">Organizations</tspan>
                    {:else if category === "neighbor"}
                        <tspan {x} dy="-0.6em">Neighbour</tspan>
                        <tspan {x} dy="1.2em">States</tspan>
                    {:else if category === "mena"}
                        <tspan {x} dy="-0.6em">MENA</tspan>
                        <tspan {x} dy="1.2em">States</tspan>
                    {:else if category === "other_state"}
                        <tspan {x} dy="-0.6em">Other</tspan>
                        <tspan {x} dy="1.2em">States</tspan>
                    {:else}
                        {category}
                    {/if}
                </text>
            {/each}
        </g>
    </svg>
</div>

<style>
    .actor_types {
        max-width: 100%;
        margin: 20px auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: var(--bg-color, #001c23);
        padding: 20px;
        box-sizing: border-box;
        border-radius: 10px;
    }
</style>
