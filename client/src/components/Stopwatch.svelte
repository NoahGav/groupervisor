<script lang="ts">
  // TODO - Figure out what to do if user has multiple works with no end.

  import { WorkHelper, type Work } from "../lib/work";
  import { account } from "../lib/account";
  import store from "../lib/store";
  import { onDestroy } from "svelte";

  let state = "paused" as "paused" | "running";
  let selecting = false;
  let taskId = "";
  let currentTime = 0;
  let currentWork: Work | null = null;

  $: if (state === "running") selecting = false;

  $: totalTime =
    WorkHelper.timeDoneToday($store.tasks, account.uid, currentTime) /
    1000 /
    60;

  $: {
    currentWork = null;

    Object.entries($store.tasks).forEach(([id, task]) => {
      task.work.forEach((work) => {
        if (!work.end && work.uid === account.uid) {
          currentWork = work;
          taskId = id;
        }
      });
    });
  }

  $: options = Object.entries($store.tasks).sort((a, b) =>
    a[1].name.localeCompare(b[1].name)
  );

  // Set state to running if any work done today is not done.
  $: if (currentWork) state = "running";

  const timer = setInterval(() => (currentTime = new Date().getTime()), 38);

  function onSelectClicked() {
    if (state !== "paused") return;
    selecting = !selecting;
  }

  function onStartPauseClicked() {
    if (!$store.tasks[taskId]) return;
    if (state === "paused") startTime();
    else stopTime();
  }

  function startTime() {
    state = "running";

    $store.tasks[taskId].work.push({
      uid: account.uid,
      start: new Date().getTime(),
    });
  }

  function stopTime() {
    state = "paused";
    taskId = "";
    selecting = true;
    currentWork.end = new Date().getTime();
  }

  onDestroy(() => clearInterval(timer));
</script>

<div id="stopwatch">
  <div id="title">
    <span>Stopwatch</span>
    <span>(</span>
    <span style="color: lightcoral;">{$store.users[account.uid]?.name}</span>
    <span>)</span>
  </div>

  <div id="content">
    <div id="time">
      <div>
        {Math.floor(totalTime)}:{Math.floor(
          (totalTime % 1) * 60
        ).toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
      </div>

      <div id="label">
        {#if $store.tasks[taskId]}
          <span>(</span>
          <span style="color: lightcoral;">{$store.tasks[taskId]?.name}</span>
          <span>)</span>
        {:else}
          <span style="color: lightcoral"
            >You must select a task before you can start.</span
          >
        {/if}
      </div>
    </div>

    {#if selecting}
      <select
        bind:value={taskId}
        id="options"
        on:change={() => (selecting = false)}
      >
        {#each options as [id, task]}
          <option value={id}>{task.name}</option>
        {/each}
      </select>
    {:else}
      <div />
    {/if}

    <div id="btns">
      <button
        on:click={onSelectClicked}
        class="btn"
        style="background: #D0312D;"
      >
        SELECT
      </button>

      <button
        on:click={onStartPauseClicked}
        class="btn"
        style={`background: ${taskId.trim() !== "" ? "#3CB043" : "lightgray"};`}
      >
        {state === "paused" ? "START" : "PAUSE"}
      </button>
    </div>
  </div>
</div>

<style>
  #stopwatch {
    width: 100%;
    height: 100%;
    border: 1px solid gray;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }

  #title {
    font-size: 20px;
    font-weight: 500;
  }

  #content {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 75px 75px;
    gap: 10px;
  }

  #time {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 100px;
    flex-direction: column;
  }

  #label {
    font-size: 24px;
    text-align: center;
  }

  #btns {
    display: grid;
    grid-template-columns: 3fr 5fr;
    width: 100%;
    height: 100%;
    gap: 10px;
  }

  #options {
    font-size: 24px;
    text-align: center;
  }

  .btn {
    width: 100%;
    border: none;
    font-size: 24px;
    color: white;
  }
</style>
