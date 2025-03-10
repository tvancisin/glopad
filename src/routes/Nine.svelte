<script>
    import * as d3 from "d3";
    import RangeSlider from "svelte-range-slider-pips";
    import Select from "svelte-select";
    import filter from "svelte-select/filter";

    export let width;
    export let height;
    export let innerHeight;
    export let innerWidthAdjusted;
    export let margin;
    export let mediations_only;
    export let mediator_counts;
    export let only_M;
    export let actorLookup;

    let minYear = 2018;
    let maxYear = 2024;
    let selectedYears = [2018, 2024];
    let yMedAxisGroup;

    // MEDIATION TIMELINE
    $: years = [...new Set(mediations_only.map((d) => d.Year))]; // Extract unique years
    $: allYearMonthPairs = years.flatMap((year) =>
        Array.from({ length: 12 }, (_, i) => `${year}-${i + 1}`),
    );
    $: uniqueYears = [...new Set(mediations_only.map((d) => d.Year))];

    $: xMed = d3
        .scaleBand()
        .domain(allYearMonthPairs) // Ensure all Year-Month pairs are included
        .range([margin.left, innerWidthAdjusted - margin.right])
        .padding(0.1); // Adjust padding if needed

    // $: yMed = d3
    //     .scaleBand()
    //     .domain(Object.keys(mediator_counts)) // Extracts keys as an array
    //     .range([innerHeight, 0]);

    $: yMed = d3
        .scaleBand()
        .domain(Object.keys(mediator_counts)) // Extracts keys as an array
        .range([innerHeight, 0]);

    $: {
        if (actorLookup instanceof Map && yMedAxisGroup) {
            // Only create axis after actorLookup is fully initialized
            const yAxis = d3
                .axisLeft(yMed)
                .tickSize(-innerWidthAdjusted + margin.right * 3)
                .tickFormat((d) => {
                    const countryName = actorLookup.get(d);
                    console.log("Actor Lookup for", d, ":", countryName);
                    return countryName || d; // Fallback to the ID if no country is found
                });

            // Call the y-axis with the formatted tick labels
            d3.select(yMedAxisGroup)
                .call(yAxis)
                .selectAll(".tick line")
                .attr("stroke", "#333333")
                .attr("stroke-dasharray", "5,3");

            d3.select(yMedAxisGroup)
                .selectAll(".tick text")
                .attr("font-size", "8")
                .attr("fill", "gray");

            d3.select(yMedAxisGroup).select(".domain").style("display", "none");
        }
    }

    $: grouping_array_first = Array.from(
        new Set(
            mediations_only.flatMap((d) =>
                d.groupings_mechanisms
                    ? d.groupings_mechanisms
                          .toLowerCase()
                          .split(";")
                          .map((g) => g.trim().replace(/\s+/g, ""))
                          .filter((g) => g !== "")
                    : [],
            ),
        ),
    );
    $: grouping_array_initial = ["nogrouping", ...grouping_array_first];

    // Transform to the desired format
    $: grouping_array = grouping_array_initial.map((group) => ({
        value: group,
        label:
            group.charAt(0).toUpperCase() +
            group.slice(1).replace(/([a-z])([A-Z])/g, "$1 $2"),
    }));

    function filterByYear(startYear, endYear) {
        mediations_only = only_M;
        let filtered = mediations_only.filter((d) => {
            const year = +d.Year;
            return year >= startYear && year <= endYear;
        });
        mediations_only = [...filtered];
    }

    $: if (selectedYears) {
        filterByYear(selectedYears[0], selectedYears[1]);
    }

    let colorOptions = ["yellow", "red", "blue"];

    // Function to assign colors based on selection order
    function getColor(grouping) {
        if (!grouping) return "steelblue"; // Default color for non-selected items
        let index = selectedGroupings.findIndex(
            (g) => g.value.toLowerCase() === grouping.toLowerCase(),
        );
        return index >= 0
            ? colorOptions[index % colorOptions.length]
            : "steelblue";
    }
    let filterText = ""; // For searching/filtering items
    let selectedGroupings = []; // To store selected items

    // Handle the addition of a new value (when not found in the list)
    function handleFilter(e) {
        if (selectedGroupings?.find((i) => i.label === filterText)) return; // Prevent adding duplicates
        if (e.detail.length === 0 && filterText.length > 0) {
            // Add a new item if the filter text is not in the items list
            grouping_array = [
                ...grouping_array,
                { value: filterText, label: filterText },
            ];
        }
    }

    // Handle change when items are selected/deselected
    function handleChange(e) {
        // group= .map((i) => {
        //     delete i.created;
        //     return i;
        // });
    }
</script>

<!-- actors and mediations over time -->
<div class="actor_types">
    <h2>Mediation Timeline</h2>
    <!-- Slider UI -->
    <div class="slider-container">
        <RangeSlider
            bind:values={selectedYears}
            min={minYear}
            max={maxYear}
            step={1}
            pips
            range
            all="label"
        />
    </div>
    <!-- Dropdown List -->
    <div class="select_group">
        <Select
            --border-radius="3px"
            --placeholder-color="white"
            --background="#003645"
            --list-background="#003645"
            --border="none"
            --multi-item-color="black"
            --item-hover-bg="gray"
            on:change={handleChange}
            multiple
            bind:value={selectedGroupings}
            items={grouping_array}
            itemId="value"
            label="label"
            on:filter={handleFilter}
            bind:filterText
        >
            <div style="text-align: left;" slot="item" let:item>
                {item.label}
            </div>
        </Select>
    </div>

    <svg {width} {height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
            <g
                bind:this={yMedAxisGroup}
                transform={`translate(${margin.left}, 0)`}
            />
            {#each uniqueYears as year}
                <line
                    x1={xMed(`${year}-1`)}
                    x2={xMed(`${year}-1`)}
                    y1={0}
                    y2={innerHeight}
                    stroke="white"
                    stroke-width="1"
                    opacity="0.3"
                />
                <g transform={`rotate(-30, ${xMed(`${year}-1`)}, 0)`}>
                    <text
                        x={xMed(`${year}-1`)}
                        y={0}
                        text-anchor="start"
                        font-size="12px"
                        fill="white"
                    >
                        {year}
                    </text>
                </g>
            {/each}
            {#each mediations_only as d, i}
                {#each d.third_party_id_GLOPAD
                    .split(";")
                    .filter((m) => m.trim() !== "") as mediator}
                    <rect
                        x={xMed(`${d.Year}-${d.Month}`)}
                        y={yMed(mediator)}
                        width={xMed.bandwidth()}
                        height={5}
                        fill-opacity="0.35"
                        fill={(() => {
                            const groupClasses = d.groupings_mechanisms
                                .toLowerCase()
                                .split(";")
                                .map(
                                    (g) =>
                                        g.trim().replace(/\s+/g, "") ||
                                        "nogrouping",
                                );

                            if (Array.isArray(selectedGroupings)) {
                                let selectedGroup = selectedGroupings.find(
                                    (group) =>
                                        groupClasses.includes(
                                            group.value.toLowerCase(),
                                        ),
                                );
                                return selectedGroup
                                    ? getColor(selectedGroup.value)
                                    : "white";
                            }
                            return "white";
                        })()}
                        stroke="none"
                    />
                {/each}
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
        padding: 20px; /* Add padding for better visuals */
        box-sizing: border-box;
        border-radius: 10px; /* Optional: Gives rounded corners */
    }

    .slider-container,
    .select_group {
        width: 90%;
        margin: 10px auto;
    }
</style>
