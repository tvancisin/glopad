<script>
    import { randomWeibull } from "d3";

    export let width;
    export let fil_processes;
    export let country;
    

$: console.log(fil_processes);

</script>

<div class="agreement_list" bind:clientWidth={width}>
    <h2>Key Processes</h2>
    <div class="table">
        <div class="table_header">Date</div>
        <div class="table_header">Name</div>
        <div class="table_header">Third-Party Actors</div>
        <div class="table_header">Core Local Actors</div>
        {#if country == "Sudan"}
            {#each fil_processes as row}
                <div>
                    {row.Start_mth}/{row.Start_y} -
                    {row.End_y
                        ? (row.End_mth ? row.End_mth + "/" : "") + row.End_y
                        : "Present"}
                </div>
                <div>{row.process}</div>
                <div>{row.third_parties}</div>
                <div>{row.local}</div>
            {/each}
        {/if}
        {#if country == "Syria"}
            {#each fil_processes as row}
                <div>
                    {row.start_month}/{row.start_year} -
                    {row.end_year
                        ? (row.end_month? row.end_month+ "/" : "") + row.end_year
                        : "Present"}
                </div>
                <div>{row.groupings_mechanisms}</div>
                <div>{row.third_party}</div>
                <div>{row.local_parties}</div>
            {/each}
        {/if}
    </div>
</div>

<style>
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
        padding: 20px; /* Add padding for better visuals */
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
