<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-vue-next";
import { Action } from "@/core/actions/action.class";
import { Param } from "@/core/params/param.class";
import type { Device, IDataField } from "@/core/device/device.class";
import { useForm } from "@/stores/use-form.store";
import { toast } from "vue-sonner";
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
type ParamView = Pick<Param, "id" | "name" | "fetch" | "getConfig" | "value">;

const actions = ref<ActionView[]>([]);
const params = ref<ParamView[]>([]);

onMounted(async () => {
    props.device.addListener((obj) => {
        data.value.name = obj.name;
        data.value.color = obj.color;
        data.value.fields = obj.dataFields;
    });
    props.device.ws();

    actions.value = await Action.getAll(props.device.connection);
    params.value = await Param.getAll(props.device.connection);
});

onUnmounted(() => props.device.closeWs());

const formStore = useForm();

const openActionForm = (action: ActionView) => {
    if (formStore.isVisible) formStore.hide();
    formStore.setSubmitting(false);
    formStore.open(action.getConfig(), {
        save: async (obj) => {
            formStore.setSubmitting(true);
            try {
                const response = await action.fetch(obj);
                formStore.hide();
                toast.success("Команда отправлена", {
                    description: response?.status ?? "Успешно",
                });
            } catch (e) {
                toast.error("Ошибка выполнения", {
                    description:
                        e instanceof Error
                            ? e.message
                            : "Не удалось выполнить команду",
                });
            } finally {
                formStore.setSubmitting(false);
            }
        },
        close: () => {
            formStore.setSubmitting(false);
            formStore.hide();
        },
    });
};

const openParamForm = (param: ParamView) => {
    if (formStore.isVisible) formStore.hide();
    formStore.setSubmitting(false);
    formStore.open(param.getConfig(), {
        save: async (obj) => {
            formStore.setSubmitting(true);
            try {
                const newValue = obj[param.id];
                const response = await param.fetch(newValue);
                param.value = newValue;
                formStore.hide();
                toast.success("Настройка сохранена", {
                    description: response?.status ?? "Успешно",
                });
            } catch (e) {
                toast.error("Ошибка сохранения", {
                    description:
                        e instanceof Error
                            ? e.message
                            : "Не удалось сохранить настройку",
                });
            } finally {
                formStore.setSubmitting(false);
            }
        },
        close: () => {
            formStore.setSubmitting(false);
            formStore.hide();
        },
    });
};
</script>

<template>
    <Card v-if="data" class="w-full">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <div class="flex items-center gap-2">
                <span
                    class="h-2.5 w-2.5 rounded-full"
                    :style="{ backgroundColor: data.color }"
                ></span>
                <span class="text-base font-semibold">{{ data.name }}</span>
            </div>
            
            <div v-if="params.length > 0">
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button variant="ghost" size="icon" class="h-8 w-8">
                            <Settings class="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Настройки</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            v-for="param in params"
                            :key="param.id"
                            @click="openParamForm(param)"
                        >
                            {{ param.name }}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
        <CardAction class="p-4" v-if="actions.length > 0">
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
