import Facturatie from "@/models/Facturatie";
import styles from "@/styles/nieuwekeuringform.module.css";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  MdAlternateEmail,
  MdHome,
  MdLocationCity,
  MdPerson,
  MdPhone,
} from "react-icons/md";

const FacturatieCard = ({ register, formValues, setValue, resetField }) => {
  const [currentFacturatieNaar, setCurrentFacturatieNaar] = useState(
    Facturatie.IMMO
  );

  useEffect(() => {
    const fieldsToReset = [
      "voornaam",
      "familienaam",
      "email",
      "telefoonnummer",
      "straatnaam",
      "nummer",
      "postcode",
      "gemeente",
    ];

    if (currentFacturatieNaar !== Facturatie.ANDERS) {
      fieldsToReset.forEach((field) => {
        resetField(`facturatie.${field}`);
      });
    } else {
      fieldsToReset.forEach((field) => {
        setValue(`facturatie.${field}`, formValues(field));
      });
    }
  }, [currentFacturatieNaar, formValues, resetField, setValue]);

  useEffect(() => {
    setValue("facturatie.naar", currentFacturatieNaar);
  }, [currentFacturatieNaar, setValue]);

  const handleRadioChange = (e) => {
    setCurrentFacturatieNaar(e.target.value);
  };

  return (
    <GridItem
      rowSpan={5}
      colSpan={4}
      bg="white"
      boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
    >
      <Card padding="5px 10px 0 10px" height="100%">
        <CardHeader padding="20px">
          <Heading size="md">Facturatie</Heading>
        </CardHeader>
        <CardBody>
          <RadioGroup
            colorScheme="green"
            defaultValue={Facturatie.IMMO}
            pl={5}
            pb={5}
          >
            <Stack direction="row">
              <Radio
                value={Facturatie.HETZELFDE.valueOf()}
                onChange={handleRadioChange}
              >
                {Facturatie.HETZELFDE}
              </Radio>
              <Radio
                value={Facturatie.IMMO.valueOf()}
                onChange={handleRadioChange}
                ml={5}
              >
                {Facturatie.IMMO}
              </Radio>
              <Radio
                value={Facturatie.ANDERS.valueOf()}
                onChange={handleRadioChange}
                ml={5}
              >
                {Facturatie.ANDERS}
              </Radio>
            </Stack>
          </RadioGroup>

          <List>
            <ListItem className={styles.klant}>
              <MdPerson size={30} style={{ margin: "5px 30px 5px 10px" }} />
              <InputGroup gap="15px" flexDirection="column">
                <Input
                  {...register("facturatie.voornaam")}
                  disabled={
                    currentFacturatieNaar !== Facturatie.ANDERS ? true : false
                  }
                  placeholder="Voornaam"
                  fontSize="16px"
                />

                <Input
                  {...register("facturatie.familienaam")}
                  disabled={
                    currentFacturatieNaar !== Facturatie.ANDERS ? true : false
                  }
                  defaultValue={
                    currentFacturatieNaar === Facturatie.ANDERS
                      ? formValues("familienaam")
                      : ""
                  }
                  placeholder="Familienaam"
                  fontSize="16px"
                />
              </InputGroup>
            </ListItem>
            <ListItem className={styles.klant}>
              <MdAlternateEmail
                size={30}
                style={{ margin: "5px 30px 5px 10px" }}
              />

              <Box width="100%">
                <Input
                  {...register("facturatie.email")}
                  disabled={
                    currentFacturatieNaar !== Facturatie.ANDERS ? true : false
                  }
                  defaultValue={
                    currentFacturatieNaar === Facturatie.ANDERS
                      ? formValues("email")
                      : ""
                  }
                  placeholder="E-mail"
                  fontSize="16px"
                />
              </Box>
            </ListItem>
            <ListItem className={styles.klant}>
              <MdPhone size={30} style={{ margin: "5px 30px 5px 10px" }} />

              <Box width="100%">
                <InputGroup>
                  {/* eslint-disable-next-line react/no-children-prop */}
                  <InputLeftAddon children="+32" />
                  <Input
                    {...register("facturatie.telefoonnummer")}
                    disabled={
                      currentFacturatieNaar !== Facturatie.ANDERS ? true : false
                    }
                    defaultValue={
                      currentFacturatieNaar === Facturatie.ANDERS
                        ? formValues("telefoonnummer")
                        : ""
                    }
                    placeholder="Telefoonnummer"
                    fontSize="16px"
                  />
                </InputGroup>
              </Box>
            </ListItem>
            <ListItem className={styles.klant}>
              <MdHome size={30} style={{ margin: "5px 30px 5px 10px" }} />
              <InputGroup gap={2}>
                <Input
                  width="75%"
                  {...register("facturatie.straatnaam")}
                  disabled={
                    currentFacturatieNaar !== Facturatie.ANDERS ? true : false
                  }
                  defaultValue={
                    currentFacturatieNaar === Facturatie.ANDERS
                      ? formValues("straatnaam")
                      : ""
                  }
                  placeholder="Straat"
                  fontSize="16px"
                />

                <Input
                  {...register("facturatie.nummer")}
                  disabled={
                    currentFacturatieNaar !== Facturatie.ANDERS ? true : false
                  }
                  defaultValue={
                    currentFacturatieNaar === Facturatie.ANDERS
                      ? formValues("nummer")
                      : ""
                  }
                  width="25%"
                  placeholder="Nr"
                  fontSize="16px"
                />
              </InputGroup>
            </ListItem>
            <ListItem className={styles.klant}>
              <MdLocationCity
                size={30}
                style={{ margin: "5px 30px 5px 10px" }}
              />

              <InputGroup gap={2}>
                <Input
                  {...register("facturatie.postcode")}
                  disabled={
                    currentFacturatieNaar !== Facturatie.ANDERS ? true : false
                  }
                  defaultValue={
                    currentFacturatieNaar === Facturatie.ANDERS
                      ? formValues("postcode")
                      : ""
                  }
                  width="30%"
                  placeholder="Postcode"
                  fontSize="16px"
                />

                <Input
                  {...register("facturatie.gemeente")}
                  disabled={
                    currentFacturatieNaar !== Facturatie.ANDERS ? true : false
                  }
                  defaultValue={
                    currentFacturatieNaar === Facturatie.ANDERS
                      ? formValues("gemeente")
                      : ""
                  }
                  width="70%"
                  placeholder="Gemeente"
                  fontSize="16px"
                />
              </InputGroup>
            </ListItem>
          </List>
        </CardBody>
      </Card>
    </GridItem>
  );
};

export default FacturatieCard;
