<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { navigate, Route, Router } from "svelte-routing";

  import LoginPage from './pages/LoginPage.svelte';
  import WheelPage from './pages/WheelPage.svelte';
  import global from './store.svelte';
  import { io } from 'socket.io-client';
  import type { User } from './schema/UserSchema';
  import lastChristmas from "./assets/last_christmas.mp3";

  let title = $derived((global.username ? `${global.username} | ` : "") + "Wielkie losowanie świąteczne");
  let audio: HTMLAudioElement = null!;

  $effect(() => {
    if(global.connected) {
      navigate("/wheel");
    } else {
      navigate("/login");
    }
  })

  onMount (() => {
    global.socket = io('http://localhost:3000', { autoConnect: false });

    global.socket.on("connect", onConnected);
    global.socket.on("disconnect", onDisconnected);
    global.socket.on("init", onInit);

    audio = new Audio(lastChristmas);
    audio.volume = 1;
    audio.loop = true;

    audio.play();
  });

  onDestroy(() => {
    if(!global.socket) {
      return;
    }

    global.socket.disconnect();

    global.socket.off("connect", onConnected);
    global.socket.off("disconnect", onDisconnected);
  });

  function onInit(user: User) {
    console.log("Init", user);
    global.username = user.username;
  }

  function onConnected() {
    console.log("Connected to server");
    global.connected = true;
  }

  function onDisconnected() {
    console.log("Disconnected from server");
    global.connected = false;
    global.username = "";
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
<audio src={lastChristmas}></audio>
<Router>
  <Route path="/login">
    <LoginPage></LoginPage>
  </Route>
  <Route path="/wheel">
    <WheelPage></WheelPage>
  </Route>
</Router>

<style>
</style>
