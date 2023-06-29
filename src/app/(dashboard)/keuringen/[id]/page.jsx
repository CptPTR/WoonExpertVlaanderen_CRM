"use client";

import { Roboto } from "next/font/google";
import React, { useCallback, useEffect, useState } from "react";
import { FaHandshake, FaRegFilePdf } from "react-icons/fa";
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

import Status from "@/models/Status";
import ToegangEenheid from "@/models/ToegangEenheid";

import styles from "@/app/(dashboard)/keuringen/[id]/keuring.module.css";
import FacturatieCard from "@/components/NieuweKeuring/FacturatieCard";
import { getBackgroundStatusColor } from "@/helpers/helpers";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  List,
  ListItem,
  Tag,
  TagLabel,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Image } from "cloudinary-react";
import { useRouter } from "next/navigation";

const roboto900 = Roboto({ subsets: ["latin"], weight: "900" });

const Keuring = ({ params }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [editMode, setEditMode] = useState(false);
  const [keuring, setKeuring] = useState(null);
  const [extraDocumenten, setExtraDocumenten] = useState([]);

  const router = useRouter();
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  useEffect(() => {
    // const keuringen = [
    //   {
    //     id: 0,
    //     datumToewijzing: new Date(),
    //     datumPlaatsbezoek: new Date(2023, 8, 7, 10, 30),
    //     klant: {
    //       id: 1,
    //       voornaam: "Peter",
    //       familienaam: "De Clercq",
    //       email: "dclercqpeter@gmail.com",
    //       telefoonnummer: "0492316422",
    //     },
    //     adres: {
    //       id: 1,
    //       straat: "Populierenstraat",
    //       nummer: 4,
    //       gemeente: "Sint-Katelijne-Waver",
    //       postcode: 2860,
    //     },
    //     immo: {
    //       id: 1,
    //       naam: "Vastgoed Heylen",
    //     },
    //     extraDocumenten: [],
    //     toegangEenheid: ToegangEenheid.KLANT,
    //     type: TypeKeuring.EPC,
    //     status: Status.INGEPLAND,
    //     energiedeskundige: "Bob",
    //     certificaat: false,
    //   },
    //   {
    //     id: 1,
    //     datumToewijzing: new Date(),
    //     datumPlaatsbezoek: new Date(2023, 8, 14, 14, 0),
    //     klant: {
    //       id: 1,
    //       voornaam: "Emma",
    //       familienaam: "Plots",
    //       email: "emma.plots@gmail.com",
    //       telefoonnummer: "0492521644",
    //     },
    //     adres: {
    //       id: 2,
    //       straat: "Antwerpsesteenweg",
    //       nummer: 52,
    //       gemeente: "Mechelen",
    //       postcode: 2800,
    //     },
    //     immo: {
    //       id: 1,
    //       naam: "Vastgoed Heylen",
    //     },
    //     extraDocumenten: [],
    //     toegangEenheid: ToegangEenheid.KLANT,
    //     type: TypeKeuring.ASBEST,
    //     status: Status.IN_BEHANDELING,
    //     energiedeskundige: "Bob",
    //     certificaat: true,
    //   },
    //   {
    //     id: 2,
    //     datumToewijzing: new Date(),
    //     datumPlaatsbezoek: new Date(2023, 8, 5, 10, 15),
    //     klant: {
    //       id: 1,
    //       voornaam: "Manny",
    //       familienaam: "Hebbe",
    //       email: "m.hebbe@gmail.com",
    //       telefoonnummer: "0492664852",
    //     },
    //     adres: {
    //       id: 3,
    //       straat: "Liersesteenweg",
    //       nummer: 24,
    //       gemeente: "Mechelen",
    //       postcode: 2800,
    //     },
    //     immo: {
    //       id: 1,
    //       naam: "Vastgoed Heylen",
    //     },
    //     extraDocumenten: [],
    //     toegangEenheid: ToegangEenheid.SLEUTEL_OPHALEN,
    //     type: TypeKeuring.EPC,
    //     status: Status.GEANNULEERD,
    //     energiedeskundige: "Danny",
    //     certificaat: false,
    //   },
    //   {
    //     id: 3,
    //     datumToewijzing: new Date(),
    //     datumPlaatsbezoek: new Date(2023, 8, 7, 12, 15),
    //     klant: {
    //       id: 4,
    //       voornaam: "Hanne",
    //       familienaam: "Sloots",
    //       email: "Hanne.Sloots@hotmail.com",
    //       telefoonnummer: "0492625299",
    //     },
    //     adres: {
    //       id: 4,
    //       straat: "Liersesteenweg",
    //       nummer: 30,
    //       gemeente: "Mechelen",
    //       postcode: 2800,
    //     },
    //     immo: {
    //       id: 1,
    //       naam: "Vastgoed Heylen",
    //     },
    //     extraDocumenten: [],
    //     toegangEenheid: ToegangEenheid.KLANT,
    //     type: TypeKeuring.EPC_ASBEST,
    //     status: Status.CERTIFICAAT,
    //     energiedeskundige: "Danny",
    //     certificaat: false,
    //   },
    //   {
    //     id: 4,
    //     datumToewijzing: new Date(),
    //     datumPlaatsbezoek: new Date(2023, 8, 7, 10, 30),
    //     klant: {
    //       id: 1,
    //       voornaam: "Peter",
    //       familienaam: "De Clercq",
    //       email: "dclercqpeter@gmail.com",
    //       telefoonnummer: "0492316422",
    //     },
    //     adres: {
    //       id: 1,
    //       straat: "Populierenstraat",
    //       nummer: 4,
    //       gemeente: "Sint-Katelijne-Waver",
    //       postcode: 2860,
    //     },
    //     immo: {
    //       id: 1,
    //       naam: "Vastgoed Heylen",
    //     },
    //     extraDocumenten: [],
    //     toegangEenheid: ToegangEenheid.KLANT,
    //     type: TypeKeuring.EPC,
    //     status: Status.INGEPLAND,
    //     energiedeskundige: "Bob",
    //     certificaat: false,
    //   },
    //   {
    //     id: 5,
    //     datumToewijzing: new Date(),
    //     datumPlaatsbezoek: new Date(2023, 8, 7, 10, 30),
    //     klant: {
    //       id: 1,
    //       voornaam: "Peter",
    //       familienaam: "De Clercq",
    //       email: "dclercqpeter@gmail.com",
    //       telefoonnummer: "0492316422",
    //     },
    //     adres: {
    //       id: 1,
    //       straat: "Populierenstraat",
    //       nummer: 4,
    //       gemeente: "Sint-Katelijne-Waver",
    //       postcode: 2860,
    //     },
    //     immo: {
    //       id: 1,
    //       naam: "Vastgoed Heylen",
    //     },
    //     extraDocumenten: [],
    //     toegangEenheid: ToegangEenheid.SLEUTEL_OPHALEN,
    //     type: TypeKeuring.EPC,
    //     status: Status.INGEPLAND,
    //     energiedeskundige: "Bob",
    //     certificaat: false,
    //   },
    //   {
    //     id: 6,
    //     datumToewijzing: new Date(),
    //     datumPlaatsbezoek: new Date(2023, 8, 14, 14, 0),
    //     klant: {
    //       id: 1,
    //       voornaam: "Emma",
    //       familienaam: "Plots",
    //       email: "emma.plots@gmail.com",
    //       telefoonnummer: "0492521644",
    //     },
    //     adres: {
    //       id: 2,
    //       straat: "Antwerpsesteenweg",
    //       nummer: 52,
    //       gemeente: "Mechelen",
    //       postcode: 2800,
    //     },
    //     immo: {
    //       id: 1,
    //       naam: "Vastgoed Heylen",
    //     },
    //     extraDocumenten: [],
    //     toegangEenheid: ToegangEenheid.SLEUTEL_OPHALEN,
    //     type: TypeKeuring.ASBEST,
    //     status: Status.IN_BEHANDELING,
    //     energiedeskundige: "Bob",
    //     certificaat: true,
    //   },
    //   {
    //     id: 7,
    //     datumToewijzing: new Date(),
    //     datumPlaatsbezoek: new Date(2023, 8, 5, 10, 15),
    //     klant: {
    //       id: 1,
    //       voornaam: "Manny",
    //       familienaam: "Hebbe",
    //       email: "m.hebbe@gmail.com",
    //       telefoonnummer: "0492664852",
    //     },
    //     adres: {
    //       id: 3,
    //       straat: "Liersesteenweg",
    //       nummer: 24,
    //       gemeente: "Mechelen",
    //       postcode: 2800,
    //     },
    //     immo: {
    //       id: 1,
    //       naam: "Vastgoed Heylen",
    //     },
    //     extraDocumenten: [],
    //     toegangEenheid: ToegangEenheid.KLANT,
    //     type: TypeKeuring.EPC,
    //     status: Status.GEANNULEERD,
    //     energiedeskundige: "Danny",
    //     certificaat: false,
    //   },
    //   {
    //     id: 8,
    //     datumToewijzing: new Date(),
    //     datumPlaatsbezoek: new Date(2023, 8, 7, 12, 15),
    //     klant: {
    //       id: 4,
    //       voornaam: "Hanne",
    //       familienaam: "Sloots",
    //       email: "Hanne.Sloots@hotmail.com",
    //       telefoonnummer: "0492625299",
    //     },
    //     adres: {
    //       id: 4,
    //       straat: "Liersesteenweg",
    //       nummer: 30,
    //       gemeente: "Mechelen",
    //       postcode: 2800,
    //     },
    //     immo: {
    //       id: 1,
    //       naam: "Vastgoed Heylen",
    //     },
    //     extraDocumenten: [],
    //     toegangEenheid: ToegangEenheid.SLEUTEL_OPHALEN,
    //     type: TypeKeuring.EPC_ASBEST,
    //     status: Status.CERTIFICAAT,
    //     energiedeskundige: "Danny",
    //     certificaat: false,
    //   },
    //   {
    //     id: 9,
    //     datumToewijzing: new Date(),
    //     datumPlaatsbezoek: new Date(2023, 8, 7, 10, 30),
    //     klant: {
    //       id: 1,
    //       voornaam: "Peter",
    //       familienaam: "De Clercq",
    //       email: "dclercqpeter@gmail.com",
    //       telefoonnummer: "0492316422",
    //     },
    //     adres: {
    //       id: 1,
    //       straat: "Populierenstraat",
    //       nummer: 4,
    //       gemeente: "Sint-Katelijne-Waver",
    //       postcode: 2860,
    //     },
    //     immo: {
    //       id: 1,
    //       naam: "Vastgoed Heylen",
    //     },
    //     extraDocumenten: [],
    //     toegangEenheid: ToegangEenheid.KLANT,
    //     type: TypeKeuring.EPC,
    //     status: Status.INGEPLAND,
    //     energiedeskundige: "Bob",
    //     certificaat: false,
    //   },
    //   {
    //     id: 10,
    //     datumToewijzing: new Date(),
    //     datumPlaatsbezoek: new Date(2023, 8, 7, 10, 30),
    //     klant: {
    //       id: 1,
    //       voornaam: "Peter",
    //       familienaam: "De Clercq",
    //       email: "dclercqpeter@gmail.com",
    //       telefoonnummer: "0492316422",
    //     },
    //     adres: {
    //       id: 1,
    //       straat: "Populierenstraat",
    //       nummer: 4,
    //       gemeente: "Sint-Katelijne-Waver",
    //       postcode: 2860,
    //     },
    //     immo: {
    //       id: 1,
    //       naam: "Vastgoed Heylen",
    //     },
    //     extraDocumenten: [],
    //     toegangEenheid: ToegangEenheid.KLANT,
    //     type: TypeKeuring.EPC,
    //     status: Status.INGEPLAND,
    //     energiedeskundige: "Bob",
    //     certificaat: false,
    //   },
    //   {
    //     id: 11,
    //     datumToewijzing: new Date(),
    //     datumPlaatsbezoek: new Date(2023, 8, 7, 10, 30),
    //     klant: {
    //       id: 1,
    //       voornaam: "Peter",
    //       familienaam: "De Clercq",
    //       email: "dclercqpeter@gmail.com",
    //       telefoonnummer: "0492316422",
    //     },
    //     adres: {
    //       id: 1,
    //       straat: "Populierenstraat",
    //       nummer: 4,
    //       gemeente: "Sint-Katelijne-Waver",
    //       postcode: 2860,
    //     },
    //     immo: {
    //       id: 1,
    //       naam: "Vastgoed Heylen",
    //     },
    //     extraDocumenten: [],
    //     toegangEenheid: ToegangEenheid.KLANT,
    //     type: TypeKeuring.EPC,
    //     status: Status.INGEPLAND,
    //     energiedeskundige: "Bob",
    //     certificaat: false,
    //   },
    //   {
    //     id: 12,
    //     datumToewijzing: new Date(),
    //     datumPlaatsbezoek: new Date(2023, 8, 7, 10, 30),
    //     klant: {
    //       id: 1,
    //       voornaam: "Peter",
    //       familienaam: "De Clercq",
    //       email: "dclercqpeter@gmail.com",
    //       telefoonnummer: "0492316422",
    //     },
    //     adres: {
    //       id: 1,
    //       straat: "Populierenstraat",
    //       nummer: 4,
    //       gemeente: "Sint-Katelijne-Waver",
    //       postcode: 2860,
    //     },
    //     immo: {
    //       id: 1,
    //       naam: "Vastgoed Heylen",
    //     },
    //     extraDocumenten: [],
    //     toegangEenheid: ToegangEenheid.SLEUTEL_OPHALEN,
    //     type: TypeKeuring.EPC,
    //     status: Status.INGEPLAND,
    //     energiedeskundige: "Bob",
    //     certificaat: false,
    //   },
    //   {
    //     id: 13,
    //     datumToewijzing: new Date(),
    //     datumPlaatsbezoek: new Date(2023, 8, 7, 10, 30),
    //     klant: {
    //       id: 1,
    //       voornaam: "Peter",
    //       familienaam: "De Clercq",
    //       email: "dclercqpeter@gmail.com",
    //       telefoonnummer: "0492316422",
    //     },
    //     adres: {
    //       id: 1,
    //       straat: "Populierenstraat",
    //       nummer: 4,
    //       gemeente: "Sint-Katelijne-Waver",
    //       postcode: 2860,
    //     },
    //     immo: {
    //       id: 1,
    //       naam: "Vastgoed Heylen",
    //     },
    //     extraDocumenten: [],
    //     toegangEenheid: ToegangEenheid.KLANT,
    //     type: TypeKeuring.EPC,
    //     status: Status.INGEPLAND,
    //     energiedeskundige: "Bob",
    //     certificaat: false,
    //   },
    //   {
    //     id: 14,
    //     datumToewijzing: new Date(),
    //     datumPlaatsbezoek: new Date(2023, 8, 7, 10, 30),
    //     klant: {
    //       id: 1,
    //       voornaam: "Pet",
    //       familienaam: "De Clercq",
    //       email: "dclercqpeter@gmail.com",
    //       telefoonnummer: "0492316422",
    //     },
    //     adres: {
    //       id: 1,
    //       straat: "Populierenstraat",
    //       nummer: 4,
    //       gemeente: "Sint-Katelijne-Waver",
    //       postcode: 2860,
    //     },
    //     immo: {
    //       id: 1,
    //       naam: "Vastgoed Heylen",
    //     },
    //     extraDocumenten: [],
    //     toegangEenheid: ToegangEenheid.KLANT,
    //     type: TypeKeuring.EPC,
    //     status: Status.INGEPLAND,
    //     energiedeskundige: "Bob",
    //     certificaat: false,
    //   },
    // ];
    // const foundKeuring = keuringen.find((keuring) => keuring.id == params.id);

    const getKeuringData = async () => {
      let { data: keuringData, error: keuringError } = await supabase
        .from("Keuring")
        .select(
          "id, datumPlaatsbezoek, epc_certificaat, asbest_certificaat, toegang_eenheid, opmerking, status, type, adresID(straatnaam, nummer, postcode, gemeente, klantID(voornaam, familienaam, emailadres, telefoonnummer)), facturatieID(naar, voornaam, familienaam, emailadres, telefoonnummer, straatnaam, nummer, postcode, gemeente)"
        )
        .eq("id", params.id);
      setKeuring(keuringData[0]);
    };
    const getExtraDocumentenData = async () => {
      let { data: extraDocumentenData, error: extraDocumentenError } =
        await supabase.from("ExtraDocument").select("*").eq("id", params.id);
      setExtraDocumenten(extraDocumentenData);
    };

    getKeuringData();
    getExtraDocumentenData();
  }, [params.id, supabase]);

  const handleDeleteKeuring = async () => {
    const { error } = await supabase
      .from("Keuring")
      .delete()
      .eq("id", params.id);
    if (error) {
      console.log("Could not delete keuring: ", error);
    } else {
      router.replace("/keuringen");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

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
        {JSON.stringify(keuring)}
        {keuring && (
          <header>
            <h1 className={`${roboto900.className} ${styles.title}`}>
              KEURING - {keuring.type}
            </h1>
            <Box display="flex">
              <Tag
                size="lg"
                className={styles.keuringStatus}
                variant="solid"
                bgColor={getBackgroundStatusColor(keuring)}
                color="white"
              >
                <TagLabel>
                  {keuring.status +
                    (keuring.status == Status.INGEPLAND
                      ? " -> " + formatDate(keuring.datumPlaatsbezoek)
                      : "")}
                </TagLabel>
              </Tag>
              <Tooltip label="Verwijder keuring" placement="bottom-end">
                <IconButton
                  size="lg"
                  icon={<MdDelete />}
                  ml="10px"
                  className={styles.keuringStatus}
                  onClick={onOpen}
                />
              </Tooltip>
              <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Keuring verwijderen
                    </AlertDialogHeader>
                    <AlertDialogBody>
                      Ben u zeker dat u deze keuring wil verwijderen?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Sluit venster
                      </Button>
                      <Button
                        bgColor="red"
                        color="white"
                        ml={3}
                        onClick={handleDeleteKeuring}
                      >
                        Verwijder Keuring
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </Box>
          </header>
        )}

        <Grid
          h="800px"
          templateRows="repeat(12, 1fr)"
          templateColumns="repeat(12, 1fr)"
          gap={15}
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
                              defaultValue={keuring.adresID.klantID.voornaam}
                              onBlur={(e) =>
                                setKeuring((prevKeuring) => ({
                                  ...prevKeuring,
                                  adresID: {
                                    ...prevKeuring.adresID,
                                    klantID: {
                                      ...prevKeuring.adresID.klantID,
                                      voornaam: e.target.value,
                                    },
                                  },
                                }))
                              }
                            />
                            <Input
                              width="175px"
                              height="27px"
                              fontSize="18px"
                              defaultValue={keuring.adresID.klantID.familienaam}
                              onBlur={(e) =>
                                setKeuring((prevKeuring) => ({
                                  ...prevKeuring,
                                  adresID: {
                                    ...prevKeuring.adresID,
                                    klantID: {
                                      ...prevKeuring.adresID.klantID,
                                      familienaam: e.target.value,
                                    },
                                  },
                                }))
                              }
                            />
                          </>
                        ) : (
                          <Text>
                            {keuring.adresID?.klantID?.voornaam +
                              " " +
                              keuring.adresID?.klantID?.familienaam}
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
                              defaultValue={keuring.adresID.klantID.emailadres}
                              onBlur={(e) =>
                                setKeuring((prevKeuring) => ({
                                  ...prevKeuring,
                                  adresID: {
                                    ...prevKeuring.adresID,
                                    klantID: {
                                      ...prevKeuring.adresID.klantID,
                                      emailadres: e.target.value,
                                    },
                                  },
                                }))
                              }
                            />
                          </>
                        ) : (
                          <Text>{keuring.adresID?.klantID?.emailadres}</Text>
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
                              defaultValue={
                                keuring.adresID.klantID.telefoonnummer
                              }
                              onBlur={(e) =>
                                setKeuring((prevKeuring) => ({
                                  ...prevKeuring,
                                  adresID: {
                                    ...prevKeuring.adresID,
                                    klantID: {
                                      ...prevKeuring.adresID.klantID,
                                      telefoonnummer: e.target.value,
                                    },
                                  },
                                }))
                              }
                            />
                          </>
                        ) : (
                          <Text>
                            {keuring.adresID?.klantID?.telefoonnummer}
                          </Text>
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
                              defaultValue={keuring.adresID.straatnaam}
                              onBlur={(e) =>
                                setKeuring((prevKeuring) => ({
                                  ...prevKeuring,
                                  adresID: {
                                    ...prevKeuring.adresID,
                                    straatnaam: e.target.value,
                                  },
                                }))
                              }
                            />
                            <Input
                              type="number"
                              width="75px"
                              height="27px"
                              fontSize="18px"
                              defaultValue={keuring.adresID.nummer}
                              onBlur={(e) =>
                                setKeuring({
                                  ...keuring,
                                  adresID: {
                                    ...keuring.adresID,
                                    nummer: +e.target.value,
                                  },
                                })
                              }
                            />
                          </>
                        ) : (
                          <Text>
                            {keuring.adresID?.straatnaam +
                              " " +
                              keuring.adresID?.nummer}
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
                              defaultValue={keuring.adresID.postcode}
                              onBlur={(e) =>
                                setKeuring({
                                  ...keuring,
                                  adresID: {
                                    ...keuring.adresID,
                                    postcode: +e.target.value,
                                  },
                                })
                              }
                            />
                            <Input
                              width="225px"
                              height="27px"
                              fontSize="18px"
                              defaultValue={keuring.adresID.gemeente}
                              onBlur={(e) =>
                                setKeuring({
                                  ...keuring,
                                  adresID: {
                                    ...keuring.adresID,
                                    gemeente: e.target.value,
                                  },
                                })
                              }
                            />
                          </>
                        ) : (
                          <Text>
                            {keuring.adresID?.postcode +
                              " " +
                              keuring.adresID?.gemeente}
                          </Text>
                        )}
                      </ListItem>
                    </>
                  )}
                </List>
              </CardBody>
            </Card>
          </GridItem>
          {/* <GridItem
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
          </GridItem> */}
          <FacturatieCard keuring={keuring} setKeuring={setKeuring} />
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
              {/* <Dropzone
                keuring={keuring}
                setKeuring={setKeuring}
                forFiles="extradocs"
                acceptFileType="images"
                multipleFiles
                text="Sleep hier afbeeldingen/PDF-bestanden naartoe, of klik om ze te selecteren."
              /> */}
              <CardBody>
                <List>
                  {keuring?.extraDocumenten?.map((extraDoc) => {
                    <ListItem key={extraDoc.id}>
                      {extraDoc.format !== "pdf" ? (
                        <Image
                          alt=""
                          cloudName={
                            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                          }
                          publicId={extraDoc.id}
                          width="100"
                          height="100"
                          scrop="scale"
                        />
                      ) : (
                        <FaRegFilePdf size={48} color="#F40F02" />
                      )}
                    </ListItem>;
                  })}
                </List>
              </CardBody>
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
                      (keuring.toegang_eenheid == ToegangEenheid.KLANT ? (
                        <FaHandshake size={64} />
                      ) : (
                        <GiHouseKeys size={64} />
                      ))}
                  </div>

                  <p>{keuring && keuring.toegang_eenheid}</p>
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
              {/* <Dropzone
                keuring={keuring}
                setKeuring={setKeuring}
                forFiles="certificaat"
                acceptFileType="pdf"
                text="Sleep hier een PDF-bestand naartoe, of klik om een bestand te selecteren"
              /> */}
            </Card>
          </GridItem>
        </Grid>
      </div>
    </main>
  );
};

export default Keuring;
