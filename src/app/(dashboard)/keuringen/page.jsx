"use client";

import styles from "@/app/(dashboard)/keuringen/keuringen.module.css";
import KeuringNietGevonden from "@/assets/images/keuring_niet_gevonden.png";
import { getBackgroundStatusColor } from "@/helpers/helpers";
import Status from "@/models/Status";
import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Roboto } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import {
  MdAdd,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";

const roboto900 = Roboto({ subsets: ["latin"], weight: "900" });

const Keuringen = () => {
  const [keuringen, setKeuringen] = useState([]);
  const [zoekKeuring, setZoekKeuring] = useState("");
  const [filteredKeuringen, setFilteredKeuringen] = useState(keuringen);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(filteredKeuringen.length);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const sortedKeuringen = filteredKeuringen.sort((a, b) => {
    if (a.status === Status.NIEUW && b.status !== Status.NIEUW) {
      return -1;
    }
    if (b.status === Status.NIEUW && a.status !== Status.NIEUW) {
      return 1;
    }

    if (a.status === Status.CERTIFICAAT && b.status !== Status.CERTIFICAAT) {
      return 1;
    }
    if (b.status === Status.CERTIFICAAT && a.status !== Status.CERTIFICAAT) {
      return -1;
    }

    const dateTwA = new Date(a.datumToewijzing);
    const dateTwB = new Date(b.datumToewijzing);

    if (dateTwA > dateTwB) return -1;
    if (dateTwA < dateTwB) return 1;
    return 0;
  });
  const currentItems = sortedKeuringen.slice(startIndex, endIndex);

  const router = useRouter();
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);

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

  const handleZoekKeuringChange = (event) => {
    const { value } = event.target;
    setZoekKeuring(value);

    const filteredData = keuringen.filter((keuring) => {
      return (
        `${keuring.adresID.klantID.voornaam} ${keuring.adresID.klantID.familienaam}`.includes(
          value
        ) || keuring.adresID.straatnaam.includes(value)
      );
    });

    setFilteredKeuringen(filteredData);
    setTotalItems(filteredData.length);
    setCurrentPage(1);
  };

  useEffect(() => {
    setFilteredKeuringen(keuringen);
    setTotalItems(keuringen.length);
  }, [keuringen]);

  useEffect(() => {
    const getKeuringenData = async () => {
      const { data: keuringenData, error: keuringenError } = await supabase
        .from("Keuring")
        .select(
          `id, datumToewijzing, datumPlaatsbezoek, status, type, adresID(straatnaam, nummer, postcode, gemeente, klantID(voornaam, familienaam, emailadres, telefoonnummer)), created_by(ondernemingID(naam))`
        );
      if (keuringenData) {
        setKeuringen(keuringenData);
      }
    };

    getKeuringenData();
  }, [supabase]);

  const handleRefreshKeuringTabel = () => {};

  return (
    <Box display="flex" flexDirection="column">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        my={5}
      >
        <Heading size="md" className={`${roboto900.className} ${styles.title}`}>
          KEURINGEN
        </Heading>
        <Box display="flex" alignSelf="flex-end">
          <Tooltip
            label="Keuring toevoegen"
            fontSize="md"
            placement="top-start"
          >
            <IconButton
              mb="10px"
              mr="10px"
              icon={<MdAdd />}
              colorScheme="green"
              onClick={() => {
                router.push(`/keuringen/add`);
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
      </Box>
      <Box>
        <div className={styles.keuringenContainer}>
          {filteredKeuringen.length > 0 ? (
            <Box>
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
                <Table variant="simple">
                  <Thead px={0}>
                    <Tr className={styles.tableColumn}>
                      <Th>
                        DATUM <br />
                        TOEWIJZING
                      </Th>
                      <Th>AANGEMAAKT DOOR</Th>
                      <Th>KLANT</Th>
                      <Th>ADRES</Th>
                      <Th>TYPE</Th>
                      <Th>STATUS</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sortedKeuringen.map((keuring, index) => {
                      return (
                        <Tr key={keuring.id}>
                          <Td>
                            <Text fontSize="small">
                              {formatDate(keuring.datumToewijzing)}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="small">
                              {keuring.created_by.ondernemingID.naam}
                            </Text>
                          </Td>
                          <Td>
                            <div className={styles.klant}>
                              <Text fontSize="small" className={styles.naam}>
                                {keuring.adresID.klantID.voornaam +
                                  " " +
                                  keuring.adresID.klantID.familienaam}
                              </Text>
                              <Text fontSize="x-small" className={styles.email}>
                                {keuring.adresID.klantID.emailadres}
                              </Text>
                            </div>
                          </Td>
                          <Td>
                            <div className={styles.adres}>
                              <Text fontSize="small" className={styles.straat}>
                                {keuring.adresID.straatnaam +
                                  " " +
                                  keuring.adresID.nummer}
                              </Text>
                              <Text
                                fontSize="x-small"
                                className={styles.gemeente}
                              >
                                {keuring.adresID.gemeente}
                              </Text>
                            </div>
                          </Td>
                          <Td>
                            <Text fontSize="small">{keuring.type}</Text>
                          </Td>
                          <Td>
                            <div
                              className={styles.statusBgColor}
                              style={{
                                backgroundColor: getBackgroundStatusColor(
                                  keuring,
                                  index
                                ),
                              }}
                            >
                              <Text fontSize="small">
                                {keuring.status +
                                  (keuring.status == Status.INGEPLAND
                                    ? " -> " +
                                      formatDate(keuring.datumPlaatsbezoek)
                                    : "")}
                              </Text>
                            </div>
                          </Td>
                          <Td px={0}>
                            <IconButton
                              icon={
                                <MdKeyboardArrowRight
                                  size={32}
                                  cursor="pointer"
                                />
                              }
                              aria-label="Zie keuring details"
                              onClick={() =>
                                router.push(`/keuringen/${keuring.id}`)
                              }
                            />
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                <ButtonGroup mt={5}>
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
                        background: currentPage === index + 1 ? "green" : "",
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
            </Box>
          ) : (
            <Box className={styles.geenKeuringen}>
              <Image
                width={400}
                src={KeuringNietGevonden}
                alt="Keuring niet gevonden"
              />
              <Heading size="md">Geen keuringen gevonden</Heading>
            </Box>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default Keuringen;
