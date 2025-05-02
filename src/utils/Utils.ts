import { PAGE_SIZE } from "constant";

export function capitalizeFirstLetter(str: string) {
  if (!str) return ""; // Handle empty or undefined input
  // Remove underscores and capitalize first letter
  str = str.replace(/_/g, " ");
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const getSerialNumber = (index: number, currentPage: number) => {
  return (currentPage - 1) * PAGE_SIZE + index + 1;
};

export const commaSeparator = (number: number) => {
  return number?.toLocaleString("en-IN");
};
