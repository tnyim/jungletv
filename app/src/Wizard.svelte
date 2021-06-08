<script></script>

<div class="md:grid md:grid-cols-3 md:gap-6 m-2 sm:m-4 md:m-6 flex-grow container max-w-screen-lg">
    <div class="md:col-span-1">
        <slot name="step-info" />
    </div>
    <div class="mt-5 md:mt-0 md:col-span-2">
        <div class="shadow sm:rounded-md sm:overflow-hidden">
            <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div class="grid grid-cols-3 gap-6">
                    <div class="col-span-3">
                        <slot name="main-content" />
                    </div>
                </div>
            </div>
            <div class="px-4 py-3 bg-gray-50 sm:px-6">
                <slot name="buttons" />
            </div>
        </div>
    </div>
</div>
