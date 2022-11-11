<script lang="ts">
  import ProgressBar from "../components/ProgressBar.svelte";
  import Icon from "../components/Icon.svelte";
  import store from "../lib/store";
</script>

<!-- TODO - Actually calculate percentages. -->

<div id="tasks">
  {#each Object.entries($store.tasks) as [id, task]}
    <div class="task">
      <div class="task-row">
        <span class="title">{task.name}</span>
        <button class="edit-btn"><Icon icon="edit" /></button>
      </div>

      <div class="task-row">
        <span class="percentage">
          {Math.round((10 / task.estimate) * 100)}%
        </span>

        <span style="width: 328px;">
          <ProgressBar progress={Math.round((10 / task.estimate) * 100)} />
        </span>
      </div>
    </div>
  {/each}
</div>

<style>
  #tasks {
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .task {
    width: 100%;
    height: 75px;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid gray;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .task-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .title {
    font-size: 18px;
    font-weight: 500;
  }

  .edit-btn {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background: white;
    border: none;
  }

  .percentage {
    width: 32px;
    font-size: 18px;
    font-weight: 500;
  }
</style>
