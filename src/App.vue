<script setup lang="ts">
import FormBuilder from "./components/widgets/form-builder/FormBuilder.vue";
import Header from "./components/widgets/header/Header.vue";
import type { FieldMetaType } from "./core/connection/device.connection";
import { FormsConfigBuilder } from "./core/forms/config-builder";
import { FormsConfigField } from "./core/forms/field.config.schema";

type FieldDefinition = {
    name: string;
    type: FieldMetaType;
};

const fieldDefinitions: FieldDefinition[] = [
    { name: "device_id", type: "string" },
    { name: "device_name", type: "string" },
    { name: "location", type: "string" },
    { name: "serial_number", type: "string" },
    { name: "firmware_version", type: "string" },
    { name: "hardware_version", type: "string" },
    { name: "ip_address", type: "string" },
    { name: "mac_address", type: "string" },
    { name: "port", type: "int" },
    { name: "sampling_rate", type: "int" },
    { name: "threshold_min", type: "float" },
    { name: "threshold_max", type: "float" },
    { name: "enabled", type: "bool" },
    { name: "auto_restart", type: "bool" },
    { name: "timezone", type: "string" },
    { name: "sync_interval", type: "int" },
    { name: "log_level", type: "string" },
    { name: "heartbeat_interval", type: "int" },
    { name: "polling_interval", type: "int" },
    { name: "retry_limit", type: "int" },
    { name: "retry_delay", type: "int" },
    { name: "battery_level", type: "int" },
    { name: "signal_strength", type: "int" },
    { name: "temperature", type: "float" },
    { name: "humidity", type: "float" },
    { name: "pressure", type: "float" },
    { name: "latitude", type: "float" },
    { name: "longitude", type: "float" },
    { name: "altitude", type: "float" },
    { name: "last_seen", type: "string" },
    { name: "calibration_date", type: "string" },
    { name: "maintenance_due", type: "string" },
    { name: "owner", type: "string" },
    { name: "department", type: "string" },
    { name: "region", type: "string" },
    { name: "notes", type: "string" },
    { name: "tags", type: "string" },
    { name: "access_key", type: "string" },
    { name: "encryption_enabled", type: "bool" },
];

const config = new FormsConfigBuilder();

fieldDefinitions.forEach(({ name, type }) => {
    const field = new FormsConfigField();
    field.setName(name);
    field.setType(type);
    config.addField(field.build());
});
</script>

<template>
    <Header></Header>
    <FormBuilder
        :config="config.build()"
        @save="(el) => console.log(el)"
    ></FormBuilder>
</template>
