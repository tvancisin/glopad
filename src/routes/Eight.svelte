<script>
    export let width;
    export let fil_processes;
</script>

<div class="agreement_list" bind:clientWidth={width}>
    <h2>Key Processes</h2>
    <div class="table">
        <div class="table_header">Date</div>
        <div class="table_header">Name</div>
        <div class="table_header">Third-Party Actors</div>
        <div class="table_header">Local Actors</div>
        {#each fil_processes as row}
            <div>
                {row.start_month}/{row.start_year} -
                {row.end_year
                    ? (row.end_month ? row.end_month + "/" : "") + row.end_year
                    : "Present"}
            </div>
            <div>{row.groupings_mechanisms}</div>
            <div>{row.third_party}</div>
            <div>{row.local_parties}</div>
        {/each}
    </div>
</div>

<style>
    .agreement_list {
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
    .table {
        display: grid;
        grid-template-columns: 0.5fr 2fr 1fr 1fr;
        border: 1px solid #595959;
    }
    .table div {
        padding: 8px;
        border: 1px solid #605f5f;
        text-align: left;
        word-break: break-word;
        overflow-wrap: anywhere;
        white-space: normal;
    }

    .table div {
        word-break: break-word;
    }

    .table div::before {
        content: "\200B";
    }

    .table_header {
        font-weight: bold;
        background-color: #424242;
    }
</style>
