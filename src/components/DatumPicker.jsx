import Status from "@/models/Status";
import styles from "@/styles/datepicker.module.css";
import { Box, Button, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";

const DatumPicker = ({
  setValue,
  getValues,
  control,
  defaultValue,
  plaatsbezoekEventId,
  plaatsbezoekEventIdAsbest,
}) => {
  const [startDate, setStartDate] = useState();
  const [isEventDateChosen, setIsEventDateChosen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const addEvent = async () => {
    setIsLoading(true);

    console.log("FETCH NOW");
    try {
      if (plaatsbezoekEventId) {
        deleteEvent(
          plaatsbezoekEventId,
          process.env.NEXT_PUBLIC_GMAIL_EPC_ASBEST
        );
      }

      if (plaatsbezoekEventIdAsbest) {
        deleteEvent(
          plaatsbezoekEventIdAsbest,
          process.env.NEXT_PUBLIC_GMAIL_ASBEST
        );
      }

      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voornaam: getValues("voornaam"),
          familienaam: getValues("familienaam"),
          emailadres: getValues("emailadres"),
          telefoonnummer: getValues("telefoonnummer"),
          straatnaam: getValues("straatnaam"),
          nummer: getValues("nummer"),
          postcode: getValues("postcode"),
          gemeente: getValues("gemeente"),
          type: getValues("type"),
          datumPlaatsbezoek: getValues("datumPlaatsbezoek"),
        }),
      });

      const responseData = await response.json();

      if (responseData.resolveObject.event_id !== "") {
        setValue("plaatsbezoekEventId", responseData.resolveObject.event_id);
        setIsEventDateChosen(false);
      }

      if (responseData.resolveObject.event_id_asbest !== "") {
        setValue(
          "plaatsbezoekEventIdAsbest",
          responseData.resolveObject.event_id_asbest
        );
        setIsEventDateChosen(false);
      }
      setValue("status", Status.INGEPLAND);
    } catch (error) {
      console.error("Fetch error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (eventId, calendar) => {
    try {
      const evId = eventId;

      if (calendar == process.env.NEXT_PUBLIC_GMAIL_EPC_ASBEST) {
        if (!eventId) {
          console.error("Event ID is undefined");
        }

        const response = await fetch(`/api/events/${evId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          console.log("Event deleted successfully");
        } else {
          console.error("Error deleting event: ", response.statusText);
        }
      }

      if (calendar == process.env.NEXT_PUBLIC_GMAIL_ASBEST) {
        if (!evId) {
          console.error("Event ID Asbest is undefined");
        }

        const responseAsbest = await fetch(`/api/events/asbest/${evId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (responseAsbest.ok) {
          console.log("Event deleted successfully");
        } else {
          console.error("Error deleting event: ", responseAsbest.statusText);
        }
      }
    } catch (error) {
      console.error("Error: ", error);
    }
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
                setIsEventDateChosen(true);
              }}
            />
          )}
        />
      </Box>
      {isLoading ? (
        <Spinner />
      ) : (
        <Button
          mt={1}
          onClick={addEvent}
          isDisabled={!startDate || !isEventDateChosen}
        >
          <Text fontSize="sm">Toevoegen aan agenda</Text>
        </Button>
      )}
    </Box>
  );
};

export default DatumPicker;
