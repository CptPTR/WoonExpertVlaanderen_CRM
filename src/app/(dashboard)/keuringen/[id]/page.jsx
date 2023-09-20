"use client";

import styles from "@/app/(dashboard)/keuringen/[id]/keuring.module.css";
import { getBackgroundStatusColor } from "@/helpers/helpers";
import Facturatie from "@/models/Facturatie";
import Status from "@/models/Status";
import ToegangEenheid from "@/models/ToegangEenheid";
import TypeKeuring from "@/models/TypeKeuring";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Divider,
  Heading,
  IconButton,
  List,
  ListItem,
  Spacer,
  Tag,
  TagLabel,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Image } from "cloudinary-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaHandshake, FaRegFilePdf } from "react-icons/fa";
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

const Keuring = ({ params }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [keuring, setKeuring] = useState({
    id: "",
    klant: {
      voornaam: "",
      familienaam: "",
      email: "",
      telefoonnummer: "",
    },
    adres: {
      straatnaam: "",
      nummer: "",
      postcode: "",
      gemeente: "",
    },
    facturatie: {
      id: "",
      naar: Facturatie.IMMO,
      voornaam: "",
      familienaam: "",
      email: "",
      telefoonnummer: "",
      straatnaam: "",
      nummer: "",
      postcode: "",
      gemeente: "",
    },
    extraDocumenten: [],
    certificaatEPC: {
      id: "",
      name: "",
      size: 0,
      type: TypeKeuring.EPC,
    },
    certificaatAsbest: {
      id: "",
      name: "",
      size: 0,
      type: TypeKeuring.ASBEST,
    },
    type: TypeKeuring.EPC,
    status: Status.NIEUW,
    toegang_eenheid: ToegangEenheid.KLANT,
    datumPlaatsbezoek: null,
    opmerking: "",
    created_by: {
      naam: "",
    },
  });

  const klantNaam = keuring.klant.voornaam + " " + keuring.klant.familienaam;
  const klantAdres = keuring.adres.straatnaam + " " + keuring.adres.nummer;
  const klantWoonplaats = keuring.adres.postcode + " " + keuring.adres.gemeente;

  const router = useRouter();
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  useEffect(() => {
    // setIsLoading(true);

    const getKeuringData = async () => {
      let { data: keuringenData, error: keuringenError } = await supabase
        .from("Keuring")
        .select(
          `id, eventID, datumPlaatsbezoek, toegang_eenheid, opmerking, status, type, adresID(straatnaam, nummer, postcode, gemeente, klantID(voornaam, familienaam, emailadres, telefoonnummer)), facturatieID(naar, voornaam, familienaam, emailadres, telefoonnummer, straatnaam, nummer, postcode, gemeente), created_by(ondernemingID(naam)), ExtraDocument(id, name, size, format, cldnry_id), Certificaat(id, name, type, size)`
        )
        .eq("id", params.id);

      if (keuringenData) {
        const certEPC = keuringenData[0].Certificaat.filter(
          (certificaat) => certificaat.type == TypeKeuring.EPC
        );
        const certAsbest = keuringenData[0].Certificaat.filter(
          (certificaat) => certificaat.type == TypeKeuring.ASBEST
        );
        setKeuring({
          ...keuring,
          id: keuringenData[0].id,
          eventID: keuringenData[0].eventID,
          type: keuringenData[0].type,
          opmerking: keuringenData[0].opmerking,
          toegang_eenheid: keuringenData[0].toegang_eenheid,
          status: keuringenData[0].status,
          datumPlaatsbezoek: keuringenData[0].datumPlaatsbezoek,
          klant: {
            ...keuring.klant,
            voornaam: keuringenData[0].adresID.klantID.voornaam,
            familienaam: keuringenData[0].adresID.klantID.familienaam,
            email: keuringenData[0].adresID.klantID.emailadres,
            telefoonnummer: keuringenData[0].adresID.klantID.telefoonnummer,
          },
          adres: {
            ...keuring.adres,
            straatnaam: keuringenData[0].adresID.straatnaam,
            nummer: keuringenData[0].adresID.nummer,
            postcode: keuringenData[0].adresID.postcode,
            gemeente: keuringenData[0].adresID.gemeente,
          },
          facturatie: {
            ...keuring.facturatie,
            naar: keuringenData[0].facturatieID.naar,
            voornaam: keuringenData[0].facturatieID.voornaam,
            familienaam: keuringenData[0].facturatieID.familienaam,
            emailadres: keuringenData[0].facturatieID.emailadres,
            telefoonnummer: keuringenData[0].facturatieID.telefoonnummer,
            straatnaam: keuringenData[0].facturatieID.straatnaam,
            nummer: keuringenData[0].facturatieID.nummer,
            postcode: keuringenData[0].facturatieID.postcode,
            gemeente: keuringenData[0].facturatieID.gemeente,
          },
          created_by: {
            ...keuring.created_by,
            naam: keuringenData[0].created_by.ondernemingID.naam,
          },
          extraDocumenten: keuringenData[0].ExtraDocument,
          certificaatEPC: {
            ...keuring.certificaatEPC,
            id: certEPC[0]?.id || "",
            name: certEPC[0]?.name || "",
            size: certEPC[0]?.size || 0,
          },
          certificaatAsbest: {
            ...keuring.certificaatAsbest,
            id: certAsbest[0]?.id || "",
            name: certAsbest[0]?.name || "",
            size: certAsbest[0]?.size || 0,
          },
        });
      } else {
        console.error("Error fetching keuring: ", keuringenError);
      }
    };

    getKeuringData();
  }, [params.id, supabase]);

  const handleDeleteKeuring = async () => {
    const { error: certError } = await supabase
      .from("Certificaat")
      .delete()
      .eq("keuringID", params.id);

    if (certError) {
      console.error("Could not delete certificate of keuring id: ", params.id);
    } else {
      const { error: keuringError } = await supabase
        .from("Keuring")
        .delete()
        .eq("id", params.id);
      if (keuringError) {
        console.error("Could not delete keuring: ", error);
      } else {
        router.replace("/keuringen");
      }
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

  const formatFileSize = (bytes) => {
    const kilobyte = 1024;
    const megabyte = kilobyte * 1024;
    const gigabyte = megabyte * 1024;

    if (bytes < kilobyte) {
      return bytes + " B";
    } else if (bytes < megabyte) {
      return (bytes / kilobyte).toFixed(2) + " KB";
    } else if (bytes < gigabyte) {
      return (bytes / megabyte).toFixed(2) + " MB";
    } else {
      return (bytes / gigabyte).toFixed(2) + " GB";
    }
  };

  const downloadExtraDocument = async (extraDoc) => {
    const cloudinaryCloudname = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const response = await fetch(
      `https://res.cloudinary.com/${cloudinaryCloudname}/image/upload/${extraDoc.cldnry_id}`
    );
    if (response.ok) {
      const blob = await response.blob();
      const format = extraDoc.format;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const defaultFilename = "downloaded_file";
      const suggestedFilename = extraDoc.name || defaultFilename;

      link.download = `${suggestedFilename}.${format}`;
      link.click();
    } else {
      console.error("ERROR");
    }
  };

  const downloadFile = async (cldnry_id, folder, filename) => {
    if (cldnry_id) {
      try {
        console.log(filename);
        const response = await fetch(
          `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${cldnry_id}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY}`,
            },
          }
        );
        if (response.ok) {
          const blob = await response.blob();

          const contentType = response.headers.get("Content-Type");
          const format = contentType.split("/")[1];

          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;

          const defaultFilename = "downloaded_file";
          const suggestedFilename = filename || defaultFilename;

          link.download = `${suggestedFilename}.${format}`;
          link.click();
        } else {
          console.error("Failed to download image: ", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    } else {
      const { data, error } = await supabase.storage
        .from("certificaten")
        .download(`${folder}/${filename}`);

      if (error) {
        console.error("Error downloading file: ", filename);
      } else {
        const url = URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}`;
        link.click();
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        my={5}
      >
        <Box display="flex" alignItems="center" p={3}>
          <FaArrowLeft
            size={28}
            onClick={() => router.replace("/keuringen")}
            className={styles.backBtn}
          />
          <Heading size="md" ml={3}>
            Keuring
          </Heading>
        </Box>
        <Box display="flex">
          <Tooltip label={keuring.toegang_eenheid} placement="bottom-end">
            <Tag variant="solid" bgColor="black" color="white">
              <TagLabel>
                {keuring.toegang_eenheid == ToegangEenheid.KLANT ? (
                  <FaHandshake size={24} />
                ) : (
                  <GiHouseKeys size={24} />
                )}
              </TagLabel>
            </Tag>
          </Tooltip>
          <Tag variant="solid" bgColor="blackAlpha.700" color="white" ml={2}>
            <TagLabel>{keuring.type}</TagLabel>
          </Tag>
          <Tag
            variant="solid"
            bgColor={getBackgroundStatusColor(keuring)}
            color="white"
            ml={2}
          >
            <TagLabel>
              {keuring.status +
                (keuring.status == Status.INGEPLAND
                  ? " -> " + formatDate(keuring.datumPlaatsbezoek)
                  : "")}
            </TagLabel>
          </Tag>
          <Tooltip label="Pas keuring aan" placement="bottom-end">
            <IconButton
              size="lg"
              icon={<MdEdit size={22} />}
              ml="10px"
              onClick={() => router.push(`/keuringen/${keuring.id}/edit`)}
            />
          </Tooltip>
          <Tooltip label="Verwijder keuring" placement="bottom-end">
            <IconButton
              size="lg"
              icon={<MdDelete size={22} />}
              ml={2}
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
                <AlertDialogHeader fontWeight="bold">
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
                    ml={2}
                    onClick={handleDeleteKeuring}
                  >
                    Verwijder Keuring
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Box>
      </Box>

      <Box mb={10}>
        <div className={styles.keuringContainer}>
          <Box display="flex" gap="20px">
            <Box className={styles.cardBox} width="fit-content">
              <Box className={styles.box}>
                <Heading size="sm">Klant</Heading>
                <List mt={5}>
                  <>
                    <ListItem className={styles.klant} fontSize="sm">
                      <MdPerson size={24} style={{ margin: "0 20px" }} />
                      {klantNaam}
                    </ListItem>
                    <ListItem className={styles.klant} fontSize="sm">
                      <MdAlternateEmail
                        size={24}
                        style={{ margin: "0 20px" }}
                      />
                      {keuring.klant.email}
                    </ListItem>
                    <ListItem className={styles.klant} fontSize="sm">
                      <MdPhone size={24} style={{ margin: "0 20px" }} />
                      {keuring.klant.telefoonnummer}
                    </ListItem>
                  </>
                </List>
              </Box>
              <Divider />
              <Box className={styles.box}>
                <Heading size="sm">Adres</Heading>
                <List mt={5}>
                  {keuring && (
                    <>
                      <ListItem className={styles.adres} fontSize="sm">
                        <MdHome size={24} style={{ margin: "0 20px" }} />
                        {klantAdres}
                      </ListItem>
                      <ListItem className={styles.adres} fontSize="sm">
                        <MdLocationCity
                          size={24}
                          style={{ margin: "0 20px" }}
                        />
                        {klantWoonplaats}
                      </ListItem>
                    </>
                  )}
                </List>
              </Box>
              <Divider />
              <Box className={styles.box}>
                <Heading size="sm" mb={5}>
                  Facturatie
                </Heading>
                {keuring.facturatie.naar !== Facturatie.ANDERS ? (
                  <Text ml="24px" fontSize="sm">
                    {keuring.facturatie.naar == Facturatie.IMMO
                      ? `${keuring.facturatie.naar} - ${keuring.created_by.naam}`
                      : keuring.facturatie.naar}
                  </Text>
                ) : null}

                {keuring.facturatie.naar == Facturatie.ANDERS ? (
                  <>
                    <List>
                      <ListItem className={styles.klant} fontSize="sm">
                        <MdPerson size={24} style={{ margin: "0 20px" }} />
                        {keuring.facturatie.voornaam}{" "}
                        {keuring.facturatie.familienaam}
                      </ListItem>
                      <ListItem className={styles.klant} fontSize="sm">
                        <MdAlternateEmail
                          size={24}
                          style={{ margin: "0 20px" }}
                        />
                        {keuring.facturatie.emailadres}
                      </ListItem>
                      <ListItem className={styles.klant} fontSize="sm">
                        <MdPhone size={24} style={{ margin: "0 20px" }} />
                        {keuring.facturatie.telefoonnummer}
                      </ListItem>
                      <ListItem className={styles.klant} fontSize="sm">
                        <MdHome size={24} style={{ margin: "0 20px" }} />
                        {`${keuring.facturatie.straatnaam} ${keuring.facturatie.nummer}`}
                      </ListItem>
                      <ListItem className={styles.klant} fontSize="sm">
                        <MdLocationCity
                          size={24}
                          style={{ margin: "0 20px" }}
                        />

                        {`${keuring.facturatie.postcode} ${keuring.facturatie.gemeente}`}
                      </ListItem>
                    </List>
                  </>
                ) : null}
              </Box>
            </Box>
            <Box className={styles.cardBox} width="100%" position="relative">
              <Box className={styles.box}>
                <Heading size="sm">Extra documenten</Heading>
                {keuring.extraDocumenten.length == 0 ? (
                  <Box
                    mt="20px"
                    height="210px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text>Geen extra documenten</Text>
                  </Box>
                ) : (
                  <List
                    mt="20px"
                    maxHeight="210px"
                    overflowY={
                      keuring.extraDocumenten.length > 3 ? "scroll" : "auto"
                    }
                  >
                    {keuring.extraDocumenten.map((extraDoc, index) => (
                      <ListItem
                        key={extraDoc.id}
                        mt={5}
                        pl={5}
                        display="flex"
                        alignItems="center"
                        height="50px"
                      >
                        {extraDoc.format !== "pdf" ? (
                          <Image
                            alt=""
                            cloudName={
                              process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                            }
                            publicId={extraDoc.cldnry_id}
                            width="48"
                            height="48"
                            scrop="scale"
                          />
                        ) : (
                          <Box
                            width="48px"
                            display="flex"
                            justifyContent="center"
                          >
                            <FaRegFilePdf size={38} color="#F40F02" />
                          </Box>
                        )}
                        <Text fontSize="sm" ml={5}>
                          {extraDoc.name}.{extraDoc.format}
                        </Text>
                        <Spacer />

                        <Text fontSize="sm" ml="auto" mr={5}>
                          {formatFileSize(extraDoc.size)}
                        </Text>
                        <Tooltip
                          label="Download document"
                          placement="bottom-start"
                        >
                          <Box
                            className={styles.editIcon}
                            mr={5}
                            onClick={() => downloadExtraDocument(extraDoc)}
                          >
                            <MdDownload />
                          </Box>
                        </Tooltip>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
              <Divider />
              <Box className={styles.box}>
                <Heading size="sm">Certificaat</Heading>
                {keuring.type !== TypeKeuring.ASBEST ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    mt="40px"
                    pl={5}
                    height="50px"
                  >
                    <FaRegFilePdf size={38} color="#F40F02" />

                    <Text fontSize="sm" ml={5}>
                      {keuring.certificaatEPC.name ||
                        "Geen EPC certificaat geüpload"}
                    </Text>

                    {keuring.certificaatEPC.size ? (
                      <>
                        <Text fontSize="sm" ml="auto" mr={5}>
                          {formatFileSize(keuring.certificaatEPC.size)}
                        </Text>
                        <Tooltip
                          label="Download EPC certificaat"
                          placement="bottom-start"
                        >
                          <Box
                            className={styles.editIcon}
                            onClick={() =>
                              downloadFile(
                                null,
                                "epc",
                                keuring.certificaatEPC.name
                              )
                            }
                          >
                            <MdDownload />
                          </Box>
                        </Tooltip>
                      </>
                    ) : null}
                  </Box>
                ) : null}
                {keuring.type !== TypeKeuring.EPC ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    mt="20px"
                    pl={5}
                    height="50px"
                  >
                    <FaRegFilePdf size={38} color="#F40F02" />
                    <Text fontSize="sm" ml={5}>
                      {keuring.certificaatAsbest.name ||
                        "Geen asbest certificaat geüpload"}
                    </Text>
                    {keuring.certificaatAsbest.size ? (
                      <>
                        <Text fontSize="sm" ml="auto" mr={5}>
                          {formatFileSize(keuring.certificaatAsbest.size)}
                        </Text>
                        <Tooltip
                          label="Download asbest certificaat"
                          placement="bottom-start"
                        >
                          <Box
                            className={styles.editIcon}
                            onClick={() =>
                              downloadFile(
                                null,
                                "asbest",
                                keuring.certificaatAsbest.name
                              )
                            }
                          >
                            <MdDownload />
                          </Box>
                        </Tooltip>
                      </>
                    ) : null}
                  </Box>
                ) : null}
              </Box>
              <Divider />
              <Box className={styles.box}>
                <Heading size="sm">Extra opmerkingen</Heading>
                <Text
                  fontSize="sm"
                  minHeight={100}
                  maxHeight={120}
                  className={styles.opmerking}
                  mt={10}
                >
                  {keuring?.opmerking || "Geen opmerkingen"}
                </Text>
              </Box>
            </Box>
          </Box>
        </div>
      </Box>
    </Box>
  );
};

export default Keuring;
