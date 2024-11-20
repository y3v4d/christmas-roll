<script lang="ts">
  import { onMount } from 'svelte';
  
  interface Props {
    participants: string[];
  }

  let { participants }: Props = $props();
  
  let rotation = $state(0);
  let targetRotation = $state(0);
  
  let animationHandle: number = -1;
  let lastLandOn: number = -1;
  let lastTime = 0;
  
  onMount(() => {
    update(0);
  
    return () => cancelAnimationFrame(animationHandle);
  });

  export function spin(landOn: number) {
    const angle = 360 / participants.length;
    const halfAngle = angle / 2;
  
    const target = -angle * landOn + -halfAngle;
    const maxDeviation = halfAngle * 0.75;
    const deviation = -maxDeviation + Math.floor(Math.random() * maxDeviation * 2);
    const random = 50;
  
    rotation = 0;
    targetRotation = target + deviation + random * 360;
    lastLandOn = landOn;
  }

  export function setup(landOn: number) {
    if(lastLandOn !== landOn) {
      spin(landOn);
    }

    rotation = targetRotation;
  }
  
  function update(timestamp: number) {
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    if(rotation != targetRotation) {
      const diff = targetRotation - rotation;
      const delta = Math.min(20, diff / 100);
  
      rotation += delta * deltaTime * 100;
  
      if(Math.abs(rotation - targetRotation) < 1) {
        rotation = targetRotation;
      }
    }
  
    animationHandle = requestAnimationFrame(update);
  }
</script>
  
<main class="relative w-96 h-96 rounded-full border-black border-4 bg-green-300">
  <div class="relative w-full h-full transform" style="--tw-rotate: {rotation}deg">
    {#each participants as participant, i}
      {@const angle = (360 / participants.length) * i}
      
      <div class="absolute h-1/2 bg-black w-1 left-1/2 -translate-x-1/2 origin-bottom"
        style="--tw-rotate: {angle}deg;"
      ></div>
      <div
        class="absolute h-1/2 left-1/2 -translate-x-1/2 flex items-center origin-bottom"
        style="--tw-rotate: {angle + (360 / participants.length / 2)}deg;"
      >
        <p class="-rotate-90">{participant}</p>
      </div>
    {/each}
  </div>
  <div class="absolute -top-1 left-1/2 -translate-x-1/2 h-4 w-1 bg-yellow-500"></div>
</main>