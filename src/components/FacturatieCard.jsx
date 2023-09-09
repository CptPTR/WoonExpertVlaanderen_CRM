import Facturatie from "@/models/Facturatie";
import styles from "@/styles/form.module.css";
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
      "emailadres",
      "telefoonnummer",
      "straatnaam",
      "nummer",
      "postcode",
      "gemeente",
    ];

    if (currentFacturatieNaar !== Facturatie.ANDERS) {
      fieldsToReset.forEach((field) => {
        resetField(`facturatie_${field}`);
      });
    } else {
      fieldsToReset.forEach((field) => {
        setValue(`facturatie_${field}`, formValues(field));
      });
    }
  }, [currentFacturatieNaar, formValues, resetField, setValue]);

  useEffect(() => {
    setValue("facturatie_naar", currentFacturatieNaar);
  }, [currentFacturatieNaar, setValue]);

  const handleRadioChange = (e) => {
    setCurrentFacturatieNaar(e.target.value);
  };

  return (
    <GridItem
      // rowSpan={5}
      colSpan={4}
      bg="white"
      boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
    >
      <Card padding="5px 10px 0 10px" height="100%">
        <CardHeader padding="20px">
          <Heading size="sm">Facturatie</Heading>
        </CardHeader>
        <CardBody>
          <RadioGroup
            size="sm"
            colorScheme="green"
            defaultValue={Facturatie.IMMO}
            pl={5}
            pb={5}
          >
            <Stack direction="row">
              <Radio
                id="facturatie_hetzelfde"
                value={Facturatie.HETZELFDE.valueOf()}
                onChange={handleRadioChange}
              >
                {Facturatie.HETZELFDE}
              </Radio>
              <Radio
                id="facturatie_immo"
                value={Facturatie.IMMO.valueOf()}
                onChange={handleRadioChange}
                ml={5}
              >
                {Facturatie.IMMO}
              </Radio>
              <Radio
                id="facturatie_anders"
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
              <MdPerson
                size={32}
                style={{
                  marginLeft: "10px",
                  marginRight: "30px",
                }}
              />
              <InputGroup gap="15px" flexDirection="column" size="sm">
                <Input
                  {...register("facturatie_voornaam")}
                  disabled={
                    currentFacturatieNaar !== Facturatie.ANDERS ? true : false
                  }
                  placeholder="Voornaam"
                />

                <Input
                  {...register("facturatie_familienaam")}
                  disabled={
                    currentFacturatieNaar !== Facturatie.ANDERS ? true : false
                  }
                  defaultValue={
                    currentFacturatieNaar === Facturatie.ANDERS
                      ? formValues("familienaam")
                      : ""
                  }
                  placeholder="Familienaam"
                />
              </InputGroup>
            </ListItem>
            <ListItem className={styles.klant}>
              <MdAlternateEmail
                size={32}
                style={{
                  marginLeft: "10px",
                  marginRight: "30px",
                }}
              />

              <Box width="100%">
                <Input
                  {...register("facturatie_emailadres")}
                  disabled={
                    currentFacturatieNaar !== Facturatie.ANDERS ? true : false
                  }
                  defaultValue={
                    currentFacturatieNaar === Facturatie.ANDERS
                      ? formValues("emailadres")
                      : ""
                  }
                  placeholder="E-mail"
                  size="sm"
                />
              </Box>
            </ListItem>
            <ListItem className={styles.klant}>
              <MdPhone
                size={32}
                style={{
                  marginLeft: "10px",
                  marginRight: "30px",
                }}
              />
              <Box width="100%">
                <InputGroup size="sm">
                  <InputLeftAddon>+32</InputLeftAddon>
                  <Input
                    {...register("facturatie_telefoonnummer")}
                    disabled={
                      currentFacturatieNaar !== Facturatie.ANDERS ? true : false
                    }
                    defaultValue={
                      currentFacturatieNaar === Facturatie.ANDERS
                        ? formValues("telefoonnummer")
                        : ""
                    }
                    placeholder="Telefoonnummer"
                  />
                </InputGroup>
              </Box>
            </ListItem>
            <ListItem className={styles.klant}>
              <MdHome
                size={32}
                style={{
                  marginLeft: "10px",
                  marginRight: "30px",
                }}
              />
              <InputGroup gap={2} size="sm">
                <Input
                  width="75%"
                  {...register("facturatie_straatnaam")}
                  disabled={
                    currentFacturatieNaar !== Facturatie.ANDERS ? true : false
                  }
                  defaultValue={
                    currentFacturatieNaar === Facturatie.ANDERS
                      ? formValues("straatnaam")
                      : ""
                  }
                  placeholder="Straat"
                />

                <Input
                  {...register("facturatie_nummer")}
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
                />
              </InputGroup>
            </ListItem>
            <ListItem className={styles.klant}>
              <MdLocationCity
                size={32}
                style={{
                  marginLeft: "10px",
                  marginRight: "30px",
                }}
              />

              <InputGroup gap={2} size="sm">
                <Input
                  {...register("facturatie_postcode")}
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
                />

                <Input
                  {...register("facturatie_gemeente")}
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
