import {
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Textarea,
} from "@chakra-ui/react";
import React, { useCallback } from "react";

const ExtraOpmerkingenCard = ({ keuring, setKeuring }) => {
  return (
    <GridItem
      rowSpan={5}
      colSpan={5}
      bg="white"
      boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
    >
      <Card padding="16px 24px" height="100%">
        <CardHeader padding="20px 20px 10px 20px">
          <Heading size="md">Extra opmerkingen</Heading>
        </CardHeader>
        <CardBody height={"100%"}>
          <Textarea
            width="100%"
            height="200px"
            fontSize="16px"
            padding="10px"
            resize="none"
            borderRadius="5px"
            borderColor="blackAlpha.500"
            onBlur={useCallback(
              (e) => {
                setKeuring({ ...keuring, opmerking: e.target.value });
              },
              [keuring, setKeuring]
            )}
          />
        </CardBody>
      </Card>
    </GridItem>
  );
};

export default ExtraOpmerkingenCard;
