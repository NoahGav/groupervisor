<script lang="ts">
  export let height = "16px";
  export let color = "#5DBB63";
  export let progress = 0;
</script>

<div class="progress-bar" style={`height: ${height};`}>
  <div style={`background: ${color}; width: ${progress}%; height: 100%;`} />
</div>

<style>
  .progress-bar {
    width: 100%;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid gray;
    box-sizing: border-box;
  }
</style>
