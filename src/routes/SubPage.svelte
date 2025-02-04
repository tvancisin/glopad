<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import { getCSV, getGeo } from "../utils";
    import Heatmap from "../lib/Heatmap.svelte";

    let manyBodyStrength = 2;
    let xStrength = 0.1;
    let nodeStrokeWidth = 1;
    let xKey = "category";
    let rKey = "value";
    let finalData = [];
    let country;
    let mena;
    let mediations;
    let actors;
    let neighbor;
    let sudan_ucdp;
    let processedData = [];
    let ucdp_final = [];
    let processedM = [];
    let result = [];
    let agreements = [];
    let agreements_per_year = [];
    let agt_processed = [];
    let mediators = [];
    let mediator_counts = [];
    let top_ten_mediators = [];
    let locationList = [];
    let categories = [
        "international",
        "regional",
        "neighbor",
        "mena",
        "other_state",
        "other",
    ];
    let margin = { top: 20, right: 20, bottom: 20, left: 40 };
    let innerWidth = 800; // Outer width of the container
    let height = 400; // Outer height of the container

    // Calculate dimensions reactively
    $: width = innerWidth; // Reactively bound to `clientWidth` for responsiveness
    $: innerHeight = height - margin.top - margin.bottom;
    $: innerWidthAdjusted = width - margin.left - margin.right;

    // get the country name from the URL
    onMount(() => {
        const match = window.location.pathname.match(/\/glopad\/([^/]+)/);
        country = match ? match[1] : null;
    });

    // load neighbors
    const json_path = "/data/neighbors.json";
    getGeo(json_path).then((data) => {
        let neighbors = data;
        neighbor = neighbors.filter((c) => c.conflict_country === country)[0]
            .borders;
    });

    // load mend data
    let path = [
        "./data/actors.csv",
        "./data/mena.csv",
        "./data/mend.csv",
        "./data/ucdp_sudan.csv",
    ];
    getCSV(path).then((glopad) => {
        actors = glopad[0];
        mena = glopad[1];
        let mend = glopad[2];
        sudan_ucdp = glopad[3];

        if (country === "Sudan") {
            mediations = mend.filter((d) => d.conflict_country === "Sudan");
        } else if (country === "Libya") {
            mediations = mend.filter((d) => d.conflict_country === "Libya");
        } else if (country === "Syria") {
            mediations = mend.filter((d) => d.conflict_country === "Syria");
        }
    });

    // once data is loaded, create subsets for each section
    $: if (
        country &&
        mediations?.length > 0 &&
        actors?.length > 0 &&
        mena?.length > 0 &&
        sudan_ucdp?.length > 0
    ) {
        //// ACTOR TYPES
        const thirdPartyCounts = {};

        // Iterate through the array
        mediations.forEach((entry) => {
            // Split IDs if multiple exist
            const ids = entry.third_party_id_GLOPAD.split(";");
            ids.forEach((id) => {
                thirdPartyCounts[id] = (thirdPartyCounts[id] || 0) + 1;
            });
        });

        // Convert the result into the required format
        let resultz = Object.entries(thirdPartyCounts).map(([id, value]) => ({
            id,
            value,
        }));

        const updatedIdValues = resultz.map((item) => {
            const match = actors.find((actor) => actor.GLOPAD_ID === item.id);
            return { ...item, name: match ? match.ActorName : item.id };
        });

        resultz = updatedIdValues;

        // Create a lookup table from actors
        const categoryLookup = actors.reduce((acc, actor) => {
            acc[actor.GLOPAD_ID] =
                actor.actor_classification_glopad || "Unknown";
            return acc;
        }, {});

        // Map over the data array and add the category field
        const resultWithCategory = resultz.map((entry) => ({
            ...entry,
            category: categoryLookup[entry.id] || "Unknown",
        }));

        // Convert data2 into a Set for quick lookup
        const neighborIds = new Set(neighbor.map((item) => item.id));

        // Update data1 based on conditions
        const updatedData1 = resultWithCategory.map((item) => {
            if (item.category === "Country/State" && neighborIds.has(item.id)) {
                return { ...item, category: "neighbor" };
            }
            return item;
        });

        // Create a Set of MENA region IDs for quick lookup
        const menaIds = new Set(mena.map((item) => item.id_paax));

        // Update data1 based on conditions
        const updatedData2 = updatedData1.map((item) => {
            if (item.category === "Country/State") {
                return {
                    ...item,
                    category: menaIds.has(item.id) ? "mena" : "other_state",
                };
            }
            return item;
        });

        finalData = updatedData2.map((item) => {
            if (item.category === "International IGO") {
                return { ...item, category: "international" };
            } else if (item.category === "Regional IGO") {
                return { ...item, category: "regional" };
            } else if (item.category === "Unknown") {
                return { ...item, category: "other" };
            }

            return item;
        });

        // FILTER TO 2023 and 2024
        const filteredData = mediations.filter(
            (d) => d.Year === "2023" || d.Year === "2024",
        );

        // MEDIATION TYPES
        const only_M = filteredData.filter((d) => d.med_type === "M");
        console.log(only_M);
        
        const only_MR = filteredData.filter((d) => d.med_type === "MR");

        // AGREEMENTS
        agreements = filteredData.filter((d) => d.agmt === "1");
        agreements_per_year = d3.groups(
            agreements,
            (d) => d.Year,
            (d) => d.Month,
        );
        agreements_per_year.forEach(([year, months]) => {
            months.forEach(([month, count]) => {
                agt_processed.push({ year, month, count });
            });
            agt_processed = [...agt_processed]; // Ensure reactivity
        });

        // TOP MEDIAITON LOCATIONS
        const locationCounts = filteredData.reduce((acc, item) => {
            const location = item["med_location - MULTISELECT"]; // Use bracket notation for the field name
            acc[location] = (acc[location] || 0) + 1; // Count occurrences
            return acc;
        }, {});

        locationList = Object.entries(locationCounts)
            .map(([location, count]) => ({ location, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        locationList = locationList.map((item) => ({
            ...item,
            location: item.location === "" ? "Unknown/Virtual" : item.location,
        }));

        // UCDP PER MONTH
        const ucdp_group_date = d3.groups(
            sudan_ucdp,
            (d) => d.year,
            (d) => d.month,
        );

        // Ensure all months are present
        const filled_ucdp_group_date = ucdp_group_date.map(([year, months]) => {
            // Convert months to a Map for quick lookup
            const monthMap = new Map(months);

            // Create an array with all 12 months
            const fullMonths = Array.from({ length: 12 }, (_, i) => {
                const month = (i + 1).toString(); // Convert 1-12 to string (if needed)
                return [month, monthMap.get(month) || []]; // Use existing data or empty array
            });

            return [year, fullMonths];
        });

        // formatted ucdp data
        filled_ucdp_group_date.forEach(([year, months]) => {
            months.forEach(([month, count]) => {
                ucdp_final.push({ year, month, count });
            });
            ucdp_final = [...ucdp_final]; // Ensure reactivity
        });

        // MEDIATIONS PER MONTH
        const groupedData = d3.groups(
            filteredData,
            (d) => d.Year,
            (d) => d.Month,
        );

        groupedData.forEach(([year, months]) => {
            months.forEach(([month, count]) => {
                processedData.push({ year, month, count });
            });
            processedData = [...processedData]; // Ensure reactivity
        });

        // only M
        const only_m_grouped = d3.groups(
            only_M,
            (d) => d.Year,
            (d) => d.Month,
        );

        only_m_grouped.forEach(([year, months]) => {
            months.forEach(([month, count]) => {
                processedM.push({ year, month, count });
            });
            processedM = [...processedM]; // Ensure reactivity
        });

        // UNIQUE ACTORS PER MONTH
        result = processedData.map((item) => {
            // Extract all third_party_id_GLOPAD values for the current month
            const allIds = item.count.flatMap((entry) =>
                entry.third_party_id_GLOPAD
                    ? entry.third_party_id_GLOPAD
                          .split(";")
                          .map((id) => id.trim())
                    : [],
            );

            // Remove duplicates
            const uniqueIds = [...new Set(allIds)];

            // Return the transformed object with the count of unique IDs
            return {
                year: item.year,
                month: item.month,
                count: uniqueIds.length, // Replace the count array with the number of unique IDs
            };
        });

        // MEDIATORS
        let test = [];
        only_M.forEach((item) => {
            const mediators = item.third_party_id_GLOPAD.split(";");
            mediators.forEach((mediator) => {
                test.push(mediator);
            });
        });

        mediators = [...test];
        // Count mediators
        mediator_counts = mediators.reduce((acc, value) => {
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});
        console.log(mediator_counts);
        
        top_ten_mediators = Object.entries(mediator_counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const updatedIdCounts = top_ten_mediators.map(([id, count]) => {
            const match = actors.find((actor) => actor.GLOPAD_ID === id);
            return [match ? match.ActorName : id, count];
        });

        top_ten_mediators = updatedIdCounts;
    }

    $: initialNodes = finalData.map((d) => ({ ...d }));
    $: simulation = d3.forceSimulation(initialNodes);
    $: nodes = [];

    $: simulation.on("tick", () => {
        nodes = simulation.nodes();
    });

    $: x_circle = d3
        .scaleOrdinal()
        .domain(categories)
        .range(d3.range(0, innerWidthAdjusted, innerWidthAdjusted / 6));

    $: r_scale = d3
        .scaleLinear()
        .domain([0, d3.max(finalData, (d) => d.value)])
        .range([3, 60]);

    $: {
        simulation
            .force(
                "x",
                d3
                    .forceX()
                    .x((d) => {
                        return x_circle(d["category"]);
                    })
                    .strength(0.2),
            )
            .force(
                "center",
                d3
                    .forceCenter()
                    .x(innerWidthAdjusted / 2)
                    .y(height / 2),
            ) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(manyBodyStrength))
            .force(
                "collision",
                d3.forceCollide().radius((d) => {
                    return r_scale(d[rKey]) + nodeStrokeWidth / 2; // Divide this by two because an svg stroke is drawn halfway out
                }),
            )
            .alpha(1)
            .restart();
    }

    // UCDP XScale
    $: ucdp_xScale = d3
        .scaleBand()
        .domain(ucdp_final.map((d) => `${d.year}-${d.month}`))
        .range([0, innerWidthAdjusted])
        .padding(0.1);

    $: ucdp_yScale = d3
        .scaleLinear()
        .domain([0, Math.max(...ucdp_final.map((d) => d.count.length))])
        .range([innerHeight, 0]);

    // X Scale
    $: xScale = d3
        .scaleBand()
        .domain(processedData.map((d) => `${d.year}-${d.month}`))
        .range([0, innerWidthAdjusted])
        .padding(0.1);

    // Y Scale
    $: yScale = d3
        .scaleLinear()
        .domain([0, Math.max(...processedData.map((d) => d.count.length))])
        .range([innerHeight, 0]);

    // Scales Horizontal
    $: horizontal_xScale = d3
        .scaleLinear()
        .domain([0, Math.max(...locationList.map((d) => d.count))])
        .range([0, width / 2 - margin.left - margin.right]);

    $: horizontal_yScale = d3
        .scaleBand()
        .domain(locationList.map((d) => d.location))
        .range([0, innerHeight])
        .padding(0.1);

    $: horizontal_mediator_yScale = d3
        .scaleBand()
        .domain(top_ten_mediators.map((d) => d[0]))
        .range([0, innerHeight])
        .padding(0.1);

    // Line Generator
    $: line = d3
        .line()
        .x(
            (d) =>
                ucdp_xScale(`${d.year}-${d.month}`) +
                ucdp_xScale.bandwidth() / 2,
        )
        .y((d) => ucdp_yScale(d.count.length))
        .curve(d3.curveMonotoneX); // Smooth curve

    // Path Data
    $: pathData = line(ucdp_final);

    // Axis
    let xAxisGroup;
    let yAxisGroup;
    let xAxisGroup1;
    let xAxisGroup2;
    $: {
        if (xAxisGroup) {
            const xAxis = d3.axisBottom(xScale).tickFormat((d) => {
                const [year, month] = d.split("-");
                return `${month}/${year}`; // Format ticks as "MM/YYYY"
            });
            d3.select(xAxisGroup).call(xAxis);
        }
        if (yAxisGroup) {
            const yAxis = d3.axisLeft(yScale);
            d3.select(yAxisGroup).call(yAxis);
        }
    }
    $: {
        if (xAxisGroup1) {
            const xAxis1 = d3.axisBottom(xScale).tickFormat((d) => {
                const [year, month] = d.split("-");
                return `${month}/${year}`; // Format ticks as "MM/YYYY"
            });
            d3.select(xAxisGroup1).call(xAxis1);
        }
    }
    $: {
        if (xAxisGroup2) {
            const xAxis2 = d3.axisBottom(xScale).tickFormat((d) => {
                const [year, month] = d.split("-");
                return `${month}/${year}`; // Format ticks as "MM/YYYY"
            });
            d3.select(xAxisGroup2).call(xAxis2);
        }
    }
</script>

<div class="wrapper">
    <div class="header">
        <h1 style="font-size: 50px;">{country + " 2023-2024"}</h1>
    </div>

    <!-- mediations per month -->
    <div class="mediation_type" bind:clientWidth={width}>
        <h2>Mediation Events per Month</h2>
        <svg {width} {height}>
            <!-- Group containing the chart -->
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                <!-- X-Axis -->
                <g
                    bind:this={xAxisGroup}
                    transform={`translate(0, ${innerHeight})`}
                />
                <g bind:this={yAxisGroup} transform={`translate(${0}, 0)`} />

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

                <!-- Line Path -->
                <path
                    d={pathData}
                    fill="none"
                    stroke="#b3b3b3"
                    stroke-width="1.5"
                />

                <!-- Data Points -->
                {#each ucdp_final as d}
                    <circle
                        cx={ucdp_xScale(`${d.year}-${d.month}`) +
                            ucdp_xScale.bandwidth() / 2}
                        cy={ucdp_yScale(d.count.length)}
                        r="4"
                        fill="red"
                    />
                {/each}
            </g>
        </svg>
        <div class="mediation_type_text">
            <p class="text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </div>
    </div>

    <!-- unique actors -->
    <div class="unique_actors" bind:clientWidth={width}>
        <h2>Unique Actors per Month</h2>
        <svg {width} {height}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                <g
                    bind:this={xAxisGroup1}
                    transform={`translate(0, ${innerHeight})`}
                />
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
                        x={xScale(`${d.year}-${d.month}`) +
                            xScale.bandwidth() / 2}
                        y={yScale(d.count) - 10}
                        dy=".35em"
                        font-size="12"
                        text-anchor="middle"
                        fill="white"
                    >
                        {d.count}</text
                    >
                {/each}
            </g>
        </svg>
        <div class="unique_actors_text">
            <p class="text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </div>
    </div>

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
                {/each}
                {#each locationList as { location, count }}
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
        <div class="mediation_text">
            <p class="text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </div>
    </div>

    <h1>Agreements</h1>

    <!-- peace agreements -->
    <div class="agreement_list" bind:clientWidth={width}>
        <h2>Agreements (2023-2024)</h2>
        <div class="table">
            <!-- Header -->
            <div class="table_header">Name</div>
            <!-- <div class="table_header">PA-X</div> -->
            <div class="table_header">Third-Party Actors</div>
            <div class="table_header">Grouping/Mechanism</div>

            <!-- Rows -->
            {#each agreements as row}
                <div
                    style="display: flex; justify-content: space-between; align-items: center;"
                >
                    <span style="text-align: left;">{row.agmt_name}</span>
                    <img
                        src={row.agmt_id_PAX === "" ? "new.png" : "pax.jpg"}
                        style="height: 30px; margin-left: auto;"
                    />
                </div>
                <div>{row.third_party}</div>
                <div>{row.groupings_mechanisms}</div>
            {/each}
        </div>
        <!-- {#each locationList as { location, count }}
            <p style="font-size: {count}px;">{location} : {count}</p>
        {/each} -->
        <div class="agreement_text">
            <p class="text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </div>
    </div>

    <!-- agreements per month -->
    <div class="agreement_per_month" bind:clientWidth={width}>
        <h2>Agreements per Month</h2>
        <svg {width} {height}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                <g
                    bind:this={xAxisGroup2}
                    transform={`translate(0, ${innerHeight})`}
                />
                {#each agt_processed as d}
                    {#each d.count as _, i}
                        <circle
                            cx={xScale(`${d.year}-${d.month}`) +
                                xScale.bandwidth() / 2}
                            cy={innerHeight - 15 - i * 20}
                            r={8}
                            fill="steelblue"
                        />
                    {/each}
                {/each}
            </g>
        </svg>
        <div class="agreement_text">
            <p class="text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </div>
    </div>

    <h1>Mediation</h1>

    <!-- top mediators -->
    <div class="mediators" bind:clientWidth={width}>
        <h2>Top Mediators</h2>
        <svg {width} {height}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                {#each top_ten_mediators as mediator}
                    <rect
                        x={0}
                        y={horizontal_mediator_yScale(mediator[0])}
                        width={horizontal_xScale(mediator[1])}
                        height={horizontal_yScale.bandwidth()}
                        fill="steelblue"
                    />
                    <text
                        x={horizontal_xScale(mediator[1]) - 20}
                        y={horizontal_mediator_yScale(mediator[0]) +
                            horizontal_yScale.bandwidth() / 2}
                        dy=".35em"
                        font-size="12"
                        text-anchor="start"
                        fill="white"
                    >
                        {mediator[1]}
                    </text>
                    <text
                        x={horizontal_xScale(mediator[1]) + 10}
                        y={horizontal_mediator_yScale(mediator[0]) +
                            horizontal_yScale.bandwidth() / 2}
                        dy=".35em"
                        font-size="12"
                        text-anchor="start"
                        fill="white"
                    >
                        {mediator[0]}
                    </text>
                {/each}
            </g>
        </svg>
        <div class="mediation_text">
            <p class="text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </div>
    </div>

    <!-- text circle packing -->
    <div class="actor_types" bind:clientWidth={width}>
        <h2>Actor Types</h2>
        <svg {width} {height}>
            <g
                transform={`translate(${innerWidthAdjusted / 10}, ${margin.top})`}
            >
                {#each nodes as point}
                    <circle
                        class="node"
                        r={r_scale(point[rKey])}
                        fill="steelblue"
                        cx={point.x}
                        cy={point.y}
                    >
                    </circle>
                    {#if point.value > 10}
                        <text
                            x={point.x}
                            y={point.y}
                            dy=".35em"
                            font-size="12"
                            text-anchor="middle"
                            fill="white"
                        >
                            {point.name}
                        </text>
                    {/if}
                {/each}
                {#each categories as category}
                    <text
                        x={x_circle(category)}
                        y={height - 30}
                        dy=".35em"
                        font-size="12"
                        text-anchor="start"
                        fill="white">{category}</text
                    >
                {/each}
            </g>
        </svg>
        <div class="mediation_text">
            <p class="text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </div>
    </div>
</div>

<style>
    .wrapper {
        width: 100%;
        box-sizing: border-box; /* Ensures padding and borders are included in the width */
        text-align: center;
        margin: 0 auto;
    }

    h1 {
        padding-top: 30px;
        padding-bottom: 30px;
    }

    .header {
        max-width: calc(
            100% - 100px
        ); /* Ensures a margin of 50px on both sides */
        margin: 0 auto;
        text-align: center;
    }

    .mediation_type,
    .unique_actors,
    .mediation_location,
    .agreement_list,
    .agreement_per_month,
    .mediators,
    .actor_types {
        max-width: calc(
            100% - 100px
        ); /* Ensures a margin of 50px on both sides */
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

    .text {
        max-width: 800px; /* Optional: Restricts text width for better readability */
        margin: 20px auto;
        padding: 10px;
        line-height: 1.6;
        text-align: justify; /* Ensures text is evenly aligned */
    }

    .table {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr; /* Adjust columns as needed */
        border: 1px solid #595959;
    }
    .table div {
        padding: 8px;
        border: 1px solid #605f5f;
        text-align: left;
        word-break: break-word; /* Break long words */
        overflow-wrap: anywhere; /* Allow breaking at any point */
        white-space: normal; /* Allow wrapping */
    }

    /* Optional: Explicitly tell it to break on semicolons */
    .table div {
        word-break: break-word;
    }

    .table div::before {
        content: "\200B"; /* Insert a zero-width space before */
    }

    .table_header {
        font-weight: bold;
        background-color: #424242;
    }
</style>
