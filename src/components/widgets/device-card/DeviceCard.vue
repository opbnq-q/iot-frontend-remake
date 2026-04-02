<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Action } from "@/core/actions/action.class";
import type { Device, IDataField } from "@/core/device/device.class";
import { useForm } from "@/stores/use-form.store";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-vue-next";
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

type ActionView = Pick<Action, "name" | "fetch" | "getConfig">;

const actions = ref<ActionView[]>([]);

type AlertState = {
    variant: "default" | "destructive";
    title: string;
    description?: string;
};

const alertState = ref<AlertState>({
    variant: "default",
    title: "",
    description: "",
});
const isAlertVisible = ref(false);

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

const showAlert = (state: AlertState) => {
    alertState.value = state;
    isAlertVisible.value = true;
};

const clearAlert = () => {
    isAlertVisible.value = false;
};

const openActionForm = (action: ActionView) => {
    if (formStore.isVisible) formStore.hide();
    formStore.open(action.getConfig(), {
        save: async (obj) => {
            clearAlert();
            try {
                const response = await action.fetch(obj);
                formStore.hide();
                showAlert({
                    variant: "default",
                    title: "Команда отправлена",
                    description: response?.status ?? "Успешно",
                });
            } catch (e) {
                showAlert({
                    variant: "destructive",
                    title: "Ошибка выполнения",
                    description:
                        e instanceof Error
                            ? e.message
                            : "Не удалось выполнить команду",
                });
            }
        },
        close: () => formStore.hide(),
    });
};
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
            <Alert v-if="isAlertVisible" :variant="alertState.variant">
                <CheckCircle2Icon v-if="alertState.variant !== 'destructive'" />
                <AlertCircleIcon v-else />
                <AlertTitle>{{ alertState.title }}</AlertTitle>
                <AlertDescription v-if="alertState.description">
                    {{ alertState.description }}
                </AlertDescription>
            </Alert>
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
                    @click="openActionForm(action)"
                    variant="outline"
                    v-for="action in actions"
                    >{{ action.name }}</Button
                >
            </div>
        </CardAction>
    </Card>
</template>
