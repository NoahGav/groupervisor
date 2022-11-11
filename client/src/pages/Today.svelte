<script lang="ts">
  import store from "../lib/store";
  import ProgressBar from "../components/ProgressBar.svelte";
  import Stopwatch from "../components/Stopwatch.svelte";
  import { WorkHelper } from "../lib/work";
  import { onDestroy } from "svelte";
  import Icon from "../components/Icon.svelte";
  import { account } from "../lib/account";

  let currentTime = 0;

  const timer = setInterval(() => (currentTime = new Date().getTime()), 38);
  onDestroy(() => clearInterval(timer));

  function ANGEL() {
    localStorage.setItem("uid", "604b1901-954c-4b74-a7a4-206f61638d6f");
    window.document.location.reload();
  }
</script>

<div id="content">
  {#if $store.users[account.uid] === undefined}
    <button on:click={ANGEL}>ANGEL</button>
  {/if}

  <div id="progress">
    <div id="progress-title">Progress</div>

    {#each Object.entries($store.users) as [uid, user]}
      {#if (user.name === "Angel" && uid === "604b1901-954c-4b74-a7a4-206f61638d6f") || user.name !== "Angel"}
        <div class="user-progress">
          <div>{user.name}</div>

          <!-- TODO - Switch to store schedule instead of always 132 minutes. -->
          <!-- TODO - Fix gap between %. -->

          {#if WorkHelper.isWorking($store.tasks, uid)}
            <Icon icon="schedule" />
          {:else}
            <div />
          {/if}

          <div>
            {Math.floor(
              WorkHelper.timeDoneToday($store.tasks, uid, currentTime) /
                1000 /
                60
            )}:{Math.floor(
              ((WorkHelper.timeDoneToday($store.tasks, uid, currentTime) /
                1000 /
                60) %
                1) *
                60
            ).toLocaleString("en-US", {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}
          </div>

          <ProgressBar
            progress={(WorkHelper.timeDoneToday(
              $store.tasks,
              uid,
              currentTime
            ) /
              1000 /
              60 /
              $store.misc.minTime) *
              100}
            color={user.color}
          />
        </div>
      {/if}
    {/each}
  </div>

  <Stopwatch />
</div>

<style>
  #content {
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  #progress {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid gray;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  #progress-title {
    font-size: 20px;
    font-weight: 500;
  }

  .user-progress {
    width: 100%;
    height: 24px;
    display: grid;
    align-items: center;
    grid-template-columns: 14% 8% 16% 1fr;
    gap: 10px;
    font-size: 18px;
  }
</style>
