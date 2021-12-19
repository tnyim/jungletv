<script lang="ts">
    export let formattedValue: string;
    export let index: number;
    export let value: number;
    export let values: number[];
    export let min: number;
    export let max: number;

    function handleFloatMinusClick() {
        values[index]--;
        values = values;
    }

    function handleFloatPlusClick() {
        values[index]++;
        values = values;
    }

    function handleFloatValueChange(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
        let parts = e.currentTarget.value.split(":");
        if (parts.length == 1) {
            let s = parseInt(parts[0]);
            if (!isNaN(s)) {
                values[index] = s;
            }
        } else if (parts.length == 2) {
            let m = parseInt(parts[0]);
            let s = parseInt(parts[1]);
            if (!isNaN(m) && !isNaN(s)) {
                values[index] = m * 60 + s;
            }
        } else if (parts.length == 3) {
            let h = parseInt(parts[0]);
            let m = parseInt(parts[1]);
            let s = parseInt(parts[2]);
            if (!isNaN(h) && !isNaN(m) && !isNaN(s)) {
                values[index] = h * 60 * 60 + m * 60 + s;
            }
        }
        values = values;
    }
    function handleFloatInputKeydown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) {
        if (e.key == "Enter") {
            handleFloatValueChange(e);
            e.currentTarget.blur();
        }
    }

    let inputField: HTMLInputElement;

    $: {
        if (inputField !== undefined) {
            inputField.value = formattedValue; // ensure the input value is updated before we calculate the width
            inputField.style.width = "0px";
            inputField.style.width = inputField.scrollWidth + "px";
        }
    }
</script>

<div class="text-center text-2xl">
    <input
        bind:this={inputField}
        class="bg-transparent text-center"
        bind:value={formattedValue}
        on:blur={(e) => handleFloatValueChange(e)}
        on:keydown={(e) => handleFloatInputKeydown(e)}
        on:click={(e) => e.currentTarget.select()}
    />
</div>
<div class="flex flex-row justify-center gap-x-2 text-3xl">
    <i
        class="fas fa-minus-square
            {value > min ? 'cursor-pointer hover:text-yellow-500' : 'text-gray-500'}"
        on:click={() => handleFloatMinusClick()}
    />
    <i
        class="fas fa-plus-square
            {value < max ? 'cursor-pointer hover:text-yellow-500' : 'text-gray-500'}"
        on:click={() => handleFloatPlusClick()}
    />
</div>
