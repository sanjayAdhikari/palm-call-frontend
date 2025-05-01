import moment from "moment";

export const PAGE_SIZE = 10;
export const DEFAULT_FROM_DATE = moment()
  .subtract(7, "days")
  .format("YYYY-MM-DD");
export const DEFAULT_TO_DATE = moment().format("YYYY-MM-DD");
