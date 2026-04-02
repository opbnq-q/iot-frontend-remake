<script setup lang="ts">
import { Button } from "@/components/ui/button";
import type { IConfigSchema } from "@/core/forms/interfaces/config.schema.interface";
import { computed, ref, watch } from "vue";
import { Loader2, Save, X } from "lucide-vue-next";
import Textarea from "@/components/ui/textarea/Textarea.vue";
import Switch from "@/components/ui/switch/Switch.vue";
import NumberField from "@/components/ui/number-field/NumberField.vue";
import NumberFieldDecrement from "@/components/ui/number-field/NumberFieldDecrement.vue";
import NumberFieldIncrement from "@/components/ui/number-field/NumberFieldIncrement.vue";
import NumberFieldInput from "@/components/ui/number-field/NumberFieldInput.vue";
import type { FieldType } from "@/core/forms/field.type";

const props = defineProps<{
    config: IConfigSchema;
    isSubmitting?: boolean;
}>();

const emits = defineEmits<{
    (e: "close"): void;
    (e: "save", obj: Record<string, FieldType | undefined>): void;
}>();

const isSubmitting = computed(() => props.isSubmitting ?? false);

const keys = computed(
    () =>
        Object.keys(
            props.config.fields ?? {},
        ) as (keyof typeof props.config.fields)[],
);

const data = ref<Record<string, FieldType | undefined>>({});

watch(
    keys,
    (nextKeys) => {
        const nextData: Record<string, FieldType | undefined> = {};
        nextKeys.forEach((el) => {
            nextData[el as string] =
                data.value[el as string] ??
                props.config.fields?.[el as string]?.defaultValue;
        });
        data.value = nextData;
    },
    { immediate: true },
);

const buildPayload = (): Record<string, FieldType | undefined> => {
    const payload: Record<string, FieldType | undefined> = {};
    keys.value.forEach((key) => {
        const field = props.config.fields?.[key];
        const id = field?.id ?? (key as string);
        payload[id] = data.value[key as string];
    });
    return payload;
};
</script>

<template>
    <form
        @submit.prevent
        class="space-y-6 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm max-w-xl"
    >
        <h1 class="text-lg font-semibold">
            {{ props.config?.title?.trim() || "Команда" }}
        </h1>

        <div
            v-for="field in keys"
            v-show="!props.config.fields[field]?.isReadonly"
            class="grid gap-2"
        >
            <span class="text-sm font-medium text-muted-foreground">{{
                props.config.fields[field]?.name ?? field
            }}</span>
            <Textarea
                v-if="props.config.fields[field]?.type == 'string'"
                v-model="data[field] as string"
            ></Textarea>
            <NumberField
                v-else-if="
                    ['float', 'int'].includes(
                        props.config.fields[field]?.type ?? '',
                    )
                "
                v-model="data[field] as number"
                :step="
                    props.config.fields[field]?.type === 'float' ? 0.0000001 : 1
                "
                :formatOptions="
                    props.config.fields[field]?.type === 'float'
                        ? { maximumFractionDigits: 7 }
                        : { maximumFractionDigits: 0 }
                "
            >
                <div class="relative">
                    <NumberFieldInput class="h-10" />
                    <NumberFieldDecrement />
                    <NumberFieldIncrement />
                </div>
            </NumberField>
            <Switch
                v-else-if="props.config.fields[field]?.type === 'bool'"
                v-model="data[field] as boolean"
            ></Switch>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2">
            <Button
                type="button"
                @click="emits('close')"
                :variant="'outline'"
                class="h-9 w-9 p-0"
            >
                <X />
            </Button>
            <Button
                type="button"
                @click="emits('save', buildPayload())"
                :variant="'default'"
                class="h-9 w-9 p-0"
                :disabled="isSubmitting"
            >
                <Loader2 v-if="isSubmitting" class="animate-spin" />
                <Save v-else />
            </Button>
        </div>
    </form>
</template>
