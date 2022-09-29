<script lang="ts">
    import NeonButton from "./components/NeonButton.svelte";
	export let name: string;
</script>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
    <NeonButton content="play pong" />
</main>

<style>
    :global(body) {
        background-color: #10101b;
        color: #fff;
    }

	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff5300;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

    a {
        color: #3af;
    }

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
