<script lang="ts">
  import { account } from "../lib/account";
  import store from "../lib/store";
  import Register from "./Register.svelte";

  $: user = $store.users[account.uid];
</script>

{#if !$store.users[account.uid]}
  <Register />
{:else}
  <div>TODO - Allow editing of user information</div>

  <div>uid: {account.uid}</div>
  <div>name: {user.name}</div>
  <div>color: {user.color}</div>
{/if}
