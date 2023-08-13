import ExtraDocumentenDropzone from "@/components/ExtraDocumentenDropzone";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import Facturatie from "@/models/Facturatie";
import Status from "@/models/Status";
import ToegangEenheid from "@/models/ToegangEenheid";
import TypeKeuring from "@/models/TypeKeuring";
import styles from "@/styles/form.module.css";
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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  StackDivider,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  MdAlternateEmail,
  MdDelete,
  MdEdit,
  MdHome,
  MdLocationCity,
  MdPerson,
  MdPhone,
} from "react-icons/md";
import CertificaatUploader from "../CertificaatUploader";
import CheckboxTypeKeuring from "../CheckboxTypeKeuring";
import DatumPicker from "../DatumPicker";
import CertificateName from "../CertificateName";

const EditForm = ({ id }) => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    resetField,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      klantId: "",
      voornaam: "",
      familienaam: "",
      email: "",
      telefoonnummer: "",

      adresId: "",
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
      status: Status.NIEUW,
      zaakvoerder: "f3474995-7517-4640-beb9-30a522ee34c5",

      certificaat_epc: "",
      certificaat_asbest: "",

      extraDocumenten: [],
      toegang_eenheid: ToegangEenheid.KLANT,
      type: "",
      opmerking: "",
    },
  });

  const watchType = useWatch({ control, name: "type" });

  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();
  const {
    isOpen: isEditKeuringConfirmationOpen,
    onOpen: onEditKeuringConfirmationOpen,
    onClose: onEditKeuringConfirmationClose,
  } = useDisclosure();

  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  const user = useGetCurrentUser(supabase);
  const cancelRef = useRef();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      let { data: keuringData, error: keuringError } = await supabase
        .from("Keuring")
        .select(
          "id, datumPlaatsbezoek, epc_certificaat, asbest_certificaat, toegang_eenheid, opmerking, status, type, adresID(id, straatnaam, nummer, postcode, gemeente, klantID(id, voornaam, familienaam, emailadres, telefoonnummer)), facturatieID(id, naar, voornaam, familienaam, emailadres, telefoonnummer, straatnaam, nummer, postcode, gemeente)"
        )
        .eq("id", id);

      if (keuringData[0]) {
        const {
          adresID: {
            klantID: {
              id: klantId,
              voornaam,
              familienaam,
              emailadres,
              telefoonnummer,
            },
            id: adresId,
            straatnaam,
            nummer,
            postcode,
            gemeente,
          },
          toegang_eenheid,
          type,
          opmerking,
          facturatieID,
          datumPlaatsbezoek,
        } = keuringData[0];

        setValue("klantId", klantId);
        setValue("voornaam", voornaam);
        setValue("familienaam", familienaam);
        setValue("email", emailadres);
        setValue("telefoonnummer", telefoonnummer);

        setValue("adresId", adresId);
        setValue("straatnaam", straatnaam);
        setValue("nummer", nummer);
        setValue("postcode", postcode);
        setValue("gemeente", gemeente);

        setValue("datumPlaatsbezoek", datumPlaatsbezoek);
        setValue("toegang_eenheid", toegang_eenheid);
        setValue("type", type);
        setValue("opmerking", opmerking);

        setValue("facturatie_id", facturatieID.id);
        setValue("facturatie_naar", facturatieID.naar);
        if (facturatieID.naar == Facturatie.ANDERS) {
          setValue("facturatie_voornaam", facturatieID.voornaam);
          setValue("facturatie_familienaam", facturatieID.familienaam);
          setValue("facturatie_email", facturatieID.emailadres);
          setValue("facturatie_telefoonnummer", facturatieID.telefoonnummer);
          setValue("facturatie_straatnaam", facturatieID.straatnaam);
          setValue("facturatie_nummer", facturatieID.nummer);
          setValue("facturatie_postcode", facturatieID.postcode);
          setValue("facturatie_gemeente", facturatieID.gemeente);
        }
      }

      let { data: extraDocumentenData, error: extraDocumentenError } =
        await supabase.from("ExtraDocument").select("*").eq("keuringID", id);

      setValue("extraDocumenten", extraDocumentenData);

      let { data: certificatenData, error: certificatenError } = await supabase
        .from("Certificaat")
        .select("*")
        .eq("keuringID", id);

      const certEPC = certificatenData.filter(
        (certificaat) => certificaat.type == TypeKeuring.EPC
      );

      const certAsbest = certificatenData.filter(
        (certificaat) => certificaat.type == TypeKeuring.ASBEST
      );

      console.log(certEPC);
      console.log(certAsbest);
      if (certEPC[0]) {
        setValue("certificaat_epc", certEPC[0].id);
        setValue("certificaat_asbest", certAsbest[0].id);
      }
    };

    fetchData();
  }, [id]);

  const facturatieNaar = useWatch({ control, name: "facturatie_naar" });
  const watchCertEpc = useWatch({ control, name: "certificaat_epc" });
  const watchCertAsbest = useWatch({ control, name: "certificaat_asbest" });
  const watchExtraDocumenten = useWatch({ control, name: "extraDocumenten" });
  const watchDatumPlaatsbezoek = useWatch({
    control,
    name: "datumPlaatsbezoek",
  });

  useEffect(() => {
    if (facturatieNaar == Facturatie.ANDERS) {
      setValue("facturatie_voornaam", getValues("voornaam"));
      setValue("facturatie_familienaam", getValues("familienaam"));
      setValue("facturatie_email", getValues("email"));
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
  }, [facturatieNaar, getValues, resetField, setValue]);

  const onSubmit = (d) => {
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
        emailadres: getValues("email"),
        telefoonnummer: getValues("telefoonnummer"),
      })
      .eq("id", getValues("klantId"))
      .select();

    if (klantError) {
      console.error("Error wijzigen van klant: ", klantError);
    } else if (klantData.length > 0) {
      klantID = klantData[0].id || null;
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
    }

    if (klantID) {
      const { data: adresData, error: adresError } = await supabase
        .from("Adres")
        .update([
          {
            straatnaam: getValues("straatnaam"),
            nummer: +getValues("nummer"),
            postcode: +getValues("postcode"),
            gemeente: getValues("gemeente"),
            klantID: klantID,
            isFacturatieAdres:
              getValues("facturatie.naar") == Facturatie.HETZELFDE
                ? true
                : false,
          },
        ])
        .eq("id", getValues("adresId"))
        .select();

      if (adresError) {
        console.error("Error wijzigen van adres: ", adresError);
      } else if (adresData.length > 0) {
        adresID = adresData[0].id || null;
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
        })
        .eq("id", id)
        .select();

      if (keuringError) {
        console.error("Error wijzigen van keuring: ", keuringError);
      } else if (keuringData.length > 0) {
        keuringID = keuringData[0].id || null;
      }
    }

    if (watchExtraDocumenten.length > 0) {
      if (keuringID) {
        console.log(watchExtraDocumenten);
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
          }
        });
      }
    }

    onEditKeuringConfirmationClose();
    onFormClose();
  };

  const handleDeleteCertOnClick = async (idCert) => {
    const { error: certificaatError } = await supabase
      .from("Certificaat")
      .delete()
      .eq("id", idCert);

    if (certificaatError) {
      console.error("Error verwijderen van certificaat: ", certificaatError);
    } else {
      console.log("DELETED");
      watchType.includes(TypeKeuring.EPC)
        ? setValue("certificaat_epc", "")
        : setValue("certificaat_asbest", "");

      router.refresh();
    }
  };

  return (
    <>
      <Tooltip label="Pas keuring aan" placement="bottom-end">
        <IconButton
          size="lg"
          icon={<MdEdit className={styles.editIcon} size={24} />}
          ml="10px"
          className={styles.keuringEdit}
          onClick={() => onFormOpen()}
        />
      </Tooltip>
      <Modal onClose={onFormClose} isOpen={isFormOpen} size="full">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                <GridItem
                  colSpan={4}
                  bg="white"
                  boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
                >
                  <Card padding="5px 10px 0 10px" height="100%">
                    <CardBody>
                      <Stack divider={<StackDivider />} spacing={3}>
                        <Box>
                          <Heading size="sm" mb={5}>
                            Klant
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
                                  {...register("email", {
                                    pattern: { value: /\S+@\S+\.\S+/ },
                                  })}
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
                                  <InputLeftAddon size="sm">+32</InputLeftAddon>
                                  <Input
                                    {...register("telefoonnummer", {
                                      pattern:
                                        /^(?:(?:\+?\d{1,3})?[-. ]?)?\(?\d{1,}\)?[-. ]?\d+[-. ]?\d+$/,
                                    })}
                                    placeholder="Telefoonnummer"
                                    type="tel"
                                  />
                                </InputGroup>
                              </Box>
                            </ListItem>
                          </List>
                        </Box>

                        <Box>
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
                                  {...register("gemeente", { required: true })}
                                  width="70%"
                                  placeholder="Gemeente"
                                />
                              </InputGroup>
                            </ListItem>
                          </List>
                        </Box>
                      </Stack>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem
                  colSpan={4}
                  bg="white"
                  boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
                >
                  <Card padding="5px 10px 0 10px" height="100%">
                    <CardHeader padding="20px">
                      <Heading size="sm">Facturatie</Heading>
                    </CardHeader>
                    <CardBody>
                      <Controller
                        name="facturatie_naar"
                        control={control}
                        defaultValue={getValues("facturatie_naar")}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            colorScheme="green"
                            pl={5}
                            pb={5}
                          >
                            <Stack direction="row">
                              <Radio size="sm" value={Facturatie.HETZELFDE}>
                                {Facturatie.HETZELFDE}
                              </Radio>
                              <Radio size="sm" value={Facturatie.IMMO} ml={5}>
                                {Facturatie.IMMO}
                              </Radio>
                              <Radio size="sm" value={Facturatie.ANDERS} ml={5}>
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
                            style={{ marginLeft: "10px", marginRight: "30px" }}
                          />
                          <InputGroup gap="15px" flexDirection="column">
                            <Input
                              {...register("facturatie_voornaam")}
                              placeholder="Voornaam"
                              size="sm"
                              disabled={facturatieNaar !== Facturatie.ANDERS}
                            />
                            <Input
                              {...register("facturatie_familienaam")}
                              placeholder="Familienaam"
                              size="sm"
                              disabled={facturatieNaar !== Facturatie.ANDERS}
                            />
                          </InputGroup>
                        </ListItem>
                        <ListItem className={styles.klant}>
                          <MdAlternateEmail
                            size={32}
                            style={{ marginLeft: "10px", marginRight: "30px" }}
                          />

                          <Box width="100%">
                            <Input
                              {...register("facturatie_email")}
                              placeholder="E-mail"
                              size="sm"
                              disabled={facturatieNaar !== Facturatie.ANDERS}
                            />
                          </Box>
                        </ListItem>
                        <ListItem className={styles.klant}>
                          <MdPhone
                            size={32}
                            style={{ marginLeft: "10px", marginRight: "30px" }}
                          />

                          <Box width="100%">
                            <InputGroup size="sm">
                              <InputLeftAddon>+32</InputLeftAddon>
                              <Input
                                {...register("facturatie_telefoonnummer")}
                                placeholder="Telefoonnummer"
                                disabled={facturatieNaar !== Facturatie.ANDERS}
                              />
                            </InputGroup>
                          </Box>
                        </ListItem>
                        <ListItem className={styles.klant}>
                          <MdHome
                            size={32}
                            style={{ marginLeft: "10px", marginRight: "30px" }}
                          />
                          <InputGroup gap={2} size="sm">
                            <Input
                              width="75%"
                              {...register("facturatie_straatnaam")}
                              placeholder="Straat"
                              disabled={facturatieNaar !== Facturatie.ANDERS}
                            />

                            <Input
                              {...register("facturatie_nummer")}
                              width="25%"
                              placeholder="Nr"
                              disabled={facturatieNaar !== Facturatie.ANDERS}
                            />
                          </InputGroup>
                        </ListItem>
                        <ListItem className={styles.klant}>
                          <MdLocationCity
                            size={32}
                            style={{ marginLeft: "10px", marginRight: "30px" }}
                          />

                          <InputGroup gap={2} size="sm">
                            <Input
                              {...register("facturatie_postcode")}
                              width="30%"
                              placeholder="Postcode"
                              disabled={facturatieNaar !== Facturatie.ANDERS}
                            />

                            <Input
                              {...register("facturatie_gemeente")}
                              width="70%"
                              placeholder="Gemeente"
                              disabled={facturatieNaar !== Facturatie.ANDERS}
                            />
                          </InputGroup>
                        </ListItem>
                      </List>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem
                  colSpan={4}
                  bg="white"
                  boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
                >
                  <Card padding="5px 10px 0 10px" height="100%">
                    <Accordion allowToggle>
                      <AccordionItem>
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
                              {getValues("extraDocumenten").length}
                            </Text>
                          </CardHeader>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel>
                          <CardBody>
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
                      <AccordionItem>
                        <AccordionButton justifyContent="space-between">
                          <CardHeader
                            padding="20px"
                            display="flex"
                            alignItems="center"
                          >
                            <Heading size="sm">Certificaat</Heading>
                            {watchType !== "" && (
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
                            )}
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
                                  id={id}
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
                                        handleDeleteCertOnClick(watchCertEpc)
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
                                  id={id}
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
                                    <CertificateName
                                      watchCert={watchCertAsbest}
                                    />
                                    <IconButton
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteCertOnClick(watchCertAsbest)
                                      }
                                      icon={<MdDelete />}
                                    ></IconButton>
                                  </Box>
                                </Box>
                              )
                            ) : null}
                            {}
                          </CardBody>
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  </Card>
                </GridItem>

                <GridItem
                  colSpan={4}
                  bg="white"
                  boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
                >
                  <Card padding="5px 10px 0 10px" height="100%">
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
                                    size="sm"
                                    value={ToegangEenheid.KLANT}
                                    colorScheme="green"
                                  >
                                    {ToegangEenheid.KLANT}
                                  </Radio>
                                  <Radio
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
                <GridItem
                  colSpan={4}
                  bg="white"
                  boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
                >
                  <Card padding="5px 10px 0 10px" height="100%">
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
                <GridItem
                  colSpan={4}
                  bg="white"
                  boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
                >
                  <Card padding="5px 10px 0 10px" height="100%">
                    <CardHeader padding="20px">
                      <Heading size="sm">Planning plaatsbezoek</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                      <DatumPicker setValue={setValue} getValues={getValues} />
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </ModalBody>
            <ModalFooter>
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

                {errors.email ? (
                  <Badge variant="solid" colorScheme="red">
                    Email is niet geldig
                  </Badge>
                ) : (
                  ""
                )}

                {errors.telefoonnummer ? (
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
              <Spacer />
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
                        Ben je zeker dat u deze keuring wil aanpassen?
                        <Text>
                          WATCH CERT EPC: {JSON.stringify(watchCertEpc)}
                        </Text>
                        <Text>
                          WATCH CERT ASBEST: {JSON.stringify(watchCertAsbest)}
                        </Text>
                        <Text>
                          Datum plaatsbezoek:{" "}
                          {JSON.stringify(watchDatumPlaatsbezoek)}
                        </Text>
                      </AlertDialogBody>
                      <AlertDialogFooter>
                        <Button
                          ref={cancelRef}
                          onClick={onEditKeuringConfirmationClose}
                        >
                          Sluit venster
                        </Button>
                        <Button ml={3} onClick={handleEditKeuring}>
                          Pas Keuring aan
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
                {/* <UploadKeuringButton handleSubmit={handleSubmit} /> */}
                <Button onClick={onFormClose}>Sluiten</Button>
              </ButtonGroup>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditForm;
