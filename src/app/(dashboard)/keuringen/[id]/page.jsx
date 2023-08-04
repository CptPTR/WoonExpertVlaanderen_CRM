"use client";

import styles from "@/app/(dashboard)/keuringen/[id]/keuring.module.css";
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
  Tag,
  TagLabel,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Image } from "cloudinary-react";
import { Roboto } from "next/font/google";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaHandshake, FaRegFilePdf } from "react-icons/fa";
import { GiHouseKeys } from "react-icons/gi";
import {
  MdAlternateEmail,
  MdDelete,
  MdDownload,
  MdEmail,
  MdHome,
  MdLocationCity,
  MdPerson,
  MdPhone,
} from "react-icons/md";

const roboto900 = Roboto({ subsets: ["latin"], weight: "900" });

const Keuring = ({ params }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [keuring, setKeuring] = useState(null);
  const [extraDocumenten, setExtraDocumenten] = useState([]);

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

  const downloadFile = () => {};

  return (
    <Box display="flex" flexDirection="column">
      {keuring && (
        <header className={styles.header}>
          <Box display="flex" alignItems="center">
            <FaArrowLeft
              size={30}
              onClick={() => router.back()}
              className={styles.backBtn}
            />
            <h1 className={`${roboto900.className} ${styles.title}`}>
              KEURING
            </h1>
          </Box>
          <Box display="flex">
            <Tooltip label={keuring.toegang_eenheid} placement="bottom-end">
              <Tag
                className={styles.tag}
                variant="solid"
                bgColor="black"
                color="white"
              >
                <TagLabel>
                  {keuring.toegang_eenheid == ToegangEenheid.KLANT ? (
                    <FaHandshake size={30} />
                  ) : (
                    <GiHouseKeys size={30} />
                  )}
                </TagLabel>
              </Tag>
            </Tooltip>
            <Tag
              size="lg"
              className={styles.tag}
              variant="solid"
              bgColor="blackAlpha.700"
              color="white"
            >
              <TagLabel>{keuring.type}</TagLabel>
            </Tag>
            <Tag
              size="lg"
              className={styles.tag}
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
            <EditForm id={keuring.id} />
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
      <main className={styles.main}>
        <Text className={styles.ref}>Ref: {keuring?.id}</Text>
        <div className={styles.keuringContainer}>
          <Box display="flex" gap="20px">
            <Box className={styles.cardBox} width="fit-content">
              <Box className={styles.box}>
                <Heading size="md">Klant</Heading>
                <List mt={10}>
                  {keuring && (
                    <>
                      <ListItem className={styles.klant}>
                        <MdPerson size={24} style={{ margin: "0 20px" }} />
                        <Text>
                          {keuring.adresID?.klantID?.voornaam +
                            " " +
                            keuring.adresID?.klantID?.familienaam}
                        </Text>
                      </ListItem>
                      <ListItem className={styles.klant}>
                        <MdAlternateEmail
                          size={24}
                          style={{ margin: "0 20px" }}
                        />
                        <Text>{keuring.adresID?.klantID?.emailadres}</Text>
                      </ListItem>
                      <ListItem className={styles.klant}>
                        <MdPhone size={24} style={{ margin: "0 20px" }} />
                        <Text>{keuring.adresID?.klantID?.telefoonnummer}</Text>
                      </ListItem>
                    </>
                  )}
                </List>
              </Box>
              <Divider />
              <Box className={styles.box}>
                <Heading size="md">Adres</Heading>
                <List mt={10}>
                  {keuring && (
                    <>
                      <ListItem className={styles.adres}>
                        <MdHome size={24} style={{ margin: "0 20px" }} />
                        <Text>
                          {keuring.adresID?.straatnaam +
                            " " +
                            keuring.adresID?.nummer}
                        </Text>
                      </ListItem>
                      <ListItem className={styles.adres}>
                        <MdLocationCity
                          size={24}
                          style={{ margin: "0 20px" }}
                        />
                        <Text>
                          {keuring.adresID?.postcode +
                            " " +
                            keuring.adresID?.gemeente}
                        </Text>
                      </ListItem>
                    </>
                  )}
                </List>
              </Box>
              <Divider />
              <Box className={styles.box}>
                <Heading size="md">Facturatie</Heading>
                {keuring?.facturatieID.naar !== Facturatie.ANDERS ? (
                  <Text mt={10} ml="24px">
                    {keuring?.facturatieID.naar == Facturatie.IMMO
                      ? `${keuring?.facturatieID.naar} - ${keuring?.created_by.ondernemingID.naam}`
                      : keuring?.facturatieID.naar}
                  </Text>
                ) : null}

                <Text mt={10}>
                  {keuring?.facturatieID.naar == Facturatie.ANDERS ? (
                    <>
                      <List>
                        <ListItem className={styles.klant}>
                          <MdPerson size={24} style={{ margin: "0 20px" }} />
                          {keuring.facturatieID.voornaam}{" "}
                          {keuring.facturatieID.familienaam}
                        </ListItem>
                        <ListItem className={styles.klant}>
                          <MdAlternateEmail
                            size={24}
                            style={{ margin: "0 20px" }}
                          />
                          {keuring.facturatieID.emailadres}
                        </ListItem>
                        <ListItem className={styles.klant}>
                          <MdPhone size={24} style={{ margin: "0 20px" }} />
                          {keuring.facturatieID.telefoonnummer}
                        </ListItem>
                        <ListItem className={styles.klant}>
                          <MdHome size={24} style={{ margin: "0 20px" }} />
                          <Text>{`${keuring.facturatieID.straatnaam} ${keuring.facturatieID.nummer}`}</Text>
                        </ListItem>
                        <ListItem className={styles.klant}>
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
                </Text>
              </Box>
            </Box>
            <Box className={styles.cardBox} width="100%" position="relative">
              <Box className={styles.box}>
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
                <Heading size="md">Extra documenten</Heading>
                {extraDocumenten?.length > 0 ? (
                  <List
                    mt="20px"
                    height="210px"
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
                          <FaRegFilePdf size={48} color="#F40F02" />
                        )}
                        <Text ml={5}>{extraDoc.name}</Text>
                        <Text ml="auto" mr={5}>
                          {formatFileSize(extraDoc.size)}
                        </Text>
                        <Tooltip
                          label="Download document"
                          placement="bottom-start"
                        >
                          <div
                            className={styles.editIconContainer}
                            onClick={() => downloadFile()}
                          >
                            <MdDownload size={24} />
                          </div>
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
                <Heading size="md">Certificaat</Heading>
                {keuring?.type !== TypeKeuring.ASBEST ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    mt="40px"
                    pl={5}
                    height="50px"
                  >
                    <FaRegFilePdf size={48} color="#F40F02" />
                    <Text ml={5}>EPC Certicaat - ...</Text>
                    <Text ml="auto" mr={5}>
                      {formatFileSize(10000)}
                    </Text>
                    <Tooltip
                      label="Download EPC certificaat"
                      placement="bottom-start"
                    >
                      <div
                        className={styles.editIconContainer}
                        onClick={() => downloadFile()}
                      >
                        <MdDownload size={24} />
                      </div>
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
                    <FaRegFilePdf size={48} color="#F40F02" />
                    <Text ml={5}>Asbest Certicaat - ...</Text>
                    <Text ml="auto" mr={5}>
                      {formatFileSize(10000)}
                    </Text>
                    <Tooltip
                      label="Download asbest certificaat"
                      placement="bottom-start"
                    >
                      <div
                        className={styles.editIconContainer}
                        onClick={() => downloadFile()}
                      >
                        <MdDownload size={24} />
                      </div>
                    </Tooltip>
                  </Box>
                ) : null}
              </Box>
              <Divider />
              <Box className={styles.box}>
                <Heading size="md">Extra opmerkingen</Heading>
                {/* 140px */}
                <Text height={"100px"} className={styles.opmerking} mt={5}>
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
