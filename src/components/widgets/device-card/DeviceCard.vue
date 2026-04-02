<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Action } from "@/core/actions/action.class";
import type { Device, IDataField } from "@/core/device/device.class";
import { useForm } from "@/stores/use-form.store";
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

const actions = ref<Action[]>([]);

onMounted(async () => {
    props.device.addListener((obj) => {
        data.value.name = obj.name;
        data.value.color = obj.color;
        data.value.fields = obj.dataFields;
    });
    props.device.ws();

    actions.value = await Action.getAll(props.device.connection);
});

onUnmounted(() => props.device.closeWs());

const formStore = useForm();
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
        <CardAction class="p-4">
            <div class="flex justify-center flex-wrap gap-4">
                <Button
                    @click="
                        () => {
                            if (formStore.isVisible) formStore.hide();
                            formStore.open(action.getConfig(), {
                                save: (obj) => {
                                    console.log(obj);
                                    action
                                        .fetch(obj)
                                        .catch((e) => console.log(e));
                                },
                                close: () => formStore.hide(),
                            });
                        }
                    "
                    variant="outline"
                    v-for="action in actions"
                    >{{ action.name }}</Button
                >
            </div>
        </CardAction>
    </Card>
</template>
