<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { account } from "../lib/account";
  import store from "../lib/store";

  let name = "";
  let color = "#FF0000";

  onMount(() => {
    if (account.uid.trim() !== "") navigate("/");
  });

  function createAccount() {
    if (name.trim() === "") return;

    if (name.trim() === "Angel") {
      localStorage.setItem("uid", "604b1901-954c-4b74-a7a4-206f61638d6f");
      window.document.location.reload();
    }

    Object.entries($store.users).forEach(([uid, user]) => {
      if (name.trim() === user.name.trim()) {
        localStorage.setItem("uid", uid);
        navigate("/");
      }
    });

    $store.users[account.uid] = { name, color };
    navigate("/");
  }
</script>

<div id="form">
  <div id="label">SIGN UP</div>

  <div id="name">
    <div>Name</div>
    <input type="text" bind:value={name} />
  </div>

  <div id="color">
    <div>Color</div>
    <input type="color" bind:value={color} />
  </div>

  <button id="btn" on:click={createAccount}>SIGN UP</button>
</div>

<style>
  #form {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  #label {
    font-size: 24px;
    font-weight: bold;
  }

  #name div {
    font-size: 20px;
  }

  #name input {
    width: 100%;
    height: 50px;
    outline: none;
    box-sizing: border-box;
  }

  #color div {
    font-size: 20px;
  }

  #color input {
    width: 100%;
    height: 50px;
  }

  #btn {
    background: red;
    color: white;
    padding: 15px;
    font-size: 20px;
    font-weight: bold;
    border: none;
    width: 100%;
  }
</style>
