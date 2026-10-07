import { z } from "zod";
import { emergencyFields, bloodTypes } from "../constants/fields";
import { localToday } from "../../../../shared/date";
export const formSchema = z.object(
  Object.fromEntries(
    emergencyFields.map(({ name, label, required, type, maxLength }) => {
      let rule = z
        .string()
        .trim()
        .max(maxLength, "Reduce la cantidad de texto.");
      if (required) rule = rule.min(1, `Completa ${label.toLowerCase()}.`);
      if (type === "select")
        rule = rule.refine(
          (value) => value === "" || bloodTypes.includes(value),
          "Selecciona un tipo de sangre valido.",
        );
      if (type === "date")
        rule = rule.refine((value) => {
          if (!value) return true;
          const date = new Date(`${value}T00:00:00Z`);
          return (
            /^\d{4}-\d{2}-\d{2}$/.test(value) &&
            !Number.isNaN(date.getTime()) &&
            date.toISOString().slice(0, 10) === value &&
            value <= localToday()
          );
        }, "Ingresa una fecha de nacimiento valida que no sea futura.");
      return [name, rule];
    }),
  ),
);
