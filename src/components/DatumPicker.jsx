import styles from "@/styles/datepicker.module.css";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";

const DatumPicker = ({ setValue, control, defaultValue, setIsEventChosen }) => {
  const [startDate, setStartDate] = useState();

  useEffect(() => {
    if (defaultValue) {
      setStartDate(new Date(defaultValue));
    } else {
      setStartDate(null);
    }
  }, [defaultValue]);

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start">
      <Box>
        <Controller
          name="datumPlaatsbezoek"
          control={control}
          defaultValue={startDate}
          render={({ field }) => (
            <DatePicker
              className={
                !startDate
                  ? `${styles.nodate} ${styles["nodate-placeholder"]}`
                  : styles.date
              }
              selected={field.value ? new Date(field.value) : null}
              placeholderText="Geen datum geselecteerd"
              filterDate={isWeekday}
              timeIntervals={15}
              calendarStartDay={1}
              minTime={new Date().setHours(7, 0, 0, 0)}
              maxTime={new Date().setHours(19, 0, 0, 0)}
              isClearable
              dateFormat="dd/MM/yyyy h:mm aa"
              showTimeSelect
              onChange={(date) => {
                setStartDate(date);
                setValue("datumPlaatsbezoek", date);
                setIsEventChosen(true);
              }}
            />
          )}
        />
      </Box>
    </Box>
  );
};

export default DatumPicker;
