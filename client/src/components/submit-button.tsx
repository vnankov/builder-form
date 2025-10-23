import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";

type SubmitButtonProps = {
  children?: React.ReactNode;
  onClick: () => Promise<void> | void;
  simulateDelay?: boolean; // optional: for demo or local testing
  disabled?: boolean;
};

export const SubmitButton = ({
                                                            children = "Save changes",
                                                            onClick,
                                                            simulateDelay = true,
                                                            disabled = false,
                                                          }: SubmitButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    if (simulateDelay) {
      // Simulate network delay for demo purposes of 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="success"
      onClick={handleClick}
      disabled={disabled || loading}
      sx={{ textTransform: "none", position: "relative", minWidth: 140, height: "32px" }}
    >
      {loading ? (
        <CircularProgress
          size={22}
          color="inherit"
          sx={{
            position: "absolute",
          }}
        />
      ) : (
        children
      )}
    </Button>
  );
};
