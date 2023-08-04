import TypeKeuring from "@/models/TypeKeuring";
import { Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

const CheckboxTypeKeuring = ({ control, typeKeuring }) => {
  const [selectedValues, setSelectedValues] = useState(
    typeKeuring ? typeKeuring.replaceAll(" ", "").split("+") : []
  );

  useEffect(() => {
    setSelectedValues((prevValues) => {
      const newValues = prevValues.filter((value) =>
        Object.values(TypeKeuring).includes(value)
      );
      return newValues;
    });
  }, []);

  const debouncedCheckboxChange = debounce((values) => {
    setSelectedValues(values);
  }, 100);

  const sortValues = (values) => {
    return values.sort().reverse();
  };

  return (
    <Controller
      name="type"
      control={control}
      render={({ field }) => (
        <CheckboxGroup
          colorScheme="green"
          onChange={(values) => {
            debouncedCheckboxChange(values);
            field.onChange(sortValues(values).join(" + "));
          }}
          value={selectedValues}
        >
          <Stack ml={15} gap={0}>
            {Object.values(TypeKeuring).map((value) => (
              <Checkbox
                key={value}
                value={value}
                isChecked={selectedValues.includes(value)}
              >
                {value}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      )}
    />
  );
};

export default CheckboxTypeKeuring;
