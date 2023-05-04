import { t } from "../..";
import dayjs from "dayjs";

function formatDateTime(date: Date, showTime?: boolean) {
  return (
    dayjs(date).format("MMMM D, YYYY") +
    (showTime ? ` ${t("t.at")} ` + dayjs(date).format("h:mmA") : "")
  );
}

export { formatDateTime as default, formatDateTime };
