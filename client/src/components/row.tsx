import React from "react";
import {Box, Typography} from "@mui/material";

export const Row = ({label, children}: { label: string; children: React.ReactNode }) => (
  <Box display="flex" alignItems="center" gap={2} sx={{
    justifyContent: { xs: 'space-between', sm: 'flex-start' },
  }}>
    <Box width='20%'>
      <Typography fontSize={18}>{label}</Typography>
    </Box>
    <Box sx={{
      width: { xs: '70%', sm: '50%'},
    }}>{children}</Box>
  </Box>
);