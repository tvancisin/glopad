<script>
    import RangeSlider from "svelte-range-slider-pips";

    export let width;
    export let agreements;

    let selectedYearsAgt = [2018, 2024];
    let minYear = 2018;
    let maxYear = 2024;

    $: filteredAgreements = agreements.filter((d) => {
        const year = +d.Year;
        return year >= selectedYearsAgt[0] && year <= selectedYearsAgt[1];
    });

</script>

<!-- peace agreements -->
<div class="agreement_list" bind:clientWidth={width}>
    <h2>List of Agreements</h2>
    <div class="slider-container">
        <RangeSlider
            bind:values={selectedYearsAgt}
            min={minYear}
            max={maxYear}
            step={1}
            pips
            range
            all="label"
        />
    </div>
    <div class="table">
        <!-- Header -->
        <div class="table_header">Date</div>
        <div class="table_header">Name</div>
        <div class="table_header">Third-Party Actors</div>
        <div class="table_header">Grouping/Mechanism</div>

        <!-- Rows -->
        {#each filteredAgreements as row}
            <div>{row.Day + "/" + row.Month + "/" + row.Year}</div>
            <div
                style="display: flex; justify-content: space-between; align-items: center;"
            >
                <span style="text-align: left;">{row.agmt_name}</span>
                {#if row.agmt_id_PAX !== ""}
                    <a style="margin-left: auto;"
                        href={`https://pax.peaceagreements.org/agreements/${row.agmt_id_PAX}`}
                        target="_blank"
                    >
                        <img
                            src="pax.jpg"
                            style="height: 30px; margin-left: auto;"
                        />
                    </a>
                {:else}
                    <img
                        src="new.png"
                        style="height: 30px; margin-left: auto;"
                    />
                {/if}
            </div>
            <div>{row.third_party}</div>
            <div>{row.groupings_mechanisms}</div>
        {/each}
    </div>
</div>

<style>
    .slider-container {
        width: 90%;
        margin: 10px auto;
    }
    .agreement_list {
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

    .table {
        display: grid;
        grid-template-columns: 0.5fr 2fr 1fr 1fr; /* Adjust columns as needed */
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
