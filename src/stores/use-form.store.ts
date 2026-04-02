import type { FieldType } from "@/core/forms/field.type";
import type { IConfigSchema } from "@/core/forms/interfaces/config.schema.interface";
import { defineStore } from "pinia";

export type FormStoreState =
  | {
      config: IConfigSchema;
      isVisible: true;
      handlers: {
        save: (obj: Record<string, FieldType | undefined>) => void;
        close?: () => void;
      };
    }
  | {
      isVisible: false;
      config?: undefined;
      handlers?: undefined;
    };

export const useForm = defineStore("form", {
  state(): FormStoreState {
    return {
      config: undefined,
      isVisible: false,
    };
  },

  actions: {
    open(config: IConfigSchema, handlers: FormStoreState["handlers"]) {
      this.config = config;
      this.isVisible = true;
      this.handlers = handlers;
    },
    hide() {
      this.config = undefined;
      this.isVisible = false;
      this.handlers = undefined;
    },
  },
});
