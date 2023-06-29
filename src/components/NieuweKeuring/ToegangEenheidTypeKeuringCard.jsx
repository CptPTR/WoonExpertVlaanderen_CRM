import {
  Card,
  GridItem,
  CardHeader,
  CardBody,
  RadioGroup,
  Radio,
  Heading,
} from "@chakra-ui/react";
import CheckboxTypeKeuring from "../CheckboxTypeKeuring";
import ToegangEenheid from "@/models/ToegangEenheid";

const ToegangEenheidTypeKeuringCard = ({ keuring, setKeuring }) => {
  const handleOnToegangEenheidRadioChange = (value) => {
    setKeuring({ ...keuring, toegang_eenheid: value });
  };

  return (
    <GridItem
      rowSpan={5}
      colSpan={3}
      bg="white"
      boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
    >
      <Card padding="16px 24px" height="100%">
        <CardHeader padding="20px 20px 10px 20px">
          <Heading size="md">Toegang eenheid</Heading>
        </CardHeader>
        <CardBody>
          <RadioGroup
            name="Toegang eenheid"
            onChange={handleOnToegangEenheidRadioChange}
            value={keuring.toegang_eenheid}
            ml={5}
          >
            <Radio value={ToegangEenheid.KLANT} colorScheme="green">
              {ToegangEenheid.KLANT}
            </Radio>
            <Radio value={ToegangEenheid.SLEUTEL_OPHALEN} colorScheme="green">
              {ToegangEenheid.SLEUTEL_OPHALEN}
            </Radio>
          </RadioGroup>
          <Heading size="md" mt="40px" mb="30px">
            Type
          </Heading>
          <CheckboxTypeKeuring setKeuring={setKeuring} />
        </CardBody>
      </Card>
    </GridItem>
  );
};

export default ToegangEenheidTypeKeuringCard;
