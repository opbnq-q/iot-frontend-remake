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
    <Card v-if="data">
        <CardHeader>{{ data.name }}</CardHeader>
        <CardContent>
            <div v-for="field in data.fields">
                {{ field.name }} {{ field.value }}{{ field.postfix }}
            </div>
        </CardContent>
        <CardAction> </CardAction>
    </Card>
</template>
