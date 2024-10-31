<template>
    <button class="sync-button">按钮</button>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';

onMounted(() => {
    const getElement = (cssSelector) => {
        const dom = document.querySelector(cssSelector);
        const proxy = new Proxy(dom, {
            get(target, prop: string, receiver) {
                if (!prop.startsWith('wait')) {
                    return Reflect.get(target, prop, receiver);
                }

                return new Promise(resolve => {
                    const eventName = prop.slice(4).toLowerCase();
                    target.addEventListener(eventName, resolve, {
                        once: true
                    })
                })
            }
        })
        return proxy;
    }

    (async () => {
        const btn = getElement('.sync-button');
        while(1) {
            await btn.waitClick;
            console.log('click!');
        }
    })();
})
</script>
