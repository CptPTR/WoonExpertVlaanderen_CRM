import Status from "@/models/Status";
import styles from "@/styles/datepicker.module.css";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatumPicker = ({ setValue, getValues }) => {
  const [startDate, setStartDate] = useState(null);

  useEffect(() => {
    if (getValues("datumPlaatsbezoek")) {
      const datumPlaatsbezoek = new Date(getValues("datumPlaatsbezoek"));
      setStartDate(datumPlaatsbezoek);
    }
  }, [getValues]);

  useEffect(() => {
    if (startDate) {
      setValue("datumPlaatsbezoek", startDate);
      setValue("status", Status.INGEPLAND);
    }
  }, [setValue, startDate]);

  return (
    <>
      <DatePicker
        className={
          !startDate
            ? `${styles.nodate} ${styles["nodate-placeholder"]}`
            : styles.date
        }
        placeholderText="Geen datum geselecteerd"
        isClearable
        showTimeSelect
        dateFormat="dd/MM/yyyy h:mm aa"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />
    </>
  );
};

export default DatumPicker;
