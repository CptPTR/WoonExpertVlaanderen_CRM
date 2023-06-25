"use client";

import { Roboto } from "next/font/google";

import styles from "@/app/(dashboard)/keuringen/keuringen.module.css";

import Status from "@/models/Status";
import TypeKeuring from "@/models/TypeKeuring";

import Image from "next/image";
import { useState } from "react";
import {
  MdAdd,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";

import KeuringNietGevonden from "@/assets/images/keuring_niet_gevonden.png";
import ToegangEenheid from "@/models/ToegangEenheid";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

const roboto900 = Roboto({ subsets: ["latin"], weight: "900" });

const Keuringen = () => {
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
      opmerking: "",
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
      opmerking: "",
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
      opmerking: "",
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
      opmerking: "",
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
      opmerking: "",
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
      opmerking: "",
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
      opmerking: "",
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
      opmerking: "",
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
      opmerking: "",
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
      opmerking: "",
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
      opmerking: "",
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
      opmerking: "",
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
      opmerking: "",
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
      opmerking: "",
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
      opmerking: "",
      toegangEenheid: ToegangEenheid.KLANT,
      type: TypeKeuring.EPC,
      status: Status.INGEPLAND,
      energiedeskundige: "Bob",
      certificaat: false,
    },
  ];
  const [zoekKeuring, setZoekKeuring] = useState("");
  const [filteredKeuringen, setFilteredKeuringen] = useState(keuringen);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(filteredKeuringen.length);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredKeuringen.slice(startIndex, endIndex);

  const router = useRouter();

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours();
    const amOrPm = hours >= 12 ? "PM" : "AM";

    return `${day}/${month}/${year} ${amOrPm}`;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getBackgroundStatusColor = (index) => {
    switch (filteredKeuringen[index].status) {
      case Status.GEANNULEERD:
        return "rgba(244, 67, 54, 0.7)";
      case Status.IN_BEHANDELING:
        return "rgba(255, 152, 0, 0.7)";
      case Status.CERTIFICAAT:
        return "rgba(76, 175, 80, 0.7)";
    }
    return "rgba(33, 150, 243, 0.7)";
  };

  const handleZoekKeuringChange = (event) => {
    const { value } = event.target;
    setZoekKeuring(value);

    const filteredData = value
      ? keuringen.filter((keuring) => {
          return (
            `${keuring.klant.voornaam} ${keuring.klant.achternaam}`.includes(
              value
            ) || keuring.adres.straat.includes(value)
          );
        })
      : keuringen;

    setFilteredKeuringen(filteredData);
  };

  return (
    <main>
      <div className={styles.keuringenContainer}>
        <header>
          <h1 className={`${roboto900.className} ${styles.title}`}>
            KEURINGEN
          </h1>
          <Box display="flex" alignSelf="flex-end">
            <Tooltip label="Keuring toevoegen" fontSize="md">
              <IconButton
                mb="10px"
                mr="10px"
                icon={<MdAdd />}
                colorScheme="green"
                onClick={() => {
                  router.push("/keuringen/nieuw");
                }}
              />
            </Tooltip>
            <InputGroup className={styles.search} width={500}>
              <InputLeftElement pointerEvents="none">
                <FaSearch />
              </InputLeftElement>
              <Input
                placeholder="Zoek..."
                value={zoekKeuring}
                onChange={handleZoekKeuringChange}
              />
            </InputGroup>
          </Box>
        </header>

        {filteredKeuringen.length > 0 ? (
          <div>
            <TableContainer
              css={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "white",
                padding: "0 20px 20px 20px",
                boxShadow: "0 12px 20px 6px rgb(104 112 118 / 0.08)",
              }}
            >
              <Table variant="simple" css={{ width: "100%" }}>
                <Thead>
                  <Tr className={styles.tableColumn}>
                    <Th
                      css={{
                        padding: "20px 0",
                      }}
                    >
                      DATUM <br />
                      TOEWIJZING
                    </Th>
                    <Th>IMMO</Th>
                    <Th>KLANT</Th>
                    <Th>ADRES</Th>
                    <Th>TYPE</Th>
                    <Th>STATUS</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {currentItems.map((keuring, index) => {
                    return (
                      <Tr key={keuring.id}>
                        <Td css={{ padding: "25px 0" }}>
                          {formatDate(keuring.datumToewijzing)}
                        </Td>
                        <Td>{keuring.immo.naam}</Td>
                        <Td>
                          <div className={styles.klant}>
                            <span className={styles.naam}>
                              {keuring.klant.voornaam +
                                " " +
                                keuring.klant.achternaam}
                            </span>
                            <span className={styles.email}>
                              {keuring.klant.email}
                            </span>
                          </div>
                        </Td>
                        <Td>
                          <div className={styles.adres}>
                            <span className={styles.straat}>
                              {keuring.adres.straat +
                                " " +
                                keuring.adres.nummer}
                            </span>
                            <span className={styles.gemeente}>
                              {keuring.adres.gemeente}
                            </span>
                          </div>
                        </Td>
                        <Td>{keuring.type}</Td>
                        <Td>
                          <div
                            className={styles.statusBgColor}
                            style={{
                              backgroundColor: getBackgroundStatusColor(index),
                            }}
                          >
                            {keuring.status +
                              (keuring.status == Status.INGEPLAND
                                ? " -> " + formatDate(keuring.datumPlaatsbezoek)
                                : "")}
                          </div>
                        </Td>
                        <Td>
                          <MdKeyboardArrowRight
                            cursor="pointer"
                            className={styles.icon}
                            onClick={() => {
                              router.push(`/keuringen/${keuring.id}`);
                            }}
                            size={32}
                          />
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
              <ButtonGroup css={{ marginTop: "20px" }}>
                <Button
                  className={styles.paginationButton}
                  onClick={() => handlePageChange(currentPage - 1)}
                  isDisabled={currentPage === 1}
                >
                  <MdKeyboardArrowLeft />
                </Button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <Button
                    key={index}
                    className={styles.paginationButton}
                    onClick={() => handlePageChange(index + 1)}
                    style={{
                      color: currentPage === index + 1 ? "white" : "",
                      background:
                        currentPage === index + 1
                          ? "linear-gradient(to top, #11998e, #38ef7d)"
                          : "",
                    }}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  className={styles.paginationButton}
                  onClick={() => handlePageChange(currentPage + 1)}
                  isDisabled={currentPage === totalPages}
                >
                  <MdKeyboardArrowRight />
                </Button>
              </ButtonGroup>
            </TableContainer>
          </div>
        ) : (
          <div className={styles.geenKeuringen}>
            <Image
              width={500}
              src={KeuringNietGevonden}
              alt="Keuring niet gevonden"
            />
            <h2>Geen keuringen gevonden</h2>
            <p>
              We kunnen geen keuringen vinden die aan je zoekopdracht voldoen.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Keuringen;
