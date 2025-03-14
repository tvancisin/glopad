<script>
    import * as d3 from "d3";

    export let width;
    export let height;
    export let innerHeight;
    export let margin;
    export let xScale;
    export let historical_events;
    export let result;

    let xAxisGroup;

    $: yScale = d3
        .scaleLinear()
        .domain([0, 10 + Math.max(...result.map((d) => d.count))])
        // .domain([0, 100])
        .range([innerHeight, 0]);

    $: {
        if (xAxisGroup) {
            const tickValues = xScale.domain().filter((_, i) => i % 3 === 0); // Show every second tick
            const xAxis = d3
                .axisBottom(xScale)
                .tickValues(tickValues) // Manually set which ticks to show
                .tickFormat((d) => {
                    const [year, month] = d.split("-");
                    return `${month}/${year}`; // Format ticks as "MM/YYYY"
                });
            d3.select(xAxisGroup).call(xAxis);
        }
    }
</script>

<!-- unique actors -->
<div class="unique_actors" bind:clientWidth={width}>
    <h2>Unique Third-Party Actors per Month</h2>
    <svg {width} {height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
            <g
                bind:this={xAxisGroup}
                transform={`translate(0, ${innerHeight})`}
            />
            {#each historical_events as event, i}
                <line
                    x1={xScale(`${event.year}-${event.month}`)}
                    y1={10 + i * 20}
                    x2={xScale(`${event.year}-${event.month}`)}
                    y2={innerHeight}
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
            {#each result as d}
                <rect
                    x={xScale(`${d.year}-${d.month}`)}
                    y={yScale(d.count)}
                    width={xScale.bandwidth()}
                    height={innerHeight - yScale(d.count)}
                    fill="steelblue"
                    rx="2"
                />
                <text
                    x={xScale(`${d.year}-${d.month}`) + xScale.bandwidth() / 2}
                    y={yScale(d.count) - 10}
                    dy=".35em"
                    font-size="10"
                    text-anchor="middle"
                    fill="white"
                >
                    {d.count}</text
                >
            {/each}
        </g>
    </svg>
</div>

<style>
    .unique_actors {
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
