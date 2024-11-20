<script lang="ts">
  import global from "../store.svelte";

  const usernames = [
    "bartek",
    "jonasz",
    "monika",
    "mateusz",
    "mama",
    "tata"
  ];

  let username = $state("bartek");
  let password = $state("1234");

  function login() {
    console.log(`Logging in with username: ${username} and password: ${password}`);

    global.socket.auth = {
      username: username,
      password: password
    };

    global.username = username;
    global.socket.connect();
  }
</script>

<main class="h-full flex items-center justify-center bg-black bg-opacity-50">
  <div class="flex flex-col gap-4 bg-gray-500 border-gray-600 border-2 p-8 rounded-md">
    <div class="input-box">
      <label for="username">Nazwa uzytkownika</label>
      <select id="username" bind:value={username}>
        {#each usernames as user}
          <option value={user}>{user}</option>
        {/each}
      </select>
    </div>

    <div class="input-box">
      <label for="password">Hasło</label>
      <input id="password" type="password" placeholder="Podaj hasło..." bind:value={password} />
    </div>

    <button onclick={login}>
      Zaloguj
    </button>
  </div>
</main>

<style lang="postcss">
  .input-box {
    @apply flex flex-col;
  }

  .input-box > label {
    @apply text-xs font-extrabold;
  }
</style>