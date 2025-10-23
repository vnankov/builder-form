import React, {useEffect, useState} from "react";
import {
  Box,
  TextField,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Select,
  FormControl,
  Paper,
} from "@mui/material";
import ChoicesEditor from "./components/choice-editor";
import {Row} from "./components/row";
import {FieldService} from "./services/field-service-api";
import {getFormData} from "./utils/get-form-data";
import {SubmitButton} from "./components/submit-button";

export type FormState = {
  label: string;
  type: "Multi-select" | "Single-select";
  required: boolean;
  defaultValue: string;
  selectedChoices: number[] | number;
  order: "alphabetical" | "custom";
}

export default function App() {
  const [form, setForm] = useState<FormState>(() => {
    const saved = localStorage.getItem("fieldBuilderForm");
    return saved
      ? JSON.parse(saved)
      : {
        label: "",
        type: "Multi-select",
        required: true,
        defaultValue: "",
        order: "alphabetical",
      };
  });
  const [choices, setChoices] = useState<string[]>(() => {
    const saved = localStorage.getItem("fieldBuilderChoices");
    return saved ? JSON.parse(saved) : [''];
  });
  const [errors, setErrors] = useState<{ label?: string; choices?: string }>({});
  const [invalidChoiceIndices, setInvalidChoiceIndices] = useState<number[]>([]);

  // Save to localStorage whenever form changes
  useEffect(() => {
    localStorage.setItem("fieldBuilderForm", JSON.stringify(form));
  }, [form]);

  // Save to localStorage whenever choices change
  useEffect(() => {
    localStorage.setItem("fieldBuilderChoices", JSON.stringify(choices));
  }, [choices]);

  const handleChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({...prev, [field]: value}));
  };

// ✅ Pure validation — only checks, no mutation
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    const {validChoices, defaultValue, selectedIndexes} = getFormData(choices, form);

    // Rule 1: Label required
    if (!form.label.trim()) {
      newErrors.label = "Label is required.";
    }

    // Rule 2: Must have at least one non-empty choice OR a default value
    if (validChoices.length === 0 && !defaultValue) {
      newErrors.choices = "At least one choice or a default value is required.";
    }

    // Rule 3: No duplicate choices
    const hasDuplicates = new Set(validChoices).size !== validChoices.length;
    if (hasDuplicates) {
      newErrors.choices = "Duplicate choices are not allowed.";
    }

    // Rule 4: Max 50 choices
    if (choices.length > 50) {
      newErrors.choices = "You cannot have more than 50 choices.";
    }

    // Rule 5: Selected choices cannot be empty
    const invalidIndices = selectedIndexes.filter((i) => !choices[i]?.trim());
    if (invalidIndices.length > 0) {
      newErrors.choices = "Selected choices cannot be empty.";
      setInvalidChoiceIndices(invalidIndices);
    } else {
      setInvalidChoiceIndices([]);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const preparePayload = () => {
    const {trimmedChoices, selectedValues, defaultValue} = getFormData(choices, form);
    let updatedChoices = [...trimmedChoices];

    // Add default value if missing
    if (defaultValue && !updatedChoices.includes(defaultValue)) {
      updatedChoices.push(defaultValue);
    }

    // Sort alphabetically if needed
    if (form.order === "alphabetical") {
      updatedChoices.sort((a, b) => a.localeCompare(b));
    }

    // Compute updated selected indices
    const updatedSelectedIndices: number[] = selectedValues
      .map((val) => updatedChoices.indexOf(val))
      .filter((i) => i !== -1);

    if (defaultValue) {
      const defaultIndex = updatedChoices.indexOf(defaultValue);
      if (!updatedSelectedIndices.includes(defaultIndex)) {
        updatedSelectedIndices.push(defaultIndex);
      }
    }

    return {
      payload: {
        ...form,
        selectedChoices: updatedSelectedIndices.map((i) => updatedChoices[i]),
        choices: updatedChoices,
      },
      updatedChoices,
      updatedSelectedIndices,
    };
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const {payload, updatedChoices, updatedSelectedIndices} = preparePayload();
      setChoices(updatedChoices);
      setForm((prev) => ({...prev, selectedChoices: updatedSelectedIndices}));

      const data = await FieldService.saveField(payload);
      console.log("Response from server:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClear = () => {
    setForm({
      label: "",
      type: "Multi-select",
      selectedChoices: [],
      required: true,
      defaultValue: "",
      order: "alphabetical",
    });
    setChoices(['']);
    setErrors({});
  };

  return (
    <Paper
      elevation={2}
      sx={{
        maxWidth: 800,
        mx: "auto",
        mt: 4,
        borderRadius: 2,
        border: "1px solid #c4ebf3",
        boxShadow: "none",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          py: 1,
          px: 3,
          backgroundColor: "#d9eef7",
          color: "#226e94",
          borderStartStartRadius: 6,
          borderStartEndRadius: 6,
        }}
      >
        Field Builder
      </Typography>
      <Box display="flex" flexDirection="column" py={3} gap={2} sx={{
        px: {xs: 2, sm: 3, md: 6}
      }}>
        <Row label="Label">
          <TextField
            fullWidth
            size="small"
            value={form.label}
            onChange={(e) => handleChange("label", e.target.value)}
            error={Boolean(errors.label)}
            helperText={errors.label}
          />
        </Row>
        <Row label="Type">
          <Box display="flex" alignItems="center" gap={2}>
            <FormControl fullWidth variant="standard" size="small" sx={{
              "& .MuiSelect-select": {
                fontSize: 18,

              },
              width: "150px",
            }}>
              <Select
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
                disableUnderline
                IconComponent={() => null}
              >
                <MenuItem value="Multi-select">Multi-select</MenuItem>
                <MenuItem value="Single-select">Single-select</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.required}
                  onChange={(e) => handleChange("required", e.target.checked)}
                />
              }
              label="A value is required"
            />
          </Box>
        </Row>
        <Row label="Default Value">
          <TextField
            fullWidth
            size="small"
            value={form.defaultValue}
            onChange={(e) => handleChange("defaultValue", e.target.value)}
          />
        </Row>
        <Row label="Choices">
          <ChoicesEditor
            choices={choices}
            setChoices={setChoices}
            selected={form.selectedChoices}
            setSelected={(selected) => handleChange("selectedChoices", selected)}
            multiple={form.type === "Multi-select"}
            error={errors.choices}
            invalidIndices={invalidChoiceIndices}
          />
        </Row>
        <Row label="Order">
          <FormControl fullWidth size="small">
            <Select
              value={form.order}
              onChange={(e) => handleChange("order", e.target.value)}
            >
              <MenuItem value="alphabetical">
                Display choices in Alphabetical
              </MenuItem>
              <MenuItem value="custom">Unordered</MenuItem>
            </Select>
          </FormControl>
        </Row>
        <Box display="flex" justifyContent="center" gap={2} mt={3}>
          <SubmitButton onClick={handleSave}/>
          <Typography alignSelf='center'>Or</Typography>
          <Button
            color="error"
            sx={{p: 0, textTransform: "none", minWidth: "auto"}}
            onClick={handleClear}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
