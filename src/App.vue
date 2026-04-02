<script setup lang="ts">
import DeviceCard from "./components/widgets/device-card/DeviceCard.vue";
import FormBuilder from "./components/widgets/form-builder/FormBuilder.vue";
import Header from "./components/widgets/header/Header.vue";
import { Device } from "./core/device/device.class";
import { useForm } from "./stores/use-form.store";

const formStore = useForm();
</script>

<template>
    <Header></Header>
    <FormBuilder
        v-if="formStore.isVisible"
        :config="formStore.config"
        @save="(obj) => formStore.handlers!.save(obj)"
        @close="() => formStore.handlers?.close?.()"
    ></FormBuilder>

    <DeviceCard
        :device="new Device('http://176.197.120.121:8888')"
    ></DeviceCard>
</template>
