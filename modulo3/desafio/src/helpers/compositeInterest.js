export default function getCompositeInterest(value, interest, period) {
  const V = value;
  const i = interest / 100;
  const p = period;
  return (V * Math.pow(1 + i, p)).toFixed(2);
}

export function calculatePercentage(baseValue, value) {
  return ((value * 100) / baseValue).toFixed(2);
}
