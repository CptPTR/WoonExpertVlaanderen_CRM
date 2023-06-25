"use client";

import styles from "@/app/(dashboard)/keuringen/[id]/keuring.module.css";
import CheckboxTypeKeuring from "@/components/CheckboxTypeKeuring";
import Dropzone from "@/components/Dropzone";
import RadioGroupFacturatie from "@/components/RadioGroupFacturatie";
import Facturatie from "@/models/Facturatie";
import Status from "@/models/Status";
import ToegangEenheid from "@/models/ToegangEenheid";
import TypeKeuring from "@/models/TypeKeuring";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Heading,
  Input,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import { Roboto } from "next/font/google";
import { useCallback, useState } from "react";
import {
  MdAlternateEmail,
  MdDelete,
  MdHome,
  MdLocationCity,
  MdPerson,
  MdPhone,
} from "react-icons/md";

const roboto900 = Roboto({ subsets: ["latin"], weight: "900" });

const Nieuw = () => {
  const [keuring, setKeuring] = useState({
    klant: {},
    adres: {},
    immo: {},
    extraDocumenten: [],
    toegangEenheid: ToegangEenheid.KLANT,
    type: TypeKeuring.EPC,
    status: Status.INGEPLAND,
    facturatie: {
      naar: Facturatie.HETZELFDE,
    },
    energiedeskundige: "",
    certificaat: "",
  });

  const handleOnToegangEenheidRadioChange = (value) => {
    setKeuring({ ...keuring, toegangEenheid: value });
  };

  const removeFiles = (from) => {
    if (from == "extradocs") {
      setKeuring((previousKeuring) => ({
        ...previousKeuring,
        extraDocumenten: [],
      }));
    } else {
      setKeuring((previousKeuring) => ({
        ...previousKeuring,
        certificaat: {},
      }));
    }
  };

  return (
    <main>
      <div>
        {
          <header>
            <h1 className={`${roboto900.className} ${styles.title}`}>
              NIEUWE KEURING
            </h1>
            <Button colorScheme="green">OPSLAAN</Button>
          </header>
        }
        <Grid
          h="750px"
          templateRows="repeat(12, 1fr)"
          templateColumns="repeat(12, 1fr)"
          gap={30}
        >
          <GridItem
            rowSpan={7}
            colSpan={4}
            bg="white"
            boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
            position={"relative"}
          >
            <Card padding="16px 24px" height="100%">
              <CardHeader padding="20px 20px 10px 20px">
                <Heading size="md">Klant</Heading>
              </CardHeader>
              <CardBody>
                <List>
                  <ListItem className={styles.klant}>
                    <MdPerson size={24} style={{ margin: "0 20px" }} />

                    <Input
                      placeholder="Voornaam"
                      width="150px"
                      height="27px"
                      fontSize="16px"
                      onBlur={(e) =>
                        setKeuring({
                          ...keuring,
                          klant: {
                            ...keuring.klant,
                            voornaam: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Familienaam"
                      width="175px"
                      height="27px"
                      fontSize="16px"
                      onBlur={(e) =>
                        setKeuring({
                          ...keuring,
                          klant: {
                            ...keuring.klant,
                            achternaam: e.target.value,
                          },
                        })
                      }
                    />
                  </ListItem>
                  <ListItem className={styles.klant}>
                    <MdAlternateEmail size={24} style={{ margin: "0 20px" }} />

                    <Input
                      placeholder="E-mail"
                      type="email"
                      width="325px"
                      height="27px"
                      fontSize="16px"
                      onBlur={(e) =>
                        setKeuring({
                          ...keuring,
                          klant: {
                            ...keuring.klant,
                            email: e.target.value,
                          },
                        })
                      }
                    />
                  </ListItem>
                  <ListItem className={styles.klant}>
                    <MdPhone size={24} style={{ margin: "0 20px" }} />

                    <Input
                      placeholder="Telefoonnummer"
                      type="tel"
                      width="325px"
                      height="27px"
                      fontSize="16px"
                      onBlur={(e) =>
                        setKeuring({
                          ...keuring,
                          klant: {
                            ...keuring.klant,
                            telefoonnummer: e.target.value,
                          },
                        })
                      }
                    />
                  </ListItem>
                </List>
              </CardBody>
              <CardHeader padding="20px 20px 10px 20px">
                <Heading size="md">Adres</Heading>
              </CardHeader>
              <CardBody>
                <List>
                  {keuring && (
                    <>
                      <ListItem className={styles.adres}>
                        <MdHome size={24} style={{ margin: "0 20px" }} />

                        <Input
                          placeholder="Straatnaam"
                          type="text"
                          width="250px"
                          height="27px"
                          fontSize="16px"
                          onBlur={(e) =>
                            setKeuring({
                              ...keuring,
                              adres: {
                                ...keuring.adres,
                                straat: e.target.value,
                              },
                            })
                          }
                        />
                        <Input
                          placeholder="Nr"
                          type="number"
                          width="75px"
                          height="27px"
                          fontSize="16px"
                          onBlur={(e) =>
                            setKeuring({
                              ...keuring,
                              adres: {
                                ...keuring.adres,
                                nummer: +e.target.value,
                              },
                            })
                          }
                        />
                      </ListItem>
                      <ListItem className={styles.adres}>
                        <MdLocationCity
                          size={24}
                          style={{ margin: "0 20px" }}
                        />

                        <Input
                          placeholder="Postcode"
                          type="number"
                          width="100px"
                          height="27px"
                          fontSize="16px"
                          onBlur={(e) =>
                            setKeuring({
                              ...keuring,
                              adres: {
                                ...keuring.adres,
                                postcode: +e.target.value,
                              },
                            })
                          }
                        />
                        <Input
                          placeholder="Gemeente"
                          width="225px"
                          height="27px"
                          fontSize="16px"
                          onBlur={(e) =>
                            setKeuring({
                              ...keuring,
                              adres: {
                                ...keuring.adres,
                                gemeente: e.target.value,
                              },
                            })
                          }
                        />
                      </ListItem>
                    </>
                  )}
                </List>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem
            rowSpan={7}
            colSpan={4}
            bg="white"
            boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
          >
            <Card padding="16px 24px" height="100%">
              <CardHeader padding="20px 20px 10px 20px">
                <Heading size="md">Facturatie</Heading>
                <RadioGroupFacturatie
                  keuring={keuring}
                  setKeuring={setKeuring}
                />
              </CardHeader>
            </Card>
          </GridItem>
          <GridItem
            rowSpan={7}
            colSpan={4}
            bg="white"
            boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
          >
            <Card height="100%">
              <div className={styles.editIconsContainer}>
                <Tooltip
                  label="Verwijder alle documenten"
                  placement="bottom-end"
                >
                  <div
                    className={styles.editIconContainer}
                    onClick={() => removeFiles("extradocs")}
                  >
                    <MdDelete className={styles.editIcon} size={24} />
                  </div>
                </Tooltip>
              </div>
              <CardHeader padding="36px 44px">
                <Heading size="md">Extra documenten</Heading>
              </CardHeader>
              <Dropzone
                keuring={keuring}
                setKeuring={setKeuring}
                forFiles="extradocs"
                acceptFileType="images"
                multipleFiles
                text="Sleep hier afbeeldingen/PDF-bestanden naartoe, of klik om ze te selecteren."
              />
            </Card>
          </GridItem>

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
                  value={keuring.toegangEenheid}
                  ml={5}
                >
                  <Radio value={ToegangEenheid.KLANT} colorScheme="green">
                    {ToegangEenheid.KLANT}
                  </Radio>
                  <Radio
                    value={ToegangEenheid.SLEUTEL_OPHALEN}
                    colorScheme="green"
                  >
                    {ToegangEenheid.SLEUTEL_OPHALEN}
                  </Radio>
                </RadioGroup>
                <Heading size="md" mt="40px" mb="30px">
                  Type
                </Heading>

                <CheckboxTypeKeuring
                  keuring={keuring}
                  setKeuring={setKeuring}
                />
              </CardBody>
            </Card>
          </GridItem>
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
                  height="100px"
                  fontSize="16px"
                  padding="10px"
                  resize="none"
                  borderRadius="5px"
                  borderColor="blackAlpha.500"
                  onBlur={useCallback(
                    (e) => {
                      setKeuring({ ...keuring, opmerking: e.target.value });
                    },
                    [keuring]
                  )}
                />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem
            rowSpan={5}
            colSpan={4}
            bg="white"
            boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
          >
            <Card padding="16px 24px" height="100%">
              <div className={styles.editIconsContainer}>
                <Tooltip label="Verwijder certificaat" placement="bottom-end">
                  <div
                    className={styles.editIconContainer}
                    onClick={() => removeFiles("certificaat")}
                  >
                    <MdDelete className={styles.editIcon} size={24} />
                  </div>
                </Tooltip>
              </div>
              <CardHeader padding="20px 20px 10px 20px">
                <Heading size="md">Energiecertificaat</Heading>
              </CardHeader>
              <Dropzone
                keuring={keuring}
                setKeuring={setKeuring}
                forFiles="certificaat"
                acceptFileType="pdf"
                text="Sleep hier een PDF-bestand naartoe, of klik om een bestand te selecteren"
              />
            </Card>
          </GridItem>
        </Grid>
      </div>
    </main>
  );
};

export default Nieuw;
