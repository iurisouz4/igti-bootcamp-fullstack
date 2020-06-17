import React from "react";

export default function SalaryBar({ value, color }) {
  return (
    <div
      style={{
        marginTop: "40px",
        width: value + "%",
        height: "20px",
        backgroundColor: color,
      }}
    />
  );
}
