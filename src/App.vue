<script setup lang="ts">
import DeviceCard from "./components/widgets/device-card/DeviceCard.vue";
import FormBuilder from "./components/widgets/form-builder/FormBuilder.vue";
import Header from "./components/widgets/header/Header.vue";
import { Device } from "./core/device/device.class";
import { useForm } from "./stores/use-form.store";
import { useMediaQuery } from "@vueuse/core";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Toaster } from "@/components/ui/sonner";
import { devices } from "./devices";

const formStore = useForm();
const isDesktop = useMediaQuery("(min-width: 768px)");

const handleFormClose = () => {
    formStore.handlers?.close?.();
    formStore.hide();
};

const handleSave = (obj: Record<string, unknown>) => {
    formStore.handlers?.save(obj as never);
};
</script>

<template>
    <Toaster></Toaster>
    <Header></Header>

    <Dialog
        v-if="isDesktop"
        :open="formStore.isVisible"
        @update:open="(open) => !open && handleFormClose()"
    >
        <DialogContent :showCloseButton="false" class="p-0 sm:max-w-xl">
            <FormBuilder
                v-if="formStore.config"
                :config="formStore.config"
                :isSubmitting="formStore.isSubmitting"
                @save="handleSave"
                @close="handleFormClose"
            ></FormBuilder>
        </DialogContent>
    </Dialog>

    <Drawer
        v-else
        :open="formStore.isVisible"
        @update:open="(open) => !open && handleFormClose()"
    >
        <DrawerContent class="p-0">
            <FormBuilder
                v-if="formStore.config"
                :config="formStore.config"
                :isSubmitting="formStore.isSubmitting"
                @save="handleSave"
                @close="handleFormClose"
            ></FormBuilder>
        </DrawerContent>
    </Drawer>

    <div class="flex gap-4 flex-col mx-4">
        <DeviceCard v-for="device in devices" :device></DeviceCard>
    </div>
</template>
