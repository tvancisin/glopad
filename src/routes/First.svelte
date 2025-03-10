<script>
    import * as d3 from "d3";

    export let innerWidthAdjusted;
    export let innerHeight;
    export let width;
    export let height;
    export let margin;
    export let xScale;
    export let yScale;
    export let ucdp_xScale;
    export let ucdp_yScale;
    export let historical_events;
    export let processedData;
    export let processedM;
    export let pathData;
    export let ucdp_final;
    export let country;

    let xAxisGroup;
    let yAxisGroup;
    let yUCDPAxisGroup;

    $: {
        if (xAxisGroup) {
            const tickValues = xScale.domain().filter((_, i) => i % 3 === 0); // Show every second tick
            const xAxis = d3
                .axisBottom(xScale)
                .tickValues(tickValues) // Manually set which ticks to show
                .tickFormat((d) => {
                    const [year, month] = d.split("-");
                    return `${month}/${year}`; // Format as "MM/YYYY"
                });

            d3.select(xAxisGroup).call(xAxis);
        }
        if (yAxisGroup) {
            const yAxis = d3.axisLeft(yScale);
            d3.select(yAxisGroup).call(yAxis);
        }
        if (yUCDPAxisGroup) {
            const maxCount = Math.max(...ucdp_final.map((d) => d.best_count));

            const yAxis = d3
                .axisRight(ucdp_yScale)
                .ticks(3) // Limits to 3 ticks
                .tickFormat(d3.format("d")); // Ensures whole numbers

            d3.select(yUCDPAxisGroup)
                .call(yAxis)
                .selectAll("text")
                .style("fill", "red");

            d3.select(yUCDPAxisGroup)
                .selectAll(".domain, line")
                .style("stroke", "red");
        }
    }
</script>

<!-- mediations per month -->
<div class="mediation_type" bind:clientWidth={width}>
    <h2>Mediation Events per Month</h2>
    <div class="legend">
        <div class="legend-item">
            <div class="color-box white"></div>
            <span>Mediation</span>
        </div>
        <div class="legend-item">
            <div class="color-box steelblue"></div>
            <span>Mediation-related</span>
        </div>
        <div class="legend-item">
            <div class="red-line"></div>
            <span>Battle-related deaths (UCDP)</span>
        </div>
    </div>

    <svg {width} {height}>
        <!-- Group containing the chart -->
        <g transform={`translate(${margin.left}, ${margin.top})`}>
            <!-- X-Axis -->
            <g
                bind:this={xAxisGroup}
                transform={`translate(0, ${innerHeight})`}
            />
            <g bind:this={yAxisGroup} transform={`translate(${0}, 0)`} />
            <g
                bind:this={yUCDPAxisGroup}
                transform={`translate(${innerWidthAdjusted - margin.right}, 0)`}
            />

            <!-- Bars for Processed Data -->
            {#each processedData as d}
                <rect
                    x={xScale(`${d.year}-${d.month}`)}
                    y={yScale(d.count.length)}
                    width={xScale.bandwidth()}
                    height={innerHeight - yScale(d.count.length)}
                    fill="steelblue"
                    rx="2"
                />
            {/each}

            <!-- Bars for Processed M -->
            {#each processedM as m}
                <rect
                    x={xScale(`${m.year}-${m.month}`)}
                    y={yScale(m.count.length)}
                    width={xScale.bandwidth()}
                    height={innerHeight - yScale(m.count.length)}
                    fill="white"
                    rx="2"
                />
            {/each}

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
                >
                    {event.name}
                </text>
            {/each}

            <!-- Line Path -->
            <path d={pathData} fill="none" stroke="red" stroke-width="2" />

            <!-- Data Points -->
            {#each ucdp_final as d}
                <circle
                    cx={ucdp_xScale(`${d.year}-${d.month}`) +
                        ucdp_xScale.bandwidth() / 2}
                    cy={ucdp_yScale(d.best_count)}
                    r="3"
                    fill="red"
                    stroke="black"
                />
            {/each}
        </g>
    </svg>
    <div class="mediation_type_text">
        <p class="text">
            <strong>Mediation events</strong>: non-coercive facilitation of
            communication or negotiation between disputing parties to help them
            reach a mutually acceptable agreement or resolution to their
            conflict by an external third-party. Mediation always involves at
            least two (local) conflict stakeholders, at least one of them
            needing to be a belligerent. <br /><br />

            <strong style="color: steelblue;">Mediation-related events</strong>:
            non-coercive measures to facilitate the mediation. These measures
            are aimed at (1) encouraging a conflict party or parties to come
            to/continue with the negotiation; (2) expanding the range of actors
            directly or indirectly included in the mediation; (3) coordinating
            among third-parties; (4) monitoring and advising on implementation
            as part of formal follow-up mechanisms.<br /><br />

            <strong style="color: red;"
                >Best estimate of battle-related deaths</strong
            >: the most reliable assessment of fatalities resulting directly
            from combat between armed actors. Source:
            <a
                target="_blank"
                href="https://ucdp.uu.se/downloads/index.html#ged_global"
                >Uppsala Conflict Data Program (UCDP)</a
            >
        </p>
    </div>
</div>

<style>
    .mediation_type {
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

    .legend {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 20px;
        font-family: Arial, sans-serif;
        align-self: flex-start; /* Aligns to the left */
        width: 100%; /* Optional: Ensures it spans the container */
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        font-family: "Montserrat", sans-serif;
    }

    .color-box {
        width: 20px;
        height: 20px;
        border: 1px solid black;
        border-radius: 2px;
    }

    .steelblue {
        background-color: steelblue;
    }
    .white {
        background-color: white;
    }

    .red-line {
        width: 20px;
        height: 2px;
        background-color: red;
    }

    .text {
        max-width: 800px; /* Optional: Restricts text width for better readability */
        margin: 20px auto;
        padding: 10px;
        line-height: 1.2;
        font-weight: 300;
        text-align: left; /* Ensures text is evenly aligned */
    }
</style>
