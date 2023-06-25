import TypeKeuring from "@/models/TypeKeuring";
import { Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const CheckboxTypeKeuring = ({ keuring, setKeuring }) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleCheckboxChange = (value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues((prevValues) => prevValues.filter((v) => v !== value));
    } else {
      setSelectedValues((prevValues) => [...prevValues, value]);
    }
  };

  useEffect(() => {
    const updatedKeuring = {
      ...keuring,
      type: selectedValues
        .sort((a, b) => {
          return b.localeCompare(a);
        })
        .join(" + "),
    };
    setKeuring(updatedKeuring);
  }, [keuring, selectedValues, setKeuring]);

  return (
    <CheckboxGroup colorScheme="green">
      <Stack direction="row" ml={5}>
        <Checkbox
          value={TypeKeuring.EPC}
          isChecked={selectedValues.includes(TypeKeuring.EPC)}
          onChange={() => handleCheckboxChange(TypeKeuring.EPC)}
        >
          {TypeKeuring.EPC}
        </Checkbox>
        <Checkbox
          value={TypeKeuring.ASBEST}
          ml={5}
          isChecked={selectedValues.includes(TypeKeuring.ASBEST)}
          onChange={() => handleCheckboxChange(TypeKeuring.ASBEST)}
        >
          {TypeKeuring.ASBEST}
        </Checkbox>
      </Stack>
    </CheckboxGroup>
  );
};

export default CheckboxTypeKeuring;
