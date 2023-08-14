import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import Facturatie from "@/models/Facturatie";
import Status from "@/models/Status";
import ToegangEenheid from "@/models/ToegangEenheid";
import styles from "@/styles/form.module.css";
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
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  StackDivider,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  MdAdd,
  MdAlternateEmail,
  MdHome,
  MdLocationCity,
  MdPerson,
  MdPhone,
} from "react-icons/md";
import CheckboxTypeKeuring from "../CheckboxTypeKeuring";
import ExtraDocumentenDropzone from "../ExtraDocumentenDropzone";
import FacturatieCard from "../FacturatieCard";

const Form = () => {
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();
  const {
    isOpen: isUploadKeuringConfirmationOpen,
    onOpen: onUploadKeuringConfirmationOpen,
    onClose: onUploadKeuringConfirmationClose,
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
    resetField,
    control,
    formState: { errors },
    watch,
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

  const onSubmit = (d) => {
    onUploadKeuringConfirmationOpen();
  };

  const handleUploadKeuring = async () => {
    let klantID = null;
    let adresID = null;
    let facturatieID = null;
    let keuringID = null;

    const { data: klantData, error: klantError } = await supabase
      .from("Klant")
      .insert([
        {
          voornaam: getValues("voornaam"),
          familienaam: getValues("familienaam"),
          emailadres: getValues("email"),
          telefoonnummer: getValues("telefoonnummer"),
        },
      ])
      .select();

    if (klantError) {
      console.error("Error toevoegen van klant: ", klantError);
    } else if (klantData.length > 0) {
      klantID = klantData[0].id || null;
    }

    const { data: facturatieData, error: facturatieError } = await supabase
      .from("Facturatie")
      .insert({
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
      .select();

    if (facturatieError) {
      console.error("Error toevoegen van facturatie: ", facturatieError);
    } else if (facturatieData.length > 0) {
      facturatieID = facturatieData[0].id || null;
    }

    if (klantID) {
      const { data: adresData, error: adresError } = await supabase
        .from("Adres")
        .insert([
          {
            straatnaam: getValues("straatnaam"),
            nummer: getValues("nummer"),
            postcode: getValues("postcode"),
            gemeente: getValues("gemeente"),
            klantID: klantID,
            isFacturatieAdres:
              getValues("facturatie_naar") == Facturatie.HETZELFDE
                ? true
                : false,
          },
        ])
        .select();

      if (adresError) {
        console.error("Error toevoegen van adres: ", adresError);
      } else if (adresData.length > 0) {
        adresID = adresData[0].id || null;
      }
    }

    if (adresID && facturatieID) {
      const { data: keuringData, error: keuringError } = await supabase
        .from("Keuring")
        .insert({
          datumPlaatsbezoek: getValues("datumPlaatsbezoek"),
          adresID: adresID,
          facturatieID: facturatieID,
          toegewezen_aan: getValues("zaakvoerder"),
          status: getValues("status"),
          type: getValues("type"),
          created_by: user.id,
          opmerking: getValues("opmerking"),
          toegang_eenheid: getValues("toegang_eenheid"),
        })
        .select();

      if (keuringError) {
        console.error("Error toevoegen van keuring: ", keuringError);
      } else if (keuringData.length > 0) {
        keuringID = keuringData[0].id || null;
      }
    }

    if (getValues("extraDocumenten").length > 0) {
      if (keuringID) {
        getValues("extraDocumenten").forEach(async (extraDocument) => {
          const { data: extraDocumentData, error: extraDocumentError } =
            await supabase
              .from("ExtraDocument")
              .insert({
                format: extraDocument.format,
                name: extraDocument.name,
                size: extraDocument.size,
                cldnry_id: extraDocument.cldnry_id,
                keuringID: keuringID,
              })
              .select();

          if (extraDocumentError) {
            console.error(
              "Error toevoegen van extra document: ",
              extraDocumentError
            );
          }
        });
      }
    }

    onUploadKeuringConfirmationClose();
    onFormClose();
  };

  return (
    <>
      <Tooltip label="Keuring toevoegen" fontSize="md" placement="top-start">
        <IconButton
          mb="10px"
          mr="10px"
          icon={<MdAdd />}
          colorScheme="green"
          onClick={() => {
            onFormOpen();
          }}
        />
      </Tooltip>
      <Modal onClose={onFormClose} isOpen={isFormOpen} size="6xl">
        <ModalOverlay />
        <ModalContent>
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
                              <InputGroup
                                gap="15px"
                                flexDirection="column"
                                size="sm"
                              >
                                <Input
                                  {...register("voornaam", {
                                    required: true,
                                  })}
                                  placeholder="Voornaam"
                                />

                                <Input
                                  {...register("familienaam", {
                                    required: true,
                                  })}
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
                                  <InputLeftAddon>+32</InputLeftAddon>
                                  <Input
                                    {...register("telefoonnummer", {
                                      required: true,
                                      pattern:
                                        /^(?:(?:(?:\+|00)32\s?|0)(?:4[789]\d|9\d)(?:\s?\d{2}){3}|(?:(?:\+|00)32\s?|0)(?:\d\s?\d{3}|\d{2}\s?\d{2})(?:\s?\d{2}){2})$/,
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
                <FacturatieCard
                  register={register}
                  formValues={getValues}
                  setValue={setValue}
                  resetField={resetField}
                />
                <GridItem
                  rowSpan={7}
                  colSpan={4}
                  bg="white"
                  boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
                >
                  <Card padding="5px 10px 0 10px" height="100%">
                    <CardHeader padding="20px">
                      <Heading size="sm">Extra documenten</Heading>
                    </CardHeader>
                    <CardBody>
                      <ExtraDocumentenDropzone
                        acceptFileType="images"
                        multipleFiles
                        text="Sleep hier afbeeldingen/PDF-bestanden naartoe, of klik om ze te selecteren."
                        setValue={setValue}
                        getValues={getValues}
                        extraDocumenten={getValues("extraDocumenten")}
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
                    <Stack height="100%" direction="row">
                      <Box paddingRight={10}>
                        <CardHeader padding="20px">
                          <Heading size="sm">Toegang eenheid</Heading>
                        </CardHeader>
                        <CardBody padding={0} className={styles.cardBody}>
                          <Controller
                            name="toegang_eenheid"
                            control={control}
                            render={({ field }) => (
                              <RadioGroup
                                onChange={(value) => field.onChange(value)}
                                value={field.value}
                                size="sm"
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
                      <Box>
                        <CardHeader padding="20px 0">
                          <Heading size="sm">Type</Heading>
                        </CardHeader>
                        <CardBody padding={0} className={styles.cardBody}>
                          <CheckboxTypeKeuring
                            control={control}
                            setValue={setValue}
                            getValues={getValues}
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
                      <Heading size="sm">Extra opmerkingen</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                      <Textarea
                        width="100%"
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
                <Button type="submit">Opslaan</Button>
                <AlertDialog
                  isOpen={isUploadKeuringConfirmationOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={onUploadKeuringConfirmationClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Keuring opslaan
                      </AlertDialogHeader>
                      <AlertDialogBody>
                        Ben je zeker dat u deze keuring wil opslaan?
                        <div>{JSON.stringify(getValues(), null, 2)}</div>
                      </AlertDialogBody>
                      <AlertDialogFooter>
                        <Button
                          ref={cancelRef}
                          onClick={onUploadKeuringConfirmationClose}
                        >
                          Sluit venster
                        </Button>
                        <Button ml={3} onClick={handleUploadKeuring}>
                          Upload Keuring
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

export default Form;
