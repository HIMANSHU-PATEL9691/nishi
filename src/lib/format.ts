export const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString("en-IN")}`;

export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
