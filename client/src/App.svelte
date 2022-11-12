<script lang="ts">
  import { Router, Route, navigate } from "svelte-routing";
  import store from "./lib/store";
  import Home from "./pages/Home.svelte";
  import Account from "./pages/Account.svelte";
  import Register from "./pages/Register.svelte";
  import NotFound from "./pages/NotFound.svelte";

  // TODO - Go through all todos and remove them when I am sure they are fixed.
  // TODO - Sort #each elements. (Like user progress and tasks by name).
  // TODO - Percentages need to be capped at 100%.
  // TODO - Fix percentage gap.
  // TODO - Maybe switch percentage to time for user progress.
  // TODO - Make tasks tab actually work.
  // TODO - Make server check time and when it becomes the next day calculate a min time based on the stuff done before.
  // TODO - Make a button that can be pressed (only by me) that recalculates the min time just in case or something.
  // TODO - Download the server json and edit it then clear it and replace it with all data.
  // TODO - Try to center stopwatch time.
  // TODO - Fix width for small screens tasks.
  // TODO - Make backups deleted after the 3rd. (Delete all old backups when creating a new one).

  // Check for an account. If not navigate to the account page.
  if (!localStorage.getItem("uid")) navigate("/register");

  // Store refresh token so we can compare with server.
  const refreshToken = localStorage.getItem("refreshToken") ?? "";

  let ready = false;
  setTimeout(() => (ready = true), 1000);

  // Check if the refresh token has changed. If so, update it and force the app to reload.
  $: if (
    ready &&
    $store.misc.refreshToken &&
    $store.misc.refreshToken !== refreshToken
  ) {
    localStorage.setItem("refreshToken", $store.misc.refreshToken);
    document.location.reload();
  }
</script>

<main>
  <Router>
    <Route path="/"><Home /></Route>
    <Route path="/account"><Account /></Route>
    <Route path="/register"><Register /></Route>
    <Route path="/*" component={NotFound} />
  </Router>
</main>

<link
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
  rel="stylesheet"
/>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");

  main {
    color: #333;
    font-family: "Roboto";
  }
</style>
