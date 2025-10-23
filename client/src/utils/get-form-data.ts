import {FormState} from "../App";

export const getFormData = (choices: string[], form: FormState) => {
  const trimmedChoices = choices.map((c) => c.trim());
  const validChoices = trimmedChoices.filter(Boolean);
  const defaultValue = form.defaultValue.trim();

  const selected = form.selectedChoices;
  const selectedIndexes =
    selected == null ? [] : Array.isArray(selected) ? selected : [selected];

  const selectedValues = selectedIndexes.map((i) => trimmedChoices[i] || "");

  return { trimmedChoices, validChoices, defaultValue, selectedIndexes, selectedValues };
};