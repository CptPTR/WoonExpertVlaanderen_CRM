"use client";

import styles from "@/app/(dashboard)/keuringen/[id]/edit/keuringEdit.module.css";
import CertificaatUploader from "@/components/CertificaatUploader";
import CertificateName from "@/components/CertificateName";
import CheckboxTypeKeuring from "@/components/CheckboxTypeKeuring";
import DatumPicker from "@/components/DatumPicker";
import ExtraDocumentenDropzone from "@/components/ExtraDocumentenDropzone";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import Facturatie from "@/models/Facturatie";
import Status from "@/models/Status";
import ToegangEenheid from "@/models/ToegangEenheid";
import TypeKeuring from "@/models/TypeKeuring";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import {
  MdAlternateEmail,
  MdDelete,
  MdHome,
  MdLocationCity,
  MdPerson,
  MdPhone,
} from "react-icons/md";

const EditKeuring = () => {
  const params = useParams();
  const cancelRef = useRef();
  const router = useRouter();

  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  const user = useGetCurrentUser(supabase);

  const {
    isOpen: isEditKeuringConfirmationOpen,
    onOpen: onEditKeuringConfirmationOpen,
    onClose: onEditKeuringConfirmationClose,
  } = useDisclosure();

  const {
    setValue,
    register,
    control,
    getValues,
    resetField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      klantID: "",
      voornaam: "",
      familienaam: "",
      emailadres: "",
      telefoonnummer: "",

      adresID: "",
      straatnaam: "",
      nummer: "",
      postcode: "",
      gemeente: "",

      facturatie_id: "",
      facturatie_naar: Facturatie.IMMO,
      facturatie_voornaam: "",
      facturatie_familienaam: "",
      facturatie_email: "",
      facturatie_telefoonnummer: "",
      facturatie_straatnaam: "",
      facturatie_nummer: "",
      facturatie_postcode: "",
      facturatie_gemeente: "",

      datumPlaatsbezoek: null,
      plaatsbezoekEventId: null,
      plaatsbezoekEventIdAsbest: null,
      status: Status.NIEUW,
      zaakvoerder: process.env.ZAAKVOERDER,

      certificaat_epc: "",
      certificaat_asbest: "",

      extraDocumenten: [],
      toegang_eenheid: ToegangEenheid.KLANT,
      type: "",
      opmerking: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: keuringData, error: keuringError } = await supabase
        .from("Keuring")
        .select(
          "id, datumToewijzing, datumPlaatsbezoek, Adres(*, Klant(*)), toegewezen_aan, status, type, opmerking, toegang_eenheid, Facturatie(*), eventID, eventIDAsbest"
        )
        .eq("id", params.id);

      if (keuringData) {
        const keuring = keuringData.at(0);

        setValue("klantID", keuring.Adres.Klant.id);
        setValue("voornaam", keuring.Adres.Klant.voornaam);
        setValue("familienaam", keuring.Adres.Klant.familienaam);
        setValue("emailadres", keuring.Adres.Klant.emailadres);
        setValue("telefoonnummer", keuring.Adres.Klant.telefoonnummer);

        setValue("adresID", keuring.Adres.id);
        setValue("straatnaam", keuring.Adres.straatnaam);
        setValue("nummer", keuring.Adres.nummer);
        setValue("postcode", keuring.Adres.postcode);
        setValue("gemeente", keuring.Adres.gemeente);

        setValue("datumPlaatsbezoek", keuring.datumPlaatsbezoek);
        setValue("plaatsbezoekEventId", keuring.eventID);
        setValue("plaatsbezoekEventIdAsbest", keuring.eventIDAsbest);
        setValue("toegang_eenheid", keuring.toegang_eenheid);
        setValue("type", keuring.type);
        setValue("status", keuring.status);
        setValue("opmerking", keuring.opmerking);

        setValue("facturatie_id", keuring.Facturatie.id);
        setValue("facturatie_naar", keuring.Facturatie.naar);
        if (keuring.Facturatie.naar == Facturatie.ANDERS) {
          setValue("facturatie_voornaam", keuring.Facturatie.voornaam);
          setValue("facturatie_familienaam", keuring.Facturatie.familienaam);
          setValue("facturatie_email", keuring.Facturatie.emailadres);
          setValue(
            "facturatie_telefoonnummer",
            keuring.Facturatie.telefoonnummer
          );
          setValue("facturatie_straatnaam", keuring.Facturatie.straatnaam);
          setValue("facturatie_nummer", keuring.Facturatie.nummer);
          setValue("facturatie_postcode", keuring.Facturatie.postcode);
          setValue("facturatie_gemeente", keuring.Facturatie.gemeente);
        }
      } else {
        console.error("Error fetching keuring data: ", keuringError);
      }

      const { data: extraDocumentData, error: extraDocumentError } =
        await supabase
          .from("ExtraDocument")
          .select("*")
          .eq("keuringID", params.id);

      if (extraDocumentData) {
        setValue("extraDocumenten", extraDocumentData);
      } else {
        console.error(
          "Error fetching extra document data: ",
          extraDocumentError
        );
      }

      const { data: certificaatData, error: certificaatError } = await supabase
        .from("Certificaat")
        .select("*")
        .eq("keuringID", params.id);

      if (certificaatData) {
        const certEPC = certificaatData.filter(
          (certificaat) => certificaat.type == TypeKeuring.EPC
        );

        const certAsbest = certificaatData.filter(
          (certificaat) => certificaat.type == TypeKeuring.ASBEST
        );

        if (certEPC[0]) {
          setValue("certificaat_epc", certEPC[0].id);
        }
        if (certAsbest[0]) {
          setValue("certificaat_asbest", certAsbest[0].id);
        }
      }
    };
    fetchData();
  }, [params.id]);

  const watchFacturatieNaar = useWatch({ control, name: "facturatie_naar" });
  const watchType = useWatch({ control, name: "type" });
  const watchCertEpc = useWatch({ control, name: "certificaat_epc" });
  const watchCertAsbest = useWatch({ control, name: "certificaat_asbest" });
  const watchExtraDocumenten = useWatch({ control, name: "extraDocumenten" });
  const watchDatumPlaatsbezoek = useWatch({
    control,
    name: "datumPlaatsbezoek",
  });
  const watchPlaatsbezoekEventId = useWatch({
    control,
    name: "plaatsbezoekEventId",
  });
  const watchPlaatsbezoekEventIdAsbest = useWatch({
    control,
    name: "plaatsbezoekEventIdAsbest",
  });

  useEffect(() => {
    if (watchFacturatieNaar == Facturatie.ANDERS) {
      console.log("copy klant adres data to facturatie");
      setValue("facturatie_voornaam", getValues("voornaam"));
      setValue("facturatie_familienaam", getValues("familienaam"));
      setValue("facturatie_email", getValues("emailadres"));
      setValue("facturatie_telefoonnummer", getValues("telefoonnummer"));
      setValue("facturatie_straatnaam", getValues("straatnaam"));
      setValue("facturatie_nummer", getValues("nummer"));
      setValue("facturatie_postcode", getValues("postcode"));
      setValue("facturatie_gemeente", getValues("gemeente"));
    } else {
      resetField("facturatie_voornaam");
      resetField("facturatie_familienaam");
      resetField("facturatie_email");
      resetField("facturatie_telefoonnummer");
      resetField("facturatie_straatnaam");
      resetField("facturatie_nummer");
      resetField("facturatie_postcode");
      resetField("facturatie_gemeente");
    }
  }, [watchFacturatieNaar]);

  const onSubmit = () => {
    onEditKeuringConfirmationOpen();
  };

  const handleEditKeuring = async () => {
    let klantID = null;
    let adresID = null;
    let facturatieID = null;
    let keuringID = null;

    const { data: klantData, error: klantError } = await supabase
      .from("Klant")
      .update({
        voornaam: getValues("voornaam"),
        familienaam: getValues("familienaam"),
        emailadres: getValues("emailadres"),
        telefoonnummer: getValues("telefoonnummer"),
      })
      .eq("id", getValues("klantID"))
      .select();

    if (klantError) {
      console.error("Error wijzigen van klant: ", klantError);
    } else if (klantData.length > 0) {
      klantID = klantData[0].id || null;
      setValue("voornaam", klantData[0].voornaam);
      setValue("familienaam", klantData[0].familienaam);
      setValue("emailadres", klantData[0].emailadres);
      setValue("telefoonnummer", klantData[0].telefoonnummer);
    }

    const { data: facturatieData, error: facturatieError } = await supabase
      .from("Facturatie")
      .update({
        naar: getValues("facturatie_naar"),
        voornaam:
          getValues("facturatie_naar") == Facturatie.ANDERS
            ? getValues("facturatie_voornaam")
            : null,
        familienaam:
          getValues("facturatie_naar") == Facturatie.ANDERS
            ? getValues("facturatie_familienaam")
            : null,
        emailadres:
          getValues("facturatie_naar") == Facturatie.ANDERS
            ? getValues("facturatie_email")
            : null,
        telefoonnummer:
          getValues("facturatie_naar") == Facturatie.ANDERS
            ? getValues("facturatie_telefoonnummer")
            : null,
        straatnaam:
          getValues("facturatie_naar") == Facturatie.ANDERS
            ? getValues("facturatie_straatnaam")
            : null,
        nummer:
          getValues("facturatie_naar") == Facturatie.ANDERS
            ? +getValues("facturatie_nummer")
            : null,
        postcode:
          getValues("facturatie_naar") == Facturatie.ANDERS
            ? +getValues("facturatie_postcode")
            : null,
        gemeente:
          getValues("facturatie_naar") == Facturatie.ANDERS
            ? getValues("facturatie_gemeente")
            : null,
      })
      .eq("id", getValues("facturatie_id"))
      .select();

    if (facturatieError) {
      console.error("Error wijzigen van facturatie: ", facturatieError);
    } else if (facturatieData.length > 0) {
      facturatieID = facturatieData[0].id || null;
      setValue("facturatie_voornaam", facturatieData[0].voornaam);
      setValue("facturatie_familienaam", facturatieData[0].familienaam);
      setValue("facturatie_email", facturatieData[0].emailadres);
      setValue("facturatie_telefoonnummer", facturatieData[0].telefoonnummer);
      setValue("facturatie_straatnaam", facturatieData[0].straatnaam);
      setValue("facturatie_nummer", facturatieData[0].nummer);
      setValue("facturatie_postcode", facturatieData[0].postcode);
      setValue("facturatie_gemeente", facturatieData[0].gemeente);
    }

    if (klantID) {
      const { data: adresData, error: adresError } = await supabase
        .from("Adres")
        .update([
          {
            straatnaam: getValues("straatnaam"),
            nummer: getValues("nummer"),
            postcode: +getValues("postcode"),
            gemeente: getValues("gemeente"),
            klantID: klantID,
            isFacturatieAdres:
              getValues("facturatie.naar") == Facturatie.HETZELFDE
                ? true
                : false,
          },
        ])
        .eq("id", getValues("adresID"))
        .select();

      if (adresError) {
        console.error("Error wijzigen van adres: ", adresError);
      } else if (adresData.length > 0) {
        adresID = adresData[0].id || null;
        setValue("straatnaam", adresData[0].straatnaam);
        setValue("nummer", adresData[0].nummer);
        setValue("gemeente", adresData[0].gemeente);
        setValue("postcode", adresData[0].postcode);
      }
    }

    if (adresID && facturatieID) {
      const { data: keuringData, error: keuringError } = await supabase
        .from("Keuring")
        .update({
          datumPlaatsbezoek: getValues("datumPlaatsbezoek"),
          adresID: adresID,
          facturatieID: facturatieID,
          toegewezen_aan: getValues("zaakvoerder"),
          status: getValues("status"),
          type: getValues("type"),
          opmerking: getValues("opmerking"),
          toegang_eenheid: getValues("toegang_eenheid"),
          eventID: getValues("plaatsbezoekEventId"),
          eventIDAsbest: getValues("plaatsbezoekEventIdAsbest"),
        })
        .eq("id", params.id)
        .select();

      if (keuringError) {
        console.error("Error wijzigen van keuring: ", keuringError);
      } else if (keuringData.length > 0) {
        keuringID = keuringData[0].id || null;
        setValue("datumPlaatsbezoek", keuringData[0].datumPlaatsbezoek);
        setValue("status", keuringData[0].status);
        setValue("type", keuringData[0].type);
        setValue("opmerking", keuringData[0].opmerking);
        setValue("toegang_eenheid", keuringData[0].toegang_eenheid);
        setValue("plaatsbezoekEventId", keuringData[0].eventID);
        setValue("plaatsbezoekEventIdAsbest", keuringData[0].eventIDAsbest);
      }
    }

    if (watchExtraDocumenten.length > 0) {
      if (keuringID) {
        watchExtraDocumenten.forEach(async (extraDocument) => {
          const { data: extraDocumentData, error: extraDocumentError } =
            await supabase
              .from("ExtraDocument")
              .upsert({
                id: extraDocument.id,
                format: extraDocument.format,
                name: extraDocument.name,
                size: extraDocument.size,
                cldnry_id: extraDocument.cldnry_id,
                keuringID: keuringID,
              })
              .select();

          if (extraDocumentError) {
            console.error(
              "Error wijzigen van extra document: ",
              extraDocumentError
            );
          } else {
            setValue("extraDocumenten", [...extraDocumentData]);
          }
        });
      }
    }

    router.replace(`/keuringen/${params.id}`);
  };

  const handleDeleteCertOnClick = async (idCert, typeRemoved) => {
    if (idCert) {
      const { error: certificaatError } = await supabase
        .from("Certificaat")
        .delete()
        .eq("id", idCert);

      if (certificaatError) {
        console.error(
          "Error (EditForm) verwijderen van certificaat: ",
          certificaatError
        );
      } else {
        switch (typeRemoved) {
          case TypeKeuring.EPC:
            setValue("certificaat_epc", "");
            break;
          case TypeKeuring.ASBEST:
            setValue("certificaat_asbest", "");
            break;
        }
      }
    }
  };

  const datumPlaatsbezoek = watch("datumPlaatsbezoek");
  const pbEventId = watch("plaatsbezoekEventId");
  const pbEventIdAsbest = watch("plaatsbezoekEventIdAsbest");

  return (
    <Box display="flex" flexDirection="column">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          my={5}
        >
          <Box display="flex" alignItems="center" p={3}>
            <FaArrowLeft
              size={28}
              onClick={() => router.back()}
              className={styles.backBtn}
            />
            <Heading size="md" ml={3}>
              Keuring aanpassen
            </Heading>
          </Box>
          <Box display="flex" alignSelf="flex-end">
            <ButtonGroup rowGap={2}>
              <Button type="submit">Aanpassen</Button>
              <AlertDialog
                isOpen={isEditKeuringConfirmationOpen}
                leastDestructiveRef={cancelRef}
                onClose={onEditKeuringConfirmationClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Keuring aanpassen
                    </AlertDialogHeader>
                    <AlertDialogBody>
                      <Text>
                        Bent u zeker dat u deze keuring wil aanpassen?
                      </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                      <Button
                        ref={cancelRef}
                        onClick={onEditKeuringConfirmationClose}
                      >
                        Neen, sluit venster
                      </Button>
                      <Button ml={3} onClick={handleEditKeuring}>
                        Bevestigen
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </ButtonGroup>
          </Box>
        </Box>
        <Box className={styles.validationErrors}>
          {errors.voornaam?.type === "required" ? (
            <Badge variant="solid" colorScheme="red">
              Voornaam is vereist
            </Badge>
          ) : (
            ""
          )}

          {errors.familienaam?.type === "required" ? (
            <Badge variant="solid" colorScheme="red">
              Familienaam is vereist
            </Badge>
          ) : (
            ""
          )}

          {errors.emailadres?.type === "required" ? (
            <Badge variant="solid" colorScheme="red">
              Emailadres is vereist
            </Badge>
          ) : (
            ""
          )}

          {errors.emailadres?.type === "pattern" ? (
            <Badge variant="solid" colorScheme="red">
              Emailadres is niet geldig
            </Badge>
          ) : (
            ""
          )}

          {errors.telefoonnummer?.type === "required" ? (
            <Badge variant="solid" colorScheme="red">
              Telefoonnummer is vereist
            </Badge>
          ) : (
            ""
          )}

          {errors.telefoonnummer?.type === "pattern" ? (
            <Badge variant="solid" colorScheme="red">
              Telefoonnummer is niet geldig
            </Badge>
          ) : (
            ""
          )}

          {errors.straatnaam?.type === "required" ? (
            <Badge variant="solid" colorScheme="red">
              Straatnaam is vereist
            </Badge>
          ) : (
            ""
          )}

          {errors.nummer?.type === "required" ? (
            <Badge variant="solid" colorScheme="red">
              Huisnummer is vereist
            </Badge>
          ) : (
            ""
          )}

          {errors.postcode?.type === "required" ? (
            <Badge variant="solid" colorScheme="red">
              Postcode is vereist
            </Badge>
          ) : (
            ""
          )}

          {errors.postcode ? (
            <Badge variant="solid" colorScheme="red">
              Postcode is niet geldig
            </Badge>
          ) : (
            ""
          )}

          {errors.gemeente?.type === "required" ? (
            <Badge variant="solid" colorScheme="red">
              Gemeente is vereist
            </Badge>
          ) : (
            ""
          )}
        </Box>
        <Grid templateColumns="repeat(12, 1fr)" gap={3} mb={10}>
          <GridItem colSpan={4} bg="white">
            <Card height="100%">
              <CardBody>
                <Box>
                  <Heading size="sm" mb={5}>
                    Keuring
                  </Heading>
                  <List>
                    <ListItem className={styles.klant}>
                      <MdPerson
                        size={32}
                        style={{
                          marginLeft: "10px",
                          marginRight: "30px",
                        }}
                      />
                      <InputGroup gap="15px" flexDirection="column">
                        <Input
                          {...register("voornaam", {
                            required: true,
                          })}
                          placeholder="Voornaam"
                          size="sm"
                        />

                        <Input
                          {...register("familienaam", {
                            required: true,
                          })}
                          placeholder="Familienaam"
                          size="sm"
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
                          {...register("emailadres", {
                            required: true,
                            pattern: { value: /\S+@\S+\.\S+/ },
                          })}
                          placeholder="E-mail"
                          size="sm"
                          autoComplete="on"
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
                          <InputLeftAddon size="sm">+32</InputLeftAddon>
                          <Input
                            {...register("telefoonnummer", {
                              required: true,
                              pattern:
                                /^(?:(?:\+|00)32\s?|)(?:(?:4[789]\d|9\d)(?:\s?\d{2}){3}|(?:(?:\+|00)32\s?|)(?:\d\s?\d{3}|\d{2}\s?\d{2})(?:\s?\d{2}){2})$/,
                            })}
                            placeholder="Telefoonnummer"
                            type="tel"
                          />
                        </InputGroup>
                      </Box>
                    </ListItem>
                  </List>
                </Box>
                <Box mt={10}>
                  <Heading size="sm" mb={3} mt={2}>
                    Adres
                  </Heading>
                  <List>
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
                          {...register("straatnaam", {
                            required: true,
                          })}
                          placeholder="Straat"
                        />

                        <Input
                          {...register("nummer", { required: true })}
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
                          {...register("postcode", {
                            required: true,
                            pattern: /^[1-9]\d{3}$/,
                          })}
                          width="30%"
                          placeholder="Postcode"
                        />
                        <Input
                          {...register("gemeente", {
                            required: true,
                          })}
                          width="70%"
                          placeholder="Gemeente"
                        />
                      </InputGroup>
                    </ListItem>
                  </List>
                </Box>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem colSpan={4} bg="white">
            <Card height="100%">
              <CardHeader padding="20px">
                <Heading size="sm">Facturatie</Heading>
              </CardHeader>
              <CardBody>
                <Controller
                  name="facturatie_naar"
                  control={control}
                  defaultValue={getValues("facturatie_naar")}
                  render={({ field }) => (
                    <RadioGroup {...field} colorScheme="green" pl={5} pb={5}>
                      <Stack direction="row">
                        <Radio
                          id="fac_naar_hetzelfde"
                          size="sm"
                          value={Facturatie.HETZELFDE}
                        >
                          {Facturatie.HETZELFDE}
                        </Radio>
                        <Radio
                          id="fac_naar_immo"
                          size="sm"
                          value={Facturatie.IMMO}
                          ml={5}
                        >
                          {Facturatie.IMMO}
                        </Radio>
                        <Radio
                          id="fac_naar_anders"
                          size="sm"
                          value={Facturatie.ANDERS}
                          ml={5}
                        >
                          {Facturatie.ANDERS}
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  )}
                />
                <List>
                  <ListItem className={styles.klant}>
                    <MdPerson
                      size={32}
                      style={{
                        marginLeft: "10px",
                        marginRight: "30px",
                      }}
                    />
                    <InputGroup gap="15px" flexDirection="column">
                      <Input
                        {...register("facturatie_voornaam")}
                        placeholder="Voornaam"
                        size="sm"
                        disabled={watchFacturatieNaar !== Facturatie.ANDERS}
                      />
                      <Input
                        {...register("facturatie_familienaam")}
                        placeholder="Familienaam"
                        size="sm"
                        disabled={watchFacturatieNaar !== Facturatie.ANDERS}
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
                        {...register("facturatie_email")}
                        placeholder="E-mail"
                        size="sm"
                        disabled={watchFacturatieNaar !== Facturatie.ANDERS}
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
                          placeholder="Telefoonnummer"
                          disabled={watchFacturatieNaar !== Facturatie.ANDERS}
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
                        placeholder="Straat"
                        disabled={watchFacturatieNaar !== Facturatie.ANDERS}
                      />

                      <Input
                        {...register("facturatie_nummer")}
                        width="25%"
                        placeholder="Nr"
                        disabled={watchFacturatieNaar !== Facturatie.ANDERS}
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
                        width="30%"
                        placeholder="Postcode"
                        disabled={watchFacturatieNaar !== Facturatie.ANDERS}
                      />

                      <Input
                        {...register("facturatie_gemeente")}
                        width="70%"
                        placeholder="Gemeente"
                        disabled={watchFacturatieNaar !== Facturatie.ANDERS}
                      />
                    </InputGroup>
                  </ListItem>
                </List>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem colSpan={4} bg="white">
            <Card padding="5px 10px 0 10px" height="100%">
              <Accordion allowToggle defaultIndex={[1]}>
                <AccordionItem id="accordion_extradocs">
                  <AccordionButton justifyContent="space-between">
                    <CardHeader padding="20px" display="flex">
                      <Heading size="sm">Extra documenten</Heading>
                      <Text
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        fontSize="sm"
                        ml={3}
                        backgroundColor="lightgreen"
                        padding={1}
                        borderRadius={10}
                        h={6}
                        w={6}
                      >
                        {getValues("extraDocumenten")?.length}
                      </Text>
                    </CardHeader>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <CardBody padding={0}>
                      <ExtraDocumentenDropzone
                        acceptFileType="images"
                        multipleFiles
                        text="Sleep hier afbeeldingen/PDF-bestanden naartoe, of klik om ze te selecteren."
                        setValue={setValue}
                        getValues={getValues}
                        extraDocumenten={watchExtraDocumenten}
                      />
                    </CardBody>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem id="accordion_certificates">
                  <AccordionButton justifyContent="space-between">
                    <CardHeader
                      padding="20px"
                      display="flex"
                      alignItems="center"
                    >
                      <Heading size="sm">Certificaat</Heading>
                      <Text
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        fontSize="sm"
                        ml={3}
                        backgroundColor="lightgreen"
                        padding={1}
                        borderRadius={10}
                        h={6}
                        w={10}
                      >
                        {watchCertEpc && watchCertAsbest
                          ? 2
                          : watchCertEpc || watchCertAsbest
                          ? 1
                          : 0}
                        /
                        {watchType.includes(TypeKeuring.EPC) &&
                        watchType.includes(TypeKeuring.ASBEST)
                          ? 2
                          : 1}
                      </Text>
                    </CardHeader>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <CardBody pt={0}>
                      {watchType.includes(TypeKeuring.EPC) ? (
                        !watchCertEpc ? (
                          <CertificaatUploader
                            type="EPC"
                            setValue={setValue}
                            id={params.id}
                          />
                        ) : (
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                            justifyContent="space-between"
                            mb={5}
                          >
                            <Text fontSize="sm" fontWeight="bold">
                              EPC
                            </Text>
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              width="100%"
                            >
                              <CertificateName watchCert={watchCertEpc} />

                              <IconButton
                                size="sm"
                                onClick={() =>
                                  handleDeleteCertOnClick(
                                    watchCertEpc,
                                    TypeKeuring.EPC
                                  )
                                }
                                icon={<MdDelete />}
                              ></IconButton>
                            </Box>
                          </Box>
                        )
                      ) : null}

                      {watchType.includes(TypeKeuring.ASBEST) ? (
                        !watchCertAsbest ? (
                          <CertificaatUploader
                            type="Asbest"
                            setValue={setValue}
                            id={params.id}
                          />
                        ) : (
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                            justifyContent="space-between"
                            mb={5}
                          >
                            <Text fontSize="sm" fontWeight="bold">
                              Asbest
                            </Text>
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              width="100%"
                            >
                              <CertificateName watchCert={watchCertAsbest} />
                              <IconButton
                                size="sm"
                                onClick={() =>
                                  handleDeleteCertOnClick(
                                    watchCertAsbest,
                                    TypeKeuring.ASBEST
                                  )
                                }
                                icon={<MdDelete />}
                              ></IconButton>
                            </Box>
                          </Box>
                        )
                      ) : null}
                    </CardBody>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Card>
          </GridItem>

          <GridItem colSpan={4} bg="white">
            <Card height="100%">
              <Stack
                height="100%"
                direction="row"
                divider={<Divider orientation="vertical" />}
              >
                <Box paddingRight={5}>
                  <CardHeader padding="20px">
                    <Heading size="sm">Toegang eenheid</Heading>
                  </CardHeader>
                  <CardBody padding={0} className={styles.cardBody}>
                    <Controller
                      name="toegang_eenheid"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup {...field} ml={5}>
                          <Stack ml={15} gap={0}>
                            <Radio
                              id="toegang_eenheid_klant"
                              size="sm"
                              value={ToegangEenheid.KLANT}
                              colorScheme="green"
                            >
                              {ToegangEenheid.KLANT}
                            </Radio>
                            <Radio
                              id="toegang_eenheid_sleutels_ophalen"
                              size="sm"
                              value={ToegangEenheid.SLEUTEL_OPHALEN}
                              colorScheme="green"
                            >
                              {ToegangEenheid.SLEUTEL_OPHALEN}
                            </Radio>
                          </Stack>
                        </RadioGroup>
                      )}
                    />
                  </CardBody>
                </Box>
                <Box paddingLeft={5}>
                  <CardHeader padding="20px 0">
                    <Heading size="sm">Type</Heading>
                  </CardHeader>
                  <CardBody padding={0} className={styles.cardBody}>
                    <CheckboxTypeKeuring
                      control={control}
                      typeKeuring={watchType}
                      setValue={setValue}
                      getValues={getValues}
                    />
                  </CardBody>
                </Box>
              </Stack>
            </Card>
          </GridItem>
          <GridItem colSpan={4} bg="white">
            <Card height="100%">
              <CardHeader padding="20px">
                <Heading size="sm">Extra opmerkingen</Heading>
              </CardHeader>
              <CardBody pt={0}>
                <Textarea
                  padding="10px"
                  resize="none"
                  borderRadius="5px"
                  borderColor="blackAlpha.500"
                  {...register("opmerking")}
                />
              </CardBody>
            </Card>
          </GridItem>
          {user.rol == "zaakvoerder" ? (
            <GridItem colSpan={4} bg="white">
              <Card height="100%">
                <CardHeader padding="20px">
                  <Heading size="sm">Planning plaatsbezoek</Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <DatumPicker
                    setValue={setValue}
                    getValues={getValues}
                    defaultValue={datumPlaatsbezoek || null}
                    plaatsbezoekEventId={pbEventId}
                    plaatsbezoekEventIdAsbest={pbEventIdAsbest}
                    // datumPlaatsbezoek={datumPlaatsbezoek}
                    control={control}
                    // watchDatumPlaatsbezoek={watchDatumPlaatsbezoek}
                    // watchPlaatsbezoekEventId={watchPlaatsbezoekEventId}
                    // watchPlaatsbezoekEventIdAsbest={
                    //   watchPlaatsbezoekEventIdAsbest
                    // }
                  />
                </CardBody>
              </Card>
            </GridItem>
          ) : null}
        </Grid>
      </form>
    </Box>
  );
};

export default EditKeuring;
