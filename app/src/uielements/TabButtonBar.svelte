<script lang="ts">
    import { onDestroy } from "svelte";

    export let extraClasses = "";

    let tabBar: HTMLDivElement;
    let blW = 0;
    let blSW = 1,
        wDiff = blSW / blW - 1, // widths difference ratio
        mPadd = 50, // Mousemove Padding
        damp = 12, // Mousemove response softness
        mX = 0, // Real mouse position
        mX2 = 0, // Modified mouse position
        posX = 0,
        mmAA = blW - mPadd * 2, // The mousemove available area
        mmAAr = blW / mmAA; // get available mousemove fidderence ratio
    $: if (tabBar !== undefined) {
        blSW = tabBar.scrollWidth;
        wDiff = blSW / blW - 1; // widths difference ratio
        mmAA = blW - mPadd * 2; // The mousemove available area
        mmAAr = blW / mmAA;
    }
    let touchingTabBar = false;
    function onTabBarMouseMove(e: MouseEvent) {
        if (!touchingTabBar) {
            mX = e.pageX - tabBar.getBoundingClientRect().left;
            mX2 = Math.min(Math.max(0, mX - mPadd), mmAA) * mmAAr;
            if (scrollInterval == undefined) {
                setupScrollInterval();
            }
        }
    }

    let scrollInterval: number;
    let didNotMoveFor = 0;

    function setupScrollInterval() {
        scrollInterval = setInterval(function () {
            if (!touchingTabBar) {
                let prev = tabBar.scrollLeft;
                posX += (mX2 - posX) / damp; // zeno's paradox equation "catching delay"
                tabBar.scrollLeft = posX * wDiff;
                if (prev == tabBar.scrollLeft) {
                    didNotMoveFor++;
                    if (didNotMoveFor > 20) {
                        // we have stopped moving, clear the interval to save power
                        clearScrollInterval();
                        return;
                    }
                } else {
                    didNotMoveFor = 0;
                }
            } else {
                clearScrollInterval();
            }
        }, 16);
    }

    function clearScrollInterval() {
        if (scrollInterval !== undefined) {
            clearInterval(scrollInterval);
            scrollInterval = undefined;
        }
    }

    onDestroy(() => {
        clearScrollInterval();
    });
</script>

<div
    tabindex="-1"
    class="flex flex-row h-9 overflow-x-scroll disable-scrollbars relative {extraClasses}"
    on:mousemove={onTabBarMouseMove}
    on:touchstart={() => (touchingTabBar = true)}
    on:touchend={() => {
        clearScrollInterval();
        touchingTabBar = false;
    }}
    bind:this={tabBar}
    bind:offsetWidth={blW}
>
    <slot />
</div>

<style>
    .disable-scrollbars::-webkit-scrollbar {
        width: 0px;
        height: 0px;
        background: transparent; /* Chrome/Safari/Webkit */
    }

    .disable-scrollbars {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
    }
</style>
