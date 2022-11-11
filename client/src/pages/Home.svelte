<script lang="ts">
  import Today from "./Today.svelte";
  import Tasks from "./Tasks.svelte";
  import Icon from "../components/Icon.svelte";
  import Totals from "./Totals.svelte";

  let tab = "today" as "today" | "tasks" | "totals";
</script>

<!-- TODO - Fix tabs when overscroll. -->

<div id="content">
  {#if tab === "today"}
    <Today />
  {:else if tab === "tasks"}
    <Tasks />
  {:else if tab === "totals"}
    <Totals />
  {/if}
</div>

<div id="btns">
  <button
    on:click={() => (tab = "today")}
    style={`background: ${tab === "today" ? "lightgray" : "white"}`}
  >
    <Icon icon="schedule" size="40px" />
  </button>

  <button
    on:click={() => (tab = "totals")}
    style={`background: ${tab === "totals" ? "lightgray" : "white"}`}
  >
    <Icon icon="today" size="40px" />
  </button>
</div>

<style>
  #content {
    position: fixed;
    box-sizing: border-box;
    overflow: auto;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 75px;
  }

  #btns {
    position: fixed;
    bottom: 0px;
    display: flex;
    width: 100%;
    height: 75px;
    border-top: 1px solid gray;
    gap: 1px;
    background: gray;
  }

  #btns button {
    width: 100%;
    border: none;
    background: white;
    display: flex;
    padding: 0;
    justify-content: center;
    align-items: center;
  }
</style>
