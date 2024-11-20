<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Wheel from "../components/Wheel.svelte";
  import { GameStage, type GameState } from "../schema/StateSchema";
  import global from "../store.svelte";

  let gameState: GameState = $state(null)!;
  let wheel = $state() as ReturnType<typeof Wheel>;

  let participants = $derived(gameState?.users.map(user => user.displayName) ?? []);

  onMount(() => {
    if(!global.socket) {
      return;
    }

    global.socket.on("state-update", onStateUpdate);
    global.socket.emit("request-state");
  });

  onDestroy(() => {
    if(!global.socket) {
      return;
    }

    global.socket.off("state-update", onStateUpdate);
  });

  function spin() {
    if(gameState.currentTurn !== global.username) {
      return;
    }

    global.socket.emit("roll");
  }

  function canSpin() {
    if(!gameState) {
      return false;
    }

    return gameState.currentTurn === global.username && gameState.stage === GameStage.WAITING;
  }

  function onStateUpdate(state: GameState) {
    console.log("State update", state);
    gameState = state;

    if(state.stage === GameStage.WAITING) {
      if(state.rolled.length == 0) {
        return;
      }

      const lastRolled = state.rolled[state.rolled.length - 1];
      const lastRolledUser = state.users.find(user => user.username === lastRolled);
      if(!lastRolledUser) {
        console.error("Current user not found");
        return;
      }

      wheel.setup(participants.indexOf(lastRolledUser.displayName));
    } else if(state.stage === GameStage.ROLLING) {
      const currentUser = state.users.find(user => user.username === state.currentTurn);
      if(!currentUser) {
        console.error("Current user not found");
        return;
      }

      const rolledUser = state.users.find(user => currentUser.rolled === user.username);
      if(!rolledUser) {
        console.error("Rolled user not found");
        return;
      }

      wheel.spin(participants.indexOf(rolledUser.displayName));
    }
  }
</script>

<main class="flex flex-col items-center gap-8 justify-center h-full">
  <Wheel participants={participants} bind:this={wheel}/>
  
  <button class="z-10 disabled:opacity-50 p-4 text-white font-bold bg-red-500 rounded-lg" disabled={!canSpin()} onclick={() => spin()}>
    ZAKRĘĆ KOŁEM I WYLOSUJ CZŁONKA RODZINY
  </button>

  <nav class="absolute top-0 right-0 bg-gray-500 p-4 m-4 rounded-md">
    <h2>
      Rodzina
      {#if gameState?.users.length === 6}
        (w komplecie)
      {/if}
    </h2>
    {#each gameState?.users || [] as user}
    <div>
      <span 
        class:text-green-500={user.username === global.username}
        class:text-yellow-500={user.username === gameState.currentTurn}
        class:text-red-500={user.disconnected}
      >
        {user.displayName}
      </span>
      {#if user.rolled && gameState?.currentTurn !== user.username}
        {@const rolledUser = gameState.users.find(u => u.username === user.rolled)}
        <span>dla {rolledUser?.displayName ?? "Unknown"}</span>
      {/if}
    </div>
      
    {/each}
  </nav>
</main>