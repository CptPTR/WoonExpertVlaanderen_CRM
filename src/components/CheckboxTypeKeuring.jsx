import TypeKeuring from "@/models/TypeKeuring";
import { Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

const CheckboxTypeKeuring = ({ control, typeKeuring, setValue, getValues }) => {
  const [selectedValues, setSelectedValues] = useState(
    typeKeuring ? typeKeuring.replaceAll(" ", "").split("+") : []
  );

  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  useEffect(() => {
    setSelectedValues((prevValues) => {
      const newValues = prevValues.filter((value) =>
        Object.values(TypeKeuring).includes(value)
      );
      return newValues;
    });
  }, []);

  useEffect(() => {
    const deleteCertificaat = async (typeCert) => {
      if (typeCert) {
        const { error: certificaatError } = await supabase
          .from("Certificaat")
          .delete()
          .eq(
            "id",
            typeCert == TypeKeuring.EPC
              ? getValues("certificaat_epc")
              : getValues("certificaat_asbest")
          );

        if (certificaatError) {
          console.error(
            "Error (CheckboxTypeKeuring) verwijderen van certificaat: ",
            certificaatError
          );
        }
      }

      if (!selectedValues.includes(TypeKeuring.EPC)) {
        deleteCertificaat(TypeKeuring.EPC);
        setValue("certificaat_epc", "");
      }
      if (!selectedValues.includes(TypeKeuring.ASBEST)) {
        deleteCertificaat(TypeKeuring.ASBEST);
        setValue("certificaat_asbest", "");
      }
    };
  }, [getValues, selectedValues, setValue, supabase]);

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
            setSelectedValues(values);
            field.onChange(sortValues(values).join(" + "));
          }}
          value={selectedValues}
          size="sm"
        >
          <Stack gap={0}>
            {Object.values(TypeKeuring).map((value) => (
              <Checkbox
                size="sm"
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
