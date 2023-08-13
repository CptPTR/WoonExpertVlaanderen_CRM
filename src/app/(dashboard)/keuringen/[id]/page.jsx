"use client";

import styles from "@/app/(dashboard)/keuringen/[id]/keuring.module.css";
import CertificateName from "@/components/CertificateName";
import EditForm from "@/components/EditKeuring/EditForm";
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
  MdHome,
  MdLocationCity,
  MdPerson,
  MdPhone,
} from "react-icons/md";

const Keuring = ({ params }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [keuring, setKeuring] = useState(null);
  const [extraDocumenten, setExtraDocumenten] = useState([]);
  const [certificaatEPC, setCertificaatEPC] = useState();
  const [certificaatAsbest, setCertificaatAsbest] = useState();

  const router = useRouter();
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  useEffect(() => {
    const getKeuringData = async () => {
      let { data: keuringData, error: keuringError } = await supabase
        .from("Keuring")
        .select(
          "id, datumPlaatsbezoek, epc_certificaat, asbest_certificaat, toegang_eenheid, opmerking, status, type, adresID(straatnaam, nummer, postcode, gemeente, klantID(voornaam, familienaam, emailadres, telefoonnummer)), facturatieID(naar, voornaam, familienaam, emailadres, telefoonnummer, straatnaam, nummer, postcode, gemeente), created_by(ondernemingID(naam))"
        )
        .eq("id", params.id);
      setKeuring(keuringData[0]);
    };
    const getExtraDocumentenData = async () => {
      let { data: extraDocumentenData, error: extraDocumentenError } =
        await supabase
          .from("ExtraDocument")
          .select("*")
          .eq("keuringID", params.id);

      setExtraDocumenten(extraDocumentenData);
    };
    const getCertificatenData = async () => {
      let { data: certificatenData, error: certificatenError } = await supabase
        .from("Certificaat")
        .select("*")
        .eq("keuringID", params.id);

      const certificaatEPC = certificatenData.filter(
        (certificaat) => certificaat.type == TypeKeuring.EPC
      );
      const certificaatAsbest = certificatenData.filter(
        (certificaat) => certificaat.type == TypeKeuring.ASBEST
      );
      console.log(certificaatEPC);
      console.log(certificaatAsbest);
      // setCertificaatEPC(certificaatEPC[0].name);
      // setCertificaatAsbest(certificaatAsbest[0].name);
    };

    getKeuringData();
    getExtraDocumentenData();
    getCertificatenData();
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

  const downloadFile = async (cldnry_id, filename) => {
    try {
      const response = await fetch(
        `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${cldnry_id}`
      );
      if (response.ok) {
        const blob = await response.blob();

        const contentType = response.headers.get("Content-Type");
        const format = contentType.split("/")[1];

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}.${format}`;
        link.click();
      } else {
        console.error("Failed to download image.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box display="flex" flexDirection="column">
      {keuring && (
        <header className={styles.header}>
          <Box display="flex" alignItems="center">
            <FaArrowLeft
              size={28}
              onClick={() => router.back()}
              className={styles.backBtn}
            />
            <Heading size="md" ml={3}>
              KEURING
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
            <EditForm id={keuring.id} />
            <Tooltip label="Verwijder keuring" placement="bottom-end">
              <IconButton
                size="lg"
                icon={<MdDelete />}
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
        </header>
      )}
      <main className={styles.main}>
        <div className={styles.keuringContainer}>
          <Box display="flex" gap="20px">
            <Box className={styles.cardBox} width="fit-content">
              <Box className={styles.box}>
                <Heading size="sm">Klant</Heading>
                <List mt={5}>
                  {keuring && (
                    <>
                      <ListItem className={styles.klant} fontSize="sm">
                        <MdPerson size={24} style={{ margin: "0 20px" }} />
                        {/* <Text fontSize="sm"> */}
                        {keuring.adresID?.klantID?.voornaam +
                          " " +
                          keuring.adresID?.klantID?.familienaam}
                        {/* </Text> */}
                      </ListItem>
                      <ListItem className={styles.klant} fontSize="sm">
                        <MdAlternateEmail
                          size={24}
                          style={{ margin: "0 20px" }}
                        />

                        {keuring.adresID?.klantID?.emailadres}
                      </ListItem>
                      <ListItem className={styles.klant} fontSize="sm">
                        <MdPhone size={24} style={{ margin: "0 20px" }} />
                        {keuring.adresID?.klantID?.telefoonnummer}
                      </ListItem>
                    </>
                  )}
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
                        {keuring.adresID?.straatnaam +
                          " " +
                          keuring.adresID?.nummer}
                      </ListItem>
                      <ListItem className={styles.adres} fontSize="sm">
                        <MdLocationCity
                          size={24}
                          style={{ margin: "0 20px" }}
                        />
                        {keuring.adresID?.postcode +
                          " " +
                          keuring.adresID?.gemeente}
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
                {keuring?.facturatieID.naar !== Facturatie.ANDERS ? (
                  <Text ml="24px">
                    {keuring?.facturatieID.naar == Facturatie.IMMO
                      ? `${keuring?.facturatieID.naar} - ${keuring?.created_by.ondernemingID.naam}`
                      : keuring?.facturatieID.naar}
                  </Text>
                ) : null}

                {keuring?.facturatieID.naar == Facturatie.ANDERS ? (
                  <>
                    <List>
                      <ListItem className={styles.klant} fontSize="sm">
                        <MdPerson size={24} style={{ margin: "0 20px" }} />
                        {keuring.facturatieID.voornaam}{" "}
                        {keuring.facturatieID.familienaam}
                      </ListItem>
                      <ListItem className={styles.klant} fontSize="sm">
                        <MdAlternateEmail
                          size={24}
                          style={{ margin: "0 20px" }}
                        />
                        {keuring.facturatieID.emailadres}
                      </ListItem>
                      <ListItem className={styles.klant} fontSize="sm">
                        <MdPhone size={24} style={{ margin: "0 20px" }} />
                        {keuring.facturatieID.telefoonnummer}
                      </ListItem>
                      <ListItem className={styles.klant} fontSize="sm">
                        <MdHome size={24} style={{ margin: "0 20px" }} />
                        <Text>{`${keuring.facturatieID.straatnaam} ${keuring.facturatieID.nummer}`}</Text>
                      </ListItem>
                      <ListItem className={styles.klant} fontSize="sm">
                        <MdLocationCity
                          size={24}
                          style={{ margin: "0 20px" }}
                        />
                        <Text>
                          {`${keuring.facturatieID.postcode} ${keuring.facturatieID.gemeente}`}
                        </Text>
                      </ListItem>
                    </List>
                  </>
                ) : null}
              </Box>
            </Box>
            <Box className={styles.cardBox} width="100%" position="relative">
              <Box className={styles.box}>
                {extraDocumenten?.length > 0 ? (
                  <Box className={styles.editIconContainer}>
                    <Tooltip
                      label="Download alle documenten"
                      placement="bottom-end"
                    >
                      <Box className={styles.editIcon}>
                        <MdDownload size={21} />
                      </Box>
                    </Tooltip>
                    <Tooltip
                      label="Verwijder alle documenten"
                      placement="bottom-end"
                    >
                      <Box
                        className={styles.editIcon}
                        onClick={() => removeFiles("extradocs")}
                      >
                        <MdDelete size={21} />
                      </Box>
                    </Tooltip>
                  </Box>
                ) : null}
                <Heading size="sm">Extra documenten</Heading>
                {extraDocumenten?.length > 0 ? (
                  <List
                    mt="20px"
                    maxHeight="210px"
                    overflowY={extraDocumenten.length > 3 ? "scroll" : "auto"}
                  >
                    {extraDocumenten?.map((extraDoc) => (
                      <ListItem
                        mt={5}
                        pl={5}
                        key={extraDoc.id}
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
                          <FaRegFilePdf size={32} color="#F40F02" />
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
                            onClick={() =>
                              downloadFile(extraDoc.cldnry_id, extraDoc.name)
                            }
                          >
                            <MdDownload />
                          </Box>
                        </Tooltip>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box
                    mt="20px"
                    height="210px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text>Geen extra documenten</Text>
                  </Box>
                )}
              </Box>
              <Divider />
              <Box className={styles.box}>
                <div className={styles.editIconContainer}>
                  <Tooltip label="Download certificaat" placement="bottom-end">
                    <Box className={styles.editIcon}>
                      <MdDownload size={21} />
                    </Box>
                  </Tooltip>
                  <Tooltip label="Verwijder certificaat" placement="bottom-end">
                    <Box
                      className={styles.editIcon}
                      onClick={() => removeFiles("certificaat")}
                    >
                      <MdDelete size={21} />
                    </Box>
                  </Tooltip>
                </div>
                <Heading size="sm">Certificaat</Heading>
                {keuring?.type !== TypeKeuring.ASBEST ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    mt="40px"
                    pl={5}
                    height="50px"
                  >
                    <FaRegFilePdf size={32} color="#F40F02" />
                    <Text fontSize="sm" ml={5}>
                      EPC Certicaat - ...
                    </Text>
                    <Text fontSize="sm" ml="auto" mr={5}>
                      {formatFileSize(10000)}
                    </Text>
                    <Tooltip
                      label="Download EPC certificaat"
                      placement="bottom-start"
                    >
                      <Box
                        className={styles.editIcon}
                        onClick={() => downloadFile()}
                      >
                        <MdDownload />
                      </Box>
                    </Tooltip>
                  </Box>
                ) : null}
                {keuring?.type !== TypeKeuring.EPC ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    mt="20px"
                    pl={5}
                    height="50px"
                  >
                    <FaRegFilePdf size={32} color="#F40F02" />
                    <Text fontSize="sm" ml={5}>
                      Asbest Certicaat - ...
                    </Text>
                    <Text>{certificaatEPC}</Text>

                    <Text fontSize="sm" ml="auto" mr={5}>
                      {formatFileSize(10000)}
                    </Text>
                    <Tooltip
                      label="Download asbest certificaat"
                      placement="bottom-start"
                    >
                      <Box
                        className={styles.editIcon}
                        onClick={() => downloadFile()}
                      >
                        <MdDownload />
                      </Box>
                    </Tooltip>
                  </Box>
                ) : null}
              </Box>
              <Divider />
              <Box className={styles.box}>
                <Heading size="sm">Extra opmerkingen</Heading>
                {/* 140px */}
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
      </main>
    </Box>
  );
};

export default Keuring;
