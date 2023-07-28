<script>
    // This component is available for use in JAF application pages as <jungletv-wizard>
</script>

<div class="md:grid md:grid-cols-3 md:gap-6 sm:m-4 md:m-6 grow container max-w-screen-lg">
    <div class="md:col-span-1 m-2 sm:m-0">
        <slot name="step-info" />
    </div>
    <div class="mt-5 md:mt-0 md:col-span-2">
        <div class="shadow sm:rounded-md sm:overflow-hidden">
            <div class="px-4 py-5 bg-white dark:bg-gray-800 space-y-6 sm:p-6">
                <div class="grid grid-cols-3 gap-6">
                    <div class="col-span-3">
                        <slot name="main-content" />
                    </div>
                </div>
            </div>
            {#if $$slots.buttons}
                <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 sm:px-6">
                    <slot name="buttons" />
                </div>
            {/if}
        </div>
        {#if $$slots.extra_1}
            <div class="mt-4">
                <slot name="extra_1" />
            </div>
        {/if}
        {#if $$slots.extra_2}
            <div class="mt-4">
                <slot name="extra_2" />
            </div>
        {/if}
        {#if $$slots.extra_3}
            <div class="mt-4">
                <slot name="extra_3" />
            </div>
        {/if}
        {#if $$slots.extra_4}
            <div class="mt-4">
                <slot name="extra_4" />
            </div>
        {/if}
        {#if $$slots.extra_5}
            <div class="mt-4">
                <slot name="extra_5" />
            </div>
        {/if}
    </div>
</div>
