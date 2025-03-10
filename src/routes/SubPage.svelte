<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import { getCSV, getGeo, fillMissingMonths } from "../utils";
    import First from "./First.svelte";
    import Second from "./Second.svelte";
    import Third from "./Third.svelte";
    import Fourth from "./Fourth.svelte";
    import Fifth from "./Fifth.svelte";
    import Sixth from "./Sixth.svelte";
    import Seventh from "./Seventh.svelte";
    import Eight from "./Eight.svelte";
    import Nine from "./Nine.svelte";

    let manyBodyStrength = 2;
    let only_M = [];
    let nodeStrokeWidth = 1;
    let rKey = "value";
    let finalData = [];
    let country;
    let mena;
    let mediations;
    let actors;
    let neighbor;
    let ucdp;
    let processes = [];
    let countries = [];
    let mediations_only = [];
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
    let selectedYears = [2018, 2024];
    let categories = [
        "international",
        "regional",
        "neighbor",
        "mena",
        "other_state",
        "other",
    ];
    let actorLookup;
    let margin = { top: 20, right: 20, bottom: 20, left: 40 };
    let innerWidth = 800; // Outer width of the container
    let height = 500; // Outer height of the container
    let historical_events;

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

    // LOAD MEND
    let path = [
        "./data/mend_all_actors.csv",
        "./data/mena.csv",
        "./data/mend_march.csv",
        "./data/ucdp_all.csv",
        "./data/processes.csv",
        "./data/countries.csv",
    ];
    getCSV(path).then((glopad) => {
        actors = glopad[0];
        mena = glopad[1];
        let mend = glopad[2];
        ucdp = glopad[3];
        processes = glopad[4];
        countries = glopad[5];

        if (country === "Sudan") {
            mediations = mend.filter((d) => d.conflict_country === "Sudan");
            ucdp = ucdp.filter((d) => d.country === "Sudan");
            historical_events = [
                {
                    name: "Ouster of Omar al-Bashir",
                    year: "2019",
                    month: "4",
                },
                {
                    name: "Coup",
                    year: "2021",
                    month: "10",
                },
                {
                    name: "Civil War",
                    year: "2023",
                    month: "4",
                },
            ];
        } else if (country === "Libya") {
            mediations = mend.filter((d) => d.conflict_country === "Libya");
            ucdp = ucdp.filter((d) => d.country === "Libya");
            historical_events = []
        } else if (country === "Syria") {
            mediations = mend.filter((d) => d.conflict_country === "Syria");
            ucdp = ucdp.filter((d) => d.country === "Syria");
            historical_events = [
                {
                    name: "Reinstated in the Arab League",
                    year: "2023",
                    month: "7",
                },
                {
                    name: "Assad's Ouster",
                    year: "2024",
                    month: "12",
                },
            ];
        }
    });

    // once data is loaded, create subsets for each section
    $: if (
        country &&
        mediations?.length > 0 &&
        actors?.length > 0 &&
        mena?.length > 0 &&
        ucdp?.length > 0
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

        // Create a lookup map for faster access
        actorLookup = new Map(
            actors.map((actor) => [actor.GLOPAD_ID, actor.ActorName]),
        );

        // Replace mediatorIDs with corresponding ActorNames, keeping the ID if not found
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
            } else if (
                item.category === "Unknown" ||
                item.category === "Civil Society" ||
                item.category === "Other"
            ) {
                return { ...item, category: "other" };
            }

            return item;
        });

        // finalData = finalData.filter(item => item.id !== "NM" && item.name !== " NM");

        // FILTER TO 2023 and 2024
        const filteredData = mediations;
        // .filter(
        //     (d) => d.Year === "2023" || d.Year === "2024",
        // );

        // MEDIATION TYPES
        only_M = filteredData.filter((d) => d.med_type === "M");
        const only_MR = filteredData.filter((d) => d.med_type === "MR");

        mediations_only = only_M;

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
        let unknown_count = 0;

        const locationCounts = filteredData.reduce((acc, item) => {
            let location = item["med_location - MULTISELECT"]; // Use bracket notation for the field name
            let location2 = item["med_loc_x"];
            if (location != "") {
                if (location.includes("Virtual")) {
                    location = "Virtual";
                }
                acc[location] = (acc[location] || 0) + 1; // Count occurrences
            }
            if (
                (location2 === "" && location !== "Virtual") ||
                (location2 === null && location !== "Virtual") ||
                (location2 === " " && location !== "Virtual")
            ) {
                unknown_count += 1;
            }

            return acc;
        }, {});

        // locationCounts["Unknown"] = unknown_count;

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
            ucdp,
            (d) => d.year,
            (d) => d.month,
        );

        // // Ensure all months are present
        // const filled_ucdp_group_date = ucdp_group_date.map(([year, months]) => {
        //     // Convert months to a Map for quick lookup
        //     const monthMap = new Map(months);

        //     // Create an array with all 12 months
        //     const fullMonths = Array.from({ length: 12 }, (_, i) => {
        //         const month = (i + 1).toString(); // Convert 1-12 to string (if needed)
        //         return [month, monthMap.get(month) || []]; // Use existing data or empty array
        //     });

        //     return [year, fullMonths];
        // });

        // formatted ucdp data
        ucdp_group_date.forEach(([year, months]) => {
            months.forEach(([month, count]) => {
                let best_count = 0;

                count.forEach((c) => {
                    best_count += +c.best;
                });
                ucdp_final.push({ year, month, best_count });
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

        processedData = fillMissingMonths(processedData);

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

        top_ten_mediators = Object.entries(mediator_counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const updatedIdCounts = top_ten_mediators.map(([id, count]) => {
            const match = actors.find((actor) => actor.GLOPAD_ID === id);
            return [match ? match.ActorName : id, count];
        });

        top_ten_mediators = updatedIdCounts;
    }

    // SCALES
    $: x_circle = d3
        .scaleOrdinal()
        .domain(categories)
        .range(d3.range(0, innerWidthAdjusted, innerWidthAdjusted / 6));

    $: r_scale = d3
        .scaleLinear()
        .domain([0, d3.max(finalData, (d) => d.value)])
        .range([3, 60]);

    // MEDIATOR TYPES
    $: initialNodes = finalData.map((d) => ({ ...d }));
    $: simulation = d3.forceSimulation(initialNodes);
    $: nodes = [];
    $: {
        simulation.nodes(initialNodes);
        simulation
            .force("x", d3.forceX((d) => x_circle(d.category)).strength(0.3)) // Increase strength
            .force("y", d3.forceY(height / 2).strength(0.2)) // Add a Y-force to help centering
            .force("charge", d3.forceManyBody().strength(manyBodyStrength))
            .force(
                "collision",
                d3.forceCollide((d) => r_scale(d[rKey]) + nodeStrokeWidth / 2),
            )
            .alpha(1)
            .restart();
    }

    $: simulation.on("tick", () => {
        nodes = simulation.nodes();
    });

    // UCDP XScale
    $: ucdp_xScale = d3
        .scaleBand()
        .domain(processedData.map((d) => `${d.year}-${d.month}`))
        .range([0, innerWidthAdjusted - margin.right])
        .padding(0.1);

    $: ucdp_yScale = d3
        .scaleLinear()
        .domain([0, Math.max(...ucdp_final.map((d) => d.best_count))])
        .range([innerHeight, 0]);

    // X Scale
    $: xScale = d3
        .scaleBand()
        .domain(processedData.map((d) => `${d.year}-${d.month}`))
        .range([0, innerWidthAdjusted - margin.right])
        .padding(0.1);

    // Y Scale
    $: yScale = d3
        .scaleLinear()
        // .domain([0, Math.max(...processedData.map((d) => d.count.length))])
        .domain([0, 100])
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
        .y((d) => ucdp_yScale(d.best_count))
        .curve(d3.curveMonotoneX); // Smooth curve

    // Path Data
    $: pathData = line(ucdp_final);
</script>

<div class="wrapper" bind:clientWidth={width}>
    <div class="header">
        <h1 style="font-size: 50px;">{country + " 2018-2024"}</h1>
    </div>
    <!-- mediations per month -->
    <First
        {innerWidthAdjusted}
        {innerHeight}
        {width}
        {height}
        {margin}
        {xScale}
        {yScale}
        {ucdp_xScale}
        {ucdp_yScale}
        {historical_events}
        {processedData}
        {processedM}
        {pathData}
        {ucdp_final}
        {country}
    />
    <!-- unique actors -->
    <Second
        {width}
        {height}
        {innerHeight}
        {margin}
        {xScale}
        {yScale}
        {historical_events}
        {result}
        {country}
    />

    <!-- mediation locations -->
    <Third
        {mediations}
        {width}
        {height}
        {margin}
        {locationList}
        {horizontal_xScale}
        {horizontal_yScale}
    />

    <h1>Agreements</h1>

    <!-- agreements per month -->
    <Fourth
        {width}
        {height}
        {innerHeight}
        {margin}
        {historical_events}
        {xScale}
        {agt_processed}
    />

    <!-- list of agreements -->
    <Fifth {width} {agreements} />

    <h1>Mediation</h1>

    <!-- top mediators -->
    <Sixth
        {width}
        {height}
        {margin}
        {top_ten_mediators}
        {horizontal_xScale}
        {horizontal_yScale}
        {horizontal_mediator_yScale}
    />
    <!-- types of mediators -->
    <Seventh
        {width}
        {innerWidthAdjusted}
        {height}
        {nodes}
        {margin}
        {r_scale}
        {categories}
        {x_circle}
    />

    <!-- processes -->
    <h1>Processes</h1>
    <Eight {width} {processes} />

    <!-- mediation timeline -->
    <Nine
        {width}
        {height}
        {innerHeight}
        {innerWidthAdjusted}
        {margin}
        {mediator_counts}
        {mediations_only}
        {only_M}
        {actorLookup}
    />
</div>

<style>
    .wrapper {
        width: calc(100% - 100px); /* Ensures a margin of 50px on both sides */
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

    :global(.rangeSlider) {
        font-size: 14px;
    }

    :global(.pipVal) {
        color: white;
    }
</style>
