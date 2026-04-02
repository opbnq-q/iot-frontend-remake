<script setup lang="ts">
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import type { Device, IDataField } from "@/core/device/device.class";
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
    device: Device;
}>();

const data = ref<
    Partial<{
        fields: IDataField[];
        name: string;
        color: string;
    }>
>({});

onMounted(() => {
    props.device.addListener((obj) => {
        data.value.name = obj.name;
        data.value.color = obj.color;
        data.value.fields = obj.dataFields;
    });
    props.device.ws();
});

onUnmounted(() => props.device.closeWs());
</script>

<template>
    <Card v-if="data" class="w-full">
        <CardHeader class="flex items-center justify-between space-y-0 pb-2">
            <div class="flex items-center gap-2">
                <span
                    class="h-2.5 w-2.5 rounded-full"
                    :style="{ backgroundColor: data.color }"
                ></span>
                <span class="text-base font-semibold">{{ data.name }}</span>
            </div>
        </CardHeader>
        <CardContent class="space-y-3">
            <div
                v-for="field in data.fields"
                :key="field.name"
                class="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2 text-sm"
            >
                <span class="text-muted-foreground">{{ field.name }}</span>
                <span class="font-medium"
                    >{{ field.value }}{{ field.postfix }}</span
                >
            </div>
        </CardContent>
        <CardAction class="pt-2"></CardAction>
    </Card>
</template>
