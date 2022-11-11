<script lang="ts">
  import { WorkHelper } from "../lib/work";
  import store from "../lib/store";
  import { onDestroy } from "svelte";
  import Icon from "../components/Icon.svelte";
  import { account } from "../lib/account";

  let currentTime = 0;
  let minTime = $store.misc.minTime;
  let time = 0;
  let taskId = "";

  let date = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  $: year = date.split("-")[0];
  $: month = date.split("-")[1];
  $: day = date.split("-")[2];

  $: options = Object.entries($store.tasks).sort((a, b) =>
    a[1].name.localeCompare(b[1].name)
  );

  function addTime() {
    if (time === 0 || taskId.trim() === "") return;

    const startTime = new Date().getTime();
    const endTime = startTime + time * 1000 * 60;

    $store.tasks[taskId].work.push({
      uid: account.uid,
      start: startTime,
      end: endTime,
    });

    time = 0;
    taskId = "";
  }

  function subTime() {
    if (time === 0 || taskId.trim() === "") return;

    const startTime = new Date().getTime();
    const endTime = startTime - time * 1000 * 60;

    $store.tasks[taskId].work.push({
      uid: account.uid,
      start: startTime,
      end: endTime,
    });

    time = 0;
    taskId = "";
  }

  const timer = setInterval(() => (currentTime = new Date().getTime()), 38);
  onDestroy(() => clearInterval(timer));
</script>

<div id="content">
  <div id="totals">
    <div id="title">Totals</div>

    <div id="user-totals">
      {#each Object.entries($store.users) as [uid, user]}
        {#if (user.name === "Angel" && uid === "604b1901-954c-4b74-a7a4-206f61638d6f") || user.name !== "Angel"}
          <div>{user.name}</div>

          {#each Object.entries(WorkHelper.timePerTaskOnDay($store.tasks, uid, currentTime, new Date(`${month}/${day}/${year}`))) as [tid, time]}
            <div class="user-task" style="margin-left: 20px; font-weight: 500;">
              {#if WorkHelper.currentTask($store.tasks, uid) === tid}
                <Icon icon="schedule" />
              {:else}
                <div />
              {/if}

              <div>
                {$store.tasks[tid].name} : {Math.round(
                  (time / 1000 / 60) * 100
                ) / 100} minutes
              </div>
            </div>
          {/each}
        {/if}
      {/each}
    </div>
  </div>

  <div style="display: grid; gap: 10px; margin-top: 10px;">
    <div
      style="display: flex; width: 100%; height: 50px; justify-content: center; gap: 10px;"
    >
      <input
        type="number"
        style="width: 25%; text-align: center; font-size: 32px;"
        bind:value={time}
      />

      <select bind:value={taskId} style="width: 45%; text-align: center;">
        {#each options as [id, task]}
          <option value={id}>{task.name}</option>
        {/each}
      </select>

      <button
        style="width: 15%; background: lightgreen; display: grid; justify-content: center; align-items: center;"
        on:click={addTime}><Icon icon="add" /></button
      >

      <button
        style="width: 15%; background: lightcoral;  display: grid; justify-content: center; align-items: center;"
        on:click={subTime}><Icon icon="remove" /></button
      >
    </div>

    {#if account.uid === "a0610e79-fdde-4dab-be0a-d7fac7fb40d7"}
      <div>
        <span>Select date</span>
        <input type="date" bind:value={date} />
      </div>

      <div>
        <input type="number" bind:value={minTime} />
        <button on:click={() => ($store.misc.minTime = minTime)}>UPDATE</button>
      </div>
    {/if}
  </div>
</div>

<style>
  #content {
    width: 100%;
    height: fit-content;
    padding: 10px;
    box-sizing: border-box;
  }

  #totals {
    width: 100%;
    height: 100%;
    border: 1px solid gray;
    padding: 10px;
    box-sizing: border-box;
  }

  #title {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  #user-totals {
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 18px;
  }

  .user-task {
    display: grid;
    align-items: center;
    grid-template-columns: 32px 1fr;
  }
</style>
