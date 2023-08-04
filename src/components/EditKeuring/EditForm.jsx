import ExtraDocumentenDropzone from "@/components/ExtraDocumentenDropzone";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import Facturatie from "@/models/Facturatie";
import Status from "@/models/Status";
import ToegangEenheid from "@/models/ToegangEenheid";
import styles from "@/styles/nieuwekeuringform.module.css";
import {
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
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
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
import { useEffect, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  MdAlternateEmail,
  MdEdit,
  MdHome,
  MdLocationCity,
  MdPerson,
  MdPhone,
} from "react-icons/md";
import CheckboxTypeKeuring from "../CheckboxTypeKeuring";

const EditForm = ({ id }) => {
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

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      voornaam: "",
      familienaam: "",
      email: "",
      telefoonnummer: "",
      straatnaam: "",
      nummer: "",
      postcode: "",
      gemeente: "",

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

      certificaat_epc: null,
      certificaat_asbest: null,

      extraDocumenten: [],
      toegang_eenheid: ToegangEenheid.KLANT,
      type: "",
      opmerking: "",
    },
  });

  useEffect(() => {
    const getKeuringData = async () => {
      let { data: keuringData, error: keuringError } = await supabase
        .from("Keuring")
        .select(
          "id, datumPlaatsbezoek, epc_certificaat, asbest_certificaat, toegang_eenheid, opmerking, status, type, adresID(straatnaam, nummer, postcode, gemeente, klantID(voornaam, familienaam, emailadres, telefoonnummer)), facturatieID(naar, voornaam, familienaam, emailadres, telefoonnummer, straatnaam, nummer, postcode, gemeente)"
        )
        .eq("id", id);

      if (keuringData[0]) {
        const {
          adresID: {
            klantID: { voornaam, familienaam, emailadres, telefoonnummer },
            straatnaam,
            nummer,
            postcode,
            gemeente,
          },
          toegang_eenheid,
          type,
          opmerking,
          facturatieID,
        } = keuringData[0];

        setValue("voornaam", voornaam);
        setValue("familienaam", familienaam);
        setValue("email", emailadres);
        setValue("telefoonnummer", telefoonnummer);

        setValue("straatnaam", straatnaam);
        setValue("nummer", nummer);
        setValue("postcode", postcode);
        setValue("gemeente", gemeente);

        setValue("toegang_eenheid", toegang_eenheid);
        setValue("type", type);
        setValue("opmerking", opmerking);

        setValue("facturatie_naar", facturatieID.naar);
        setValue("facturatie_voornaam", facturatieID.voornaam);
        setValue("facturatie_familienaam", facturatieID.familienaam);
        setValue("facturatie_email", facturatieID.emailadres);
        setValue("facturatie_telefoonnummer", facturatieID.telefoonnummer);
        setValue("facturatie_straatnaam", facturatieID.straatnaam);
        setValue("facturatie_nummer", facturatieID.nummer);
        setValue("facturatie_postcode", facturatieID.postcode);
        setValue("facturatie_gemeente", facturatieID.gemeente);
      }
    };
    // const getExtraDocumentenData = async () => {
    //   let { data: extraDocumentenData, error: extraDocumentenError } =
    //     await supabase.from("ExtraDocument").select("*").eq("id", id);
    //   setExtraDocumenten(extraDocumentenData);
    // };

    getKeuringData();
    // getExtraDocumentenData();
  }, [id, setValue, supabase]);

  const facturatieNaar = useWatch({ control, name: "facturatie_naar" });

  const onSubmit = (d) => {
    onEditKeuringConfirmationOpen();
  };

  const handleEditKeuring = () => {};

  //   const handleUploadKeuring = async () => {
  //     let klantID = null;
  //     let adresID = null;
  //     let facturatieID = null;
  //     let keuringID = null;

  //     const { data: klantData, error: klantError } = await supabase
  //       .from("Klant")
  //       .insert([
  //         {
  //           voornaam: getValues("voornaam"),
  //           familienaam: getValues("familienaam"),
  //           emailadres: getValues("email"),
  //           telefoonnummer: getValues("telefoonnummer"),
  //         },
  //       ])
  //       .select();

  //     if (klantError) {
  //       console.error("Error toevoegen van klant: ", klantError);
  //     } else if (klantData.length > 0) {
  //       klantID = klantData[0].id || null;
  //     }

  //     const { data: facturatieData, error: facturatieError } = await supabase
  //       .from("Facturatie")
  //       .insert({
  //         naar: getValues("facturatie.naar"),
  //         voornaam:
  //           getValues("facturatie.naar") == Facturatie.HETZELFDE
  //             ? getValues("voornaam")
  //             : getValues("facturatie.voornaam"),
  //         familienaam:
  //           getValues("facturatie.naar") == Facturatie.HETZELFDE
  //             ? getValues("familienaam")
  //             : getValues("facturatie.familienaam"),
  //         emailadres:
  //           getValues("facturatie.naar") == Facturatie.HETZELFDE
  //             ? getValues("email")
  //             : getValues("facturatie.email"),
  //         telefoonnummer:
  //           getValues("facturatie.naar") == Facturatie.HETZELFDE
  //             ? getValues("telefoonnummer")
  //             : getValues("facturatie.telefoonnummer"),
  //         straatnaam:
  //           getValues("facturatie.naar") == Facturatie.HETZELFDE
  //             ? getValues("straatnaam")
  //             : getValues("facturatie.straatnaam"),
  //         nummer:
  //           getValues("facturatie.naar") == Facturatie.HETZELFDE
  //             ? +getValues("nummer")
  //             : +getValues("facturatie.nummer"),
  //         postcode:
  //           getValues("facturatie.naar") == Facturatie.HETZELFDE
  //             ? +getValues("postcode")
  //             : +getValues("facturatie.postcode"),
  //         gemeente:
  //           getValues("facturatie.naar") == Facturatie.HETZELFDE
  //             ? getValues("gemeente")
  //             : getValues("facturatie.gemeente"),
  //       })
  //       .select();

  //     if (facturatieError) {
  //       console.error("Error toevoegen van facturatie: ", facturatieError);
  //     } else if (facturatieData.length > 0) {
  //       facturatieID = facturatieData[0].id || null;
  //     }

  //     if (klantID) {
  //       const { data: adresData, error: adresError } = await supabase
  //         .from("Adres")
  //         .insert([
  //           {
  //             straatnaam: getValues("straatnaam"),
  //             nummer: getValues("nummer"),
  //             postcode: +getValues("postcode"),
  //             gemeente: getValues("gemeente"),
  //             klantID: klantID,
  //             isFacturatieAdres:
  //               getValues("facturatie.naar") == Facturatie.HETZELFDE
  //                 ? true
  //                 : false,
  //           },
  //         ])
  //         .select();

  //       if (adresError) {
  //         console.error("Error toevoegen van adres: ", adresError);
  //       } else if (adresData.length > 0) {
  //         adresID = adresData[0].id || null;
  //       }
  //     }

  //     if (adresID && facturatieID) {
  //       const { data: keuringData, error: keuringError } = await supabase
  //         .from("Keuring")
  //         .insert({
  //           datumPlaatsbezoek: getValues("datumPlaatsbezoek"),
  //           adresID: adresID,
  //           facturatieID: facturatieID,
  //           toegewezen_aan: getValues("zaakvoerder"),
  //           status: getValues("status"),
  //           type: getValues("type"),
  //           created_by: user.id,
  //           opmerking: getValues("opmerking"),
  //           toegang_eenheid: getValues("toegang_eenheid"),
  //         })
  //         .select();

  //       if (keuringError) {
  //         console.error("Error toevoegen van keuring: ", keuringError);
  //       } else if (keuringData.length > 0) {
  //         keuringID = keuringData[0].id || null;
  //       }
  //     }

  //     if (getValues("extraDocumenten").length > 0) {
  //       if (keuringID) {
  //         getValues("extraDocumenten").forEach(async (extraDocument) => {
  //           const { data: extraDocumentData, error: extraDocumentError } =
  //             await supabase
  //               .from("ExtraDocument")
  //               .insert({
  //                 format: extraDocument.format,
  //                 name: extraDocument.name,
  //                 size: extraDocument.size,
  //                 cldnry_id: extraDocument.id,
  //                 keuringID: keuringID,
  //               })
  //               .select();

  //           if (extraDocumentError) {
  //             console.error(
  //               "Error toevoegen van extra document: ",
  //               extraDocumentError
  //             );
  //           }
  //         });
  //       }
  //     }

  //     onUploadKeuringConfirmationClose();
  //     onFormClose();
  //   };

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
      <Modal onClose={onFormClose} isOpen={isFormOpen}>
        <ModalOverlay />
        <ModalContent maxW={1600} margin="auto">
          <ModalHeader className={styles.modalHeader}>
            Keuring aanpassen
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Grid
                templateRows="repeat(7, 1fr)"
                templateColumns="repeat(12, 1fr)"
                gap={3}
              >
                <GridItem
                  rowSpan={5}
                  colSpan={4}
                  bg="white"
                  boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
                >
                  <Card padding="5px 10px 0 10px" height="100%">
                    <CardBody>
                      <Stack divider={<StackDivider />} spacing={3}>
                        <Box>
                          <Heading size="md" mb={5}>
                            Klant
                          </Heading>
                          <List>
                            <ListItem className={styles.klant}>
                              <MdPerson
                                size={30}
                                style={{ margin: "5px 30px 5px 10px" }}
                              />
                              <InputGroup gap="15px" flexDirection="column">
                                <Input
                                  {...register("voornaam", {
                                    required: true,
                                  })}
                                  placeholder="Voornaam"
                                  fontSize="16px"
                                />

                                <Input
                                  {...register("familienaam", {
                                    required: true,
                                  })}
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
                                  {...register("email", {
                                    pattern: { value: /\S+@\S+\.\S+/ },
                                  })}
                                  placeholder="E-mail"
                                  fontSize="16px"
                                />
                              </Box>
                            </ListItem>
                            <ListItem className={styles.klant}>
                              <MdPhone
                                size={30}
                                style={{ margin: "5px 30px 5px 10px" }}
                              />

                              <Box width="100%">
                                <InputGroup>
                                  {/* eslint-disable-next-line react/no-children-prop */}
                                  <InputLeftAddon children="+32" />
                                  <Input
                                    {...register("telefoonnummer", {
                                      pattern:
                                        /^(?:(?:\+?\d{1,3})?[-. ]?)?\(?\d{1,}\)?[-. ]?\d+[-. ]?\d+$/,
                                    })}
                                    placeholder="Telefoonnummer"
                                    type="tel"
                                    fontSize="16px"
                                  />
                                </InputGroup>
                              </Box>
                            </ListItem>
                          </List>
                        </Box>

                        <Box>
                          <Heading size="md" mb={3} mt={2}>
                            Adres
                          </Heading>
                          <List>
                            <ListItem className={styles.klant}>
                              <MdHome
                                size={30}
                                style={{ margin: "5px 30px 5px 10px" }}
                              />
                              <InputGroup gap={2}>
                                <Input
                                  width="75%"
                                  {...register("straatnaam", {
                                    required: true,
                                  })}
                                  placeholder="Straat"
                                  fontSize="16px"
                                />

                                <Input
                                  {...register("nummer", { required: true })}
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
                                  {...register("postcode", {
                                    required: true,
                                    pattern: /^[1-9]\d{3}$/,
                                  })}
                                  width="30%"
                                  placeholder="Postcode"
                                  fontSize="16px"
                                />
                                <Input
                                  {...register("gemeente", { required: true })}
                                  width="70%"
                                  placeholder="Gemeente"
                                  fontSize="16px"
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
                              <Radio value={Facturatie.HETZELFDE}>
                                {Facturatie.HETZELFDE}
                              </Radio>
                              <Radio value={Facturatie.IMMO} ml={5}>
                                {Facturatie.IMMO}
                              </Radio>
                              <Radio value={Facturatie.ANDERS} ml={5}>
                                {Facturatie.ANDERS}
                              </Radio>
                            </Stack>
                          </RadioGroup>
                        )}
                      />

                      <List>
                        <ListItem className={styles.klant}>
                          <MdPerson
                            size={30}
                            style={{ margin: "5px 30px 5px 10px" }}
                          />
                          <InputGroup gap="15px" flexDirection="column">
                            <Text>{watch("facturatie_naar")}</Text>
                            <Input
                              {...register("facturatie_voornaam")}
                              placeholder="Voornaam"
                              fontSize="16px"
                              disabled={facturatieNaar !== Facturatie.ANDERS}
                            />
                            <Input
                              {...register("facturatie_familienaam")}
                              placeholder="Familienaam"
                              fontSize="16px"
                              disabled={facturatieNaar !== Facturatie.ANDERS}
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
                              {...register("facturatie_email")}
                              placeholder="E-mail"
                              fontSize="16px"
                              disabled={facturatieNaar !== Facturatie.ANDERS}
                            />
                          </Box>
                        </ListItem>
                        <ListItem className={styles.klant}>
                          <MdPhone
                            size={30}
                            style={{ margin: "5px 30px 5px 10px" }}
                          />

                          <Box width="100%">
                            <InputGroup>
                              {/* eslint-disable-next-line react/no-children-prop */}
                              <InputLeftAddon children="+32" />
                              <Input
                                {...register("facturatie_telefoonnummer")}
                                placeholder="Telefoonnummer"
                                fontSize="16px"
                                disabled={facturatieNaar !== Facturatie.ANDERS}
                              />
                            </InputGroup>
                          </Box>
                        </ListItem>
                        <ListItem className={styles.klant}>
                          <MdHome
                            size={30}
                            style={{ margin: "5px 30px 5px 10px" }}
                          />
                          <InputGroup gap={2}>
                            <Input
                              width="75%"
                              {...register("facturatie_straatnaam")}
                              placeholder="Straat"
                              fontSize="16px"
                              disabled={facturatieNaar !== Facturatie.ANDERS}
                            />

                            <Input
                              {...register("facturatie_nummer")}
                              width="25%"
                              placeholder="Nr"
                              fontSize="16px"
                              disabled={facturatieNaar !== Facturatie.ANDERS}
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
                              {...register("facturatie_postcode")}
                              width="30%"
                              placeholder="Postcode"
                              fontSize="16px"
                              disabled={facturatieNaar !== Facturatie.ANDERS}
                            />

                            <Input
                              {...register("facturatie_gemeente")}
                              width="70%"
                              placeholder="Gemeente"
                              fontSize="16px"
                              disabled={facturatieNaar !== Facturatie.ANDERS}
                            />
                          </InputGroup>
                        </ListItem>
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
                  <Card padding="5px 10px 0 10px" height="100%">
                    <CardHeader padding="20px">
                      <Heading size="md">Extra documenten</Heading>
                    </CardHeader>
                    <CardBody>
                      <ExtraDocumentenDropzone
                        acceptFileType="images"
                        multipleFiles
                        text="Sleep hier afbeeldingen/PDF-bestanden naartoe, of klik om ze te selecteren."
                        setValue={setValue}
                        getValues={getValues}
                      />
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem
                  rowSpan={2}
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
                          <Heading size="md">Toegang eenheid</Heading>
                        </CardHeader>
                        <CardBody padding={0} className={styles.cardBody}>
                          <Controller
                            name="toegang_eenheid"
                            control={control}
                            render={({ field }) => (
                              <RadioGroup
                                {...field}
                                // onChange={(value) =>
                                //   setValue("toegang_eenheid", value)
                                // }
                                // defaultValue={getValues("toegang_eenheid")}
                                ml={5}
                              >
                                <Stack ml={15} gap={0}>
                                  <Radio
                                    value={ToegangEenheid.KLANT}
                                    colorScheme="green"
                                  >
                                    {ToegangEenheid.KLANT}
                                  </Radio>
                                  <Radio
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
                          <Heading size="md">Type</Heading>
                        </CardHeader>
                        <CardBody padding={0} className={styles.cardBody}>
                          <CheckboxTypeKeuring
                            control={control}
                            typeKeuring={getValues("type")}
                          />
                        </CardBody>
                      </Box>
                    </Stack>
                  </Card>
                </GridItem>
                <GridItem
                  rowSpan={2}
                  colSpan={4}
                  bg="white"
                  boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
                >
                  <Card padding="5px 10px 0 10px" height="100%">
                    <CardHeader padding="20px">
                      <Heading size="md">Extra opmerkingen</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                      <Textarea
                        width="100%"
                        fontSize="16px"
                        padding="10px"
                        resize="none"
                        borderRadius="5px"
                        borderColor="blackAlpha.500"
                        {...register("opmerking")}
                      />
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
                        Keuring opslaan
                      </AlertDialogHeader>
                      <AlertDialogBody>
                        Ben je zeker dat u deze keuring wil aanpassen?
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
                <Button onClick={onFormClose}>Close</Button>
              </ButtonGroup>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditForm;
