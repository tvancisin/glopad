<script>
    import * as d3 from "d3";

    export let width;
    export let height;
    export let historical_events;
    export let margin;
    export let xScale;
    export let innerHeight;
    export let agt_processed;

    let xAxisGroup2;
    $: {
        if (xAxisGroup2) {
            const tickValues = xScale.domain().filter((_, i) => i % 3 === 0); // Show every second tick
            const xAxis2 = d3
                .axisBottom(xScale)
                .tickValues(tickValues)
                .tickFormat((d) => {
                    const [year, month] = d.split("-");
                    return `${month}/${year}`; // Format ticks as "MM/YYYY"
                });
            d3.select(xAxisGroup2).call(xAxis2);
        }
    }

    let hoveredCircle = null; // Stores the hovered circle's data

    function showTooltip(event, name) {
        hoveredCircle = {
            x: event.clientX,
            y: event.clientY,
            name,
        };
    }

    function hideTooltip() {
        hoveredCircle = null;
    }
</script>

<!-- agreements per month -->
<div class="agreement_per_month" bind:clientWidth={width}>
    <h2>Agreements per Month</h2>
    <div class="legend">
        <div class="legend-item">
            <div class="color-box-2 red"></div>
            <span>MEND</span>
        </div>
        <div class="legend-item">
            <div class="color-box-2 steelblue"></div>
            <span>PA-X</span>
        </div>
    </div>
    <!-- Tooltip -->
    {#if hoveredCircle}
        <div
            class="tooltip"
            style="top: {hoveredCircle.y + 10}px; left: {hoveredCircle.x +
                10}px;"
        >
            {hoveredCircle.name}
        </div>
    {/if}
    <svg {width} height={height - 100}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
            <g
                bind:this={xAxisGroup2}
                transform={`translate(0, ${innerHeight - 100})`}
            />
            {#each historical_events as event, i}
                <line
                    x1={xScale(`${event.year}-${event.month}`)}
                    y1={10 + i * 20}
                    x2={xScale(`${event.year}-${event.month}`)}
                    y2={innerHeight - 110}
                    stroke="gray"
                    stroke-width="1"
                    stroke-dasharray="4 2"
                />
                <text
                    x={xScale(`${event.year}-${event.month}`)}
                    y={i * 20}
                    fill="white"
                    text-anchor="middle"
                >
                    {event.name}
                </text>
            {/each}
            {#each agt_processed as d}
                {#each d.count as item, i}
                <circle
                cx={xScale(`${d.year}-${d.month}`) + xScale.bandwidth() / 2}
                cy={innerHeight - 110 - i * 13}
                r={5}
                fill={item.agmt_id_PAX === "" ? "red" : "steelblue"}
                on:mouseover={(e) => showTooltip(e, item.agmt_name)}
                on:mouseleave={hideTooltip}
                on:focus={(e) => showTooltip(e, item.agmt_name)}
                role="img"
                aria-label={`Tooltip for ${item.agmt_name}`}
            />
                {/each}
            {/each}
        </g>
    </svg>
</div>

<style>
    .agreement_per_month {
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
    .legend {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 20px;
        font-family: Arial, sans-serif;
        align-self: flex-start;
        width: 100%;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        font-family: "Montserrat", sans-serif;
    }

    .color-box-2 {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        border: 1px solid black;
    }

    .steelblue {
        background-color: steelblue;
    }

    .red {
        background-color: red;
    }

    .tooltip {
        position: fixed;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 14px;
        pointer-events: none;
    }
</style>
