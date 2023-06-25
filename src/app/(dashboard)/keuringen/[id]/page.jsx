"use client";

import { Roboto } from "next/font/google";
import { useCallback, useEffect, useState } from "react";
import { FaHandshake } from "react-icons/fa";
import { GiHouseKeys } from "react-icons/gi";
import {
  MdAlternateEmail,
  MdDelete,
  MdDownload,
  MdEdit,
  MdHome,
  MdLocationCity,
  MdPerson,
  MdPhone,
} from "react-icons/md";

import Dropzone from "@/components/Dropzone";
import Status from "@/models/Status";
import ToegangEenheid from "@/models/ToegangEenheid";
import TypeKeuring from "@/models/TypeKeuring";

import styles from "@/app/(dashboard)/keuringen/[id]/keuring.module.css";
import {
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Heading,
  Input,
  List,
  ListItem,
  Tag,
  TagLabel,
  Text,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";

const roboto900 = Roboto({ subsets: ["latin"], weight: "900" });

const Keuring = ({ params }) => {
  const [editMode, setEditMode] = useState(false);
  const [keuring, setKeuring] = useState(null);

  useEffect(() => {
    const keuringen = [
      {
        id: 0,
        datumToewijzing: new Date(),
        datumPlaatsbezoek: new Date(2023, 8, 7, 10, 30),
        klant: {
          id: 1,
          voornaam: "Peter",
          achternaam: "De Clercq",
          email: "dclercqpeter@gmail.com",
          telefoonnummer: "0492316422",
        },
        adres: {
          id: 1,
          straat: "Populierenstraat",
          nummer: 4,
          gemeente: "Sint-Katelijne-Waver",
          postcode: 2860,
        },
        immo: {
          id: 1,
          naam: "Vastgoed Heylen",
        },
        extraDocumenten: [],
        toegangEenheid: ToegangEenheid.KLANT,
        type: TypeKeuring.EPC,
        status: Status.INGEPLAND,
        energiedeskundige: "Bob",
        certificaat: false,
      },
      {
        id: 1,
        datumToewijzing: new Date(),
        datumPlaatsbezoek: new Date(2023, 8, 14, 14, 0),
        klant: {
          id: 1,
          voornaam: "Emma",
          achternaam: "Plots",
          email: "emma.plots@gmail.com",
          telefoonnummer: "0492521644",
        },
        adres: {
          id: 2,
          straat: "Antwerpsesteenweg",
          nummer: 52,
          gemeente: "Mechelen",
          postcode: 2800,
        },
        immo: {
          id: 1,
          naam: "Vastgoed Heylen",
        },
        extraDocumenten: [],
        toegangEenheid: ToegangEenheid.KLANT,
        type: TypeKeuring.ASBEST,
        status: Status.IN_BEHANDELING,
        energiedeskundige: "Bob",
        certificaat: true,
      },
      {
        id: 2,
        datumToewijzing: new Date(),
        datumPlaatsbezoek: new Date(2023, 8, 5, 10, 15),
        klant: {
          id: 1,
          voornaam: "Manny",
          achternaam: "Hebbe",
          email: "m.hebbe@gmail.com",
          telefoonnummer: "0492664852",
        },
        adres: {
          id: 3,
          straat: "Liersesteenweg",
          nummer: 24,
          gemeente: "Mechelen",
          postcode: 2800,
        },
        immo: {
          id: 1,
          naam: "Vastgoed Heylen",
        },
        extraDocumenten: [],
        toegangEenheid: ToegangEenheid.SLEUTEL_OPHALEN,
        type: TypeKeuring.EPC,
        status: Status.GEANNULEERD,
        energiedeskundige: "Danny",
        certificaat: false,
      },
      {
        id: 3,
        datumToewijzing: new Date(),
        datumPlaatsbezoek: new Date(2023, 8, 7, 12, 15),
        klant: {
          id: 4,
          voornaam: "Hanne",
          achternaam: "Sloots",
          email: "Hanne.Sloots@hotmail.com",
          telefoonnummer: "0492625299",
        },
        adres: {
          id: 4,
          straat: "Liersesteenweg",
          nummer: 30,
          gemeente: "Mechelen",
          postcode: 2800,
        },
        immo: {
          id: 1,
          naam: "Vastgoed Heylen",
        },
        extraDocumenten: [],
        toegangEenheid: ToegangEenheid.KLANT,
        type: TypeKeuring.EPC_ASBEST,
        status: Status.CERTIFICAAT,
        energiedeskundige: "Danny",
        certificaat: false,
      },
      {
        id: 4,
        datumToewijzing: new Date(),
        datumPlaatsbezoek: new Date(2023, 8, 7, 10, 30),
        klant: {
          id: 1,
          voornaam: "Peter",
          achternaam: "De Clercq",
          email: "dclercqpeter@gmail.com",
          telefoonnummer: "0492316422",
        },
        adres: {
          id: 1,
          straat: "Populierenstraat",
          nummer: 4,
          gemeente: "Sint-Katelijne-Waver",
          postcode: 2860,
        },
        immo: {
          id: 1,
          naam: "Vastgoed Heylen",
        },
        extraDocumenten: [],
        toegangEenheid: ToegangEenheid.KLANT,
        type: TypeKeuring.EPC,
        status: Status.INGEPLAND,
        energiedeskundige: "Bob",
        certificaat: false,
      },
      {
        id: 5,
        datumToewijzing: new Date(),
        datumPlaatsbezoek: new Date(2023, 8, 7, 10, 30),
        klant: {
          id: 1,
          voornaam: "Peter",
          achternaam: "De Clercq",
          email: "dclercqpeter@gmail.com",
          telefoonnummer: "0492316422",
        },
        adres: {
          id: 1,
          straat: "Populierenstraat",
          nummer: 4,
          gemeente: "Sint-Katelijne-Waver",
          postcode: 2860,
        },
        immo: {
          id: 1,
          naam: "Vastgoed Heylen",
        },
        extraDocumenten: [],
        toegangEenheid: ToegangEenheid.SLEUTEL_OPHALEN,
        type: TypeKeuring.EPC,
        status: Status.INGEPLAND,
        energiedeskundige: "Bob",
        certificaat: false,
      },
      {
        id: 6,
        datumToewijzing: new Date(),
        datumPlaatsbezoek: new Date(2023, 8, 14, 14, 0),
        klant: {
          id: 1,
          voornaam: "Emma",
          achternaam: "Plots",
          email: "emma.plots@gmail.com",
          telefoonnummer: "0492521644",
        },
        adres: {
          id: 2,
          straat: "Antwerpsesteenweg",
          nummer: 52,
          gemeente: "Mechelen",
          postcode: 2800,
        },
        immo: {
          id: 1,
          naam: "Vastgoed Heylen",
        },
        extraDocumenten: [],
        toegangEenheid: ToegangEenheid.SLEUTEL_OPHALEN,
        type: TypeKeuring.ASBEST,
        status: Status.IN_BEHANDELING,
        energiedeskundige: "Bob",
        certificaat: true,
      },
      {
        id: 7,
        datumToewijzing: new Date(),
        datumPlaatsbezoek: new Date(2023, 8, 5, 10, 15),
        klant: {
          id: 1,
          voornaam: "Manny",
          achternaam: "Hebbe",
          email: "m.hebbe@gmail.com",
          telefoonnummer: "0492664852",
        },
        adres: {
          id: 3,
          straat: "Liersesteenweg",
          nummer: 24,
          gemeente: "Mechelen",
          postcode: 2800,
        },
        immo: {
          id: 1,
          naam: "Vastgoed Heylen",
        },
        extraDocumenten: [],
        toegangEenheid: ToegangEenheid.KLANT,
        type: TypeKeuring.EPC,
        status: Status.GEANNULEERD,
        energiedeskundige: "Danny",
        certificaat: false,
      },
      {
        id: 8,
        datumToewijzing: new Date(),
        datumPlaatsbezoek: new Date(2023, 8, 7, 12, 15),
        klant: {
          id: 4,
          voornaam: "Hanne",
          achternaam: "Sloots",
          email: "Hanne.Sloots@hotmail.com",
          telefoonnummer: "0492625299",
        },
        adres: {
          id: 4,
          straat: "Liersesteenweg",
          nummer: 30,
          gemeente: "Mechelen",
          postcode: 2800,
        },
        immo: {
          id: 1,
          naam: "Vastgoed Heylen",
        },
        extraDocumenten: [],
        toegangEenheid: ToegangEenheid.SLEUTEL_OPHALEN,
        type: TypeKeuring.EPC_ASBEST,
        status: Status.CERTIFICAAT,
        energiedeskundige: "Danny",
        certificaat: false,
      },
      {
        id: 9,
        datumToewijzing: new Date(),
        datumPlaatsbezoek: new Date(2023, 8, 7, 10, 30),
        klant: {
          id: 1,
          voornaam: "Peter",
          achternaam: "De Clercq",
          email: "dclercqpeter@gmail.com",
          telefoonnummer: "0492316422",
        },
        adres: {
          id: 1,
          straat: "Populierenstraat",
          nummer: 4,
          gemeente: "Sint-Katelijne-Waver",
          postcode: 2860,
        },
        immo: {
          id: 1,
          naam: "Vastgoed Heylen",
        },
        extraDocumenten: [],
        toegangEenheid: ToegangEenheid.KLANT,
        type: TypeKeuring.EPC,
        status: Status.INGEPLAND,
        energiedeskundige: "Bob",
        certificaat: false,
      },
      {
        id: 10,
        datumToewijzing: new Date(),
        datumPlaatsbezoek: new Date(2023, 8, 7, 10, 30),
        klant: {
          id: 1,
          voornaam: "Peter",
          achternaam: "De Clercq",
          email: "dclercqpeter@gmail.com",
          telefoonnummer: "0492316422",
        },
        adres: {
          id: 1,
          straat: "Populierenstraat",
          nummer: 4,
          gemeente: "Sint-Katelijne-Waver",
          postcode: 2860,
        },
        immo: {
          id: 1,
          naam: "Vastgoed Heylen",
        },
        extraDocumenten: [],
        toegangEenheid: ToegangEenheid.KLANT,
        type: TypeKeuring.EPC,
        status: Status.INGEPLAND,
        energiedeskundige: "Bob",
        certificaat: false,
      },
      {
        id: 11,
        datumToewijzing: new Date(),
        datumPlaatsbezoek: new Date(2023, 8, 7, 10, 30),
        klant: {
          id: 1,
          voornaam: "Peter",
          achternaam: "De Clercq",
          email: "dclercqpeter@gmail.com",
          telefoonnummer: "0492316422",
        },
        adres: {
          id: 1,
          straat: "Populierenstraat",
          nummer: 4,
          gemeente: "Sint-Katelijne-Waver",
          postcode: 2860,
        },
        immo: {
          id: 1,
          naam: "Vastgoed Heylen",
        },
        extraDocumenten: [],
        toegangEenheid: ToegangEenheid.KLANT,
        type: TypeKeuring.EPC,
        status: Status.INGEPLAND,
        energiedeskundige: "Bob",
        certificaat: false,
      },
      {
        id: 12,
        datumToewijzing: new Date(),
        datumPlaatsbezoek: new Date(2023, 8, 7, 10, 30),
        klant: {
          id: 1,
          voornaam: "Peter",
          achternaam: "De Clercq",
          email: "dclercqpeter@gmail.com",
          telefoonnummer: "0492316422",
        },
        adres: {
          id: 1,
          straat: "Populierenstraat",
          nummer: 4,
          gemeente: "Sint-Katelijne-Waver",
          postcode: 2860,
        },
        immo: {
          id: 1,
          naam: "Vastgoed Heylen",
        },
        extraDocumenten: [],
        toegangEenheid: ToegangEenheid.SLEUTEL_OPHALEN,
        type: TypeKeuring.EPC,
        status: Status.INGEPLAND,
        energiedeskundige: "Bob",
        certificaat: false,
      },
      {
        id: 13,
        datumToewijzing: new Date(),
        datumPlaatsbezoek: new Date(2023, 8, 7, 10, 30),
        klant: {
          id: 1,
          voornaam: "Peter",
          achternaam: "De Clercq",
          email: "dclercqpeter@gmail.com",
          telefoonnummer: "0492316422",
        },
        adres: {
          id: 1,
          straat: "Populierenstraat",
          nummer: 4,
          gemeente: "Sint-Katelijne-Waver",
          postcode: 2860,
        },
        immo: {
          id: 1,
          naam: "Vastgoed Heylen",
        },
        extraDocumenten: [],
        toegangEenheid: ToegangEenheid.KLANT,
        type: TypeKeuring.EPC,
        status: Status.INGEPLAND,
        energiedeskundige: "Bob",
        certificaat: false,
      },
      {
        id: 14,
        datumToewijzing: new Date(),
        datumPlaatsbezoek: new Date(2023, 8, 7, 10, 30),
        klant: {
          id: 1,
          voornaam: "Pet",
          achternaam: "De Clercq",
          email: "dclercqpeter@gmail.com",
          telefoonnummer: "0492316422",
        },
        adres: {
          id: 1,
          straat: "Populierenstraat",
          nummer: 4,
          gemeente: "Sint-Katelijne-Waver",
          postcode: 2860,
        },
        immo: {
          id: 1,
          naam: "Vastgoed Heylen",
        },
        extraDocumenten: [],
        toegangEenheid: ToegangEenheid.KLANT,
        type: TypeKeuring.EPC,
        status: Status.INGEPLAND,
        energiedeskundige: "Bob",
        certificaat: false,
      },
    ];
    const foundKeuring = keuringen.find((keuring) => keuring.id == params.id);

    setKeuring(foundKeuring);
  }, [params.id]);

  const getBackgroundStatusColor = (status) => {
    switch (status) {
      case Status.GEANNULEERD.valueOf():
        return "rgba(244, 67, 54, 0.7)";
      case Status.IN_BEHANDELING.valueOf():
        return "rgba(255, 152, 0, 0.7)";
      case Status.CERTIFICAAT.valueOf():
        return "rgba(76, 175, 80, 0.7)";
    }
    return "rgba(33, 150, 243, 0.7)";
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours();
    const amOrPm = hours >= 12 ? "PM" : "AM";

    return `${day}/${month}/${year} ${amOrPm}`;
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
        {keuring && (
          <header>
            <h1 className={`${roboto900.className} ${styles.title}`}>
              KEURING - {keuring.type}
            </h1>
            <Tag
              size="lg"
              className={styles.keuringStatus}
              variant="solid"
              bgColor={getBackgroundStatusColor(keuring.status)}
              color="white"
            >
              <TagLabel>
                {keuring.status +
                  (keuring.status == Status.INGEPLAND
                    ? " -> " + formatDate(keuring.datumPlaatsbezoek)
                    : "")}
              </TagLabel>
            </Tag>
          </header>
        )}

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
              <div className={styles.editIconsContainer}>
                <div
                  className={styles.editIconContainer}
                  onClick={() => setEditMode(!editMode)}
                >
                  <MdEdit className={styles.editIcon} size={24} />
                </div>
              </div>
              <CardHeader padding="20px 20px 10px 20px">
                <Heading size="md">Klant</Heading>
              </CardHeader>
              <CardBody>
                <List>
                  {keuring && (
                    <>
                      <ListItem className={styles.klant}>
                        <MdPerson size={24} style={{ margin: "0 20px" }} />
                        {editMode ? (
                          <>
                            <Input
                              width="150px"
                              height="27px"
                              fontSize="18px"
                              defaultValue={keuring.klant.voornaam}
                              onBlur={(e) =>
                                setKeuring({
                                  ...keuring,
                                  klant: {
                                    ...keuring.klant,
                                    voornaam: e.target.value,
                                  },
                                  facturatie: {
                                    ...keuring.facturatie,
                                    klant: {
                                      ...keuring.facturatie.klant,
                                      voornaam: e.target.value,
                                    },
                                    adres: {
                                      ...keuring.facturatie.klant,
                                      adres: e.target.value,
                                    },
                                  },
                                })
                              }
                            />
                            <Input
                              width="175px"
                              height="27px"
                              fontSize="18px"
                              defaultValue={keuring.klant.achternaam}
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
                          </>
                        ) : (
                          <Text>
                            {keuring.klant?.voornaam +
                              " " +
                              keuring.klant?.achternaam}
                          </Text>
                        )}
                      </ListItem>
                      <ListItem className={styles.klant}>
                        <MdAlternateEmail
                          size={24}
                          style={{ margin: "0 20px" }}
                        />
                        {editMode ? (
                          <>
                            <Input
                              type="email"
                              width="325px"
                              height="27px"
                              fontSize="18px"
                              defaultValue={keuring.klant.email}
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
                          </>
                        ) : (
                          <Text>{keuring.klant?.email}</Text>
                        )}
                      </ListItem>
                      <ListItem className={styles.klant}>
                        <MdPhone size={24} style={{ margin: "0 20px" }} />
                        {editMode ? (
                          <>
                            <Input
                              type="tel"
                              width="325px"
                              height="27px"
                              fontSize="18px"
                              defaultValue={keuring.klant.telefoonnummer}
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
                          </>
                        ) : (
                          <Text>{keuring.klant?.telefoonnummer}</Text>
                        )}
                      </ListItem>
                    </>
                  )}
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
                        {editMode ? (
                          <>
                            <Input
                              type="text"
                              width="250px"
                              height="27px"
                              fontSize="18px"
                              defaultValue={keuring.adres.straat}
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
                              type="number"
                              width="75px"
                              height="27px"
                              fontSize="18px"
                              defaultValue={keuring.adres.nummer}
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
                          </>
                        ) : (
                          <Text>
                            {keuring.adres?.straat +
                              " " +
                              keuring.adres?.nummer}
                          </Text>
                        )}
                      </ListItem>
                      <ListItem className={styles.adres}>
                        <MdLocationCity
                          size={24}
                          style={{ margin: "0 20px" }}
                        />
                        {editMode ? (
                          <>
                            <Input
                              type="number"
                              width="100px"
                              height="27px"
                              fontSize="18px"
                              defaultValue={keuring.adres.postcode}
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
                              width="225px"
                              height="27px"
                              fontSize="18px"
                              defaultValue={keuring.adres.gemeente}
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
                          </>
                        ) : (
                          <Text>
                            {keuring.adres?.postcode +
                              " " +
                              keuring.adres?.gemeente}
                          </Text>
                        )}
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
                  label="Download alle documenten"
                  placement="bottom-end"
                >
                  <div className={styles.editIconContainer}>
                    <MdDownload size={24} />
                  </div>
                </Tooltip>
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
                <div className={styles.content}>
                  <div className={styles.icon}>
                    {keuring &&
                      (keuring.toegangEenheid == ToegangEenheid.KLANT ? (
                        <FaHandshake size={64} />
                      ) : (
                        <GiHouseKeys size={64} />
                      ))}
                  </div>

                  <p>{keuring && keuring.toegangEenheid}</p>
                </div>
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
                  defaultValue={keuring && keuring.opmerking}
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
                <Tooltip label="Download certificaat" placement="bottom-end">
                  <div className={styles.editIconContainer}>
                    <MdDownload size={24} />
                  </div>
                </Tooltip>
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

export default Keuring;
