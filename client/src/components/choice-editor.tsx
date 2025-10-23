import React from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
  Button,
  Paper,
  Checkbox,
  Radio,
} from "@mui/material";
import {Add, Remove} from "@mui/icons-material";

interface ChoicesEditorProps {
  choices: string[];
  setChoices: (choices: string[]) => void;
  selected: number[] | number;
  setSelected: (selected: number[] | number) => void;
  multiple: boolean;
  error?: string;
  invalidIndices?: number[];
}

export default function ChoicesEditor({
                                        choices,
                                        setChoices,
                                        selected,
                                        setSelected,
                                        multiple,
                                        error,
                                        invalidIndices,
                                      }: ChoicesEditorProps) {
  const handleChange = (index: number, value: string) => {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);
  };

  const handleAdd = () => {
    if (choices.length >= 50) return;
    setChoices([...choices, ""]);
  };

  const handleRemove = (index: number) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  const isDuplicate = (value: string, index: number) => {
    return choices.some((c, i) => i !== index && c.trim() === value.trim() && value.trim() !== "");
  };

  const isTooLongName = (value: string) => {
    return value.length > 40;
  };

  const handleSelect = (index: number) => {
    if (multiple) {
      const arr = Array.isArray(selected) ? [...selected] : [];
      if (arr.includes(index)) {
        setSelected(arr.filter((i) => i !== index));
      } else {
        setSelected([...arr, index]);
      }
    } else {
      setSelected(index);
    }
  };

  const isSelected = (index: number) =>
    multiple
      ? Array.isArray(selected) && selected.includes(index)
      : selected === index;

  return (
    <Box>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 1,
          borderColor: "#c4ebf3",
          p: 1,
          maxHeight: 220,
          overflowY: "auto",
          backgroundColor: "#fafafa",
        }}
      >
        <List dense disablePadding>
          {choices.map((choice, index) => (
            <ListItem
              key={index}
              disableGutters
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                py: 0.5,
                cursor: "pointer",
                "&:hover": {backgroundColor: "#eef8fb"},
              }}
              onClick={() => handleSelect(index)}
            >
              {multiple ? (
                <Checkbox
                  checked={isSelected(index)}
                  onChange={() => handleSelect(index)}
                  disabled={isDuplicate(choice, index)}
                />
              ) : (
                <Radio
                  checked={isSelected(index)}
                  onChange={() => handleSelect(index)}
                  disabled={isDuplicate(choice, index)}
                />
              )}
              <TextField
                fullWidth
                size="small"
                value={choice}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder={`Choice ${index + 1}`}
                onClick={(e) => e.stopPropagation()}
                error={isDuplicate(choice, index) || invalidIndices?.includes(index) || isTooLongName(choice)}
              />
              <IconButton
                color="error"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                disabled={choices.length === 1}
              >
                <Remove fontSize="small"/>
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Button
        startIcon={<Add/>}
        onClick={handleAdd}
        sx={{
          mt: 1.5,
          textTransform: "none",
          fontWeight: 500,
          color: "#226e94",
        }}
        disabled={choices.length >= 50}
      >
        Add choice
      </Button>

      {error && (
        <Typography variant="body2" color="error" mt={0.5}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
