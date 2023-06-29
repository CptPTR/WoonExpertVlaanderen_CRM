import { Card, CardHeader, GridItem, Heading } from "@chakra-ui/react";
import RadioGroupFacturatie from "../Facturatie/RadioGroupFacturatie";

const FacturatieCard = ({ keuring, setKeuring }) => {
  return (
    <GridItem
      rowSpan={7}
      colSpan={4}
      bg="white"
      boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
    >
      <Card padding="16px 24px" height="100%">
        <CardHeader padding="20px 20px 10px 20px">
          <Heading size="md">Facturatie</Heading>
          <RadioGroupFacturatie keuring={keuring} setKeuring={setKeuring} />
        </CardHeader>
      </Card>
    </GridItem>
  );
};

export default FacturatieCard;
