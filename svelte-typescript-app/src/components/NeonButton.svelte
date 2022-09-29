<script lang="ts">
    export let content: string;
</script>

<button class="neon-text neon-button">
    {content}
</button>

<style>
    .neon-button {
        transition: all 0.2s;
        background: transparent;
        border: solid 3px #fff;
        border-radius: 4px;
        padding: 4px 8px;
        box-shadow:
            0 0 4px #fff,
            0 0 14px #f37,
            inset 0 0 7px #f07
            ;
        cursor: pointer;
    }

    .neon-button:hover {
        box-shadow:
            0 0 4px #fff,
            0 0 14px #f3f,
            inset 0 0 7px #f0f
            ;
    }

    .neon-text {
        font-size: 2rem;
        color: #fff;
        text-shadow:
            0 0 4px #fff,
            0 0 10px #faf,
            0 0 10px #f09
            ;
        font-family: 'Vibur', sans-serif;
    }

    .neon-text:hover {
        font-size: 2rem;
        color: #fff;
        text-shadow:
            0 0 4px #fff,
            0 0 10px #faf,
            0 0 10px #f09
            ;
    }
</style>
