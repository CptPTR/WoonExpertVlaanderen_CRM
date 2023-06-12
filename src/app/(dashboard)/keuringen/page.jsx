"use client";

import { Roboto } from "next/font/google";

import styles from "@/app/(dashboard)/keuringen/keuringen.module.css";
import { Table } from "@nextui-org/react";
import TypeKeuring from "@/models/TypeKeuring";
import Status from "@/models/Status";
import { MdKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";

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
      type: TypeKeuring.EPC,
      status: Status.CERTIFICAAT,
      energiedeskundige: "Danny",
      certificaat: false,
    },
  ];

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours();
    const amOrPm = hours >= 12 ? "PM" : "AM";

    return `${day}/${month}/${year} ${amOrPm}`;
  };

  const getBackgroundStatusColor = (index) => {
    switch (keuringen[index].status) {
      case Status.GEANNULEERD:
        return "rgba(244, 67, 54, 0.7)";
      case Status.IN_BEHANDELING:
        return "rgba(255, 152, 0, 0.7)";
      case Status.CERTIFICAAT:
        return "rgba(76, 175, 80, 0.7)";
    }
    return "rgba(33, 150, 243, 0.7)";
  };

  return (
    <main>
      <div>
        <header>
          <h1 className={`${roboto900.className} ${styles.title}`}>
            KEURINGEN
          </h1>
        </header>
        <Table aria-label="keuringentabel" bgcolor="white">
          <Table.Header>
            <Table.Column
              css={{
                fontSize: "16px",
                padding: "15px 0",
              }}
            >
              DATUM TOEWIJZING
            </Table.Column>
            <Table.Column css={{ fontSize: "16px" }}>KLANT</Table.Column>
            <Table.Column css={{ fontSize: "16px" }}>ADRES</Table.Column>
            <Table.Column css={{ fontSize: "16px" }}>TYPE KEURING</Table.Column>
            <Table.Column css={{ fontSize: "16px" }}>STATUS</Table.Column>
            <Table.Column></Table.Column>
          </Table.Header>
          <Table.Body>
            {keuringen.map((keuring, index) => (
              <Table.Row key={keuring.id}>
                <Table.Cell css={styles.tableCell}>
                  {formatDate(keuring.datumToewijzing)}
                </Table.Cell>
                <Table.Cell css={styles.tableCell}>
                  <div className={styles.klant}>
                    <span className={styles.naam}>
                      {keuring.klant.voornaam + " " + keuring.klant.achternaam}
                    </span>
                    <span className={styles.email}>{keuring.klant.email}</span>
                  </div>
                </Table.Cell>
                <Table.Cell css={styles.tableCell}>
                  <div className={styles.adres}>
                    <span className={styles.straat}>
                      {keuring.adres.straat + " " + keuring.adres.nummer}
                    </span>
                    <span className={styles.gemeente}>
                      {keuring.adres.gemeente}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell css={styles.tableCell}>{keuring.type}</Table.Cell>
                <Table.Cell
                  css={{
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    className={styles.statusBgColor}
                    style={{ backgroundColor: getBackgroundStatusColor(index) }}
                  >
                    {keuring.status +
                      (keuring.status == Status.INGEPLAND
                        ? " -> " + formatDate(keuring.datumPlaatsbezoek)
                        : "")}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Link href={`/keuringen/${keuring.id}`}>
                    <MdKeyboardArrowRight
                      className={styles.icon}
                      onClick={() => {
                        console.log(keuring.klant.voornaam);
                      }}
                      size={32}
                    />
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Pagination
            size={"md"}
            shadow
            loop
            siblings={2}
            rowsPerPage={10}
            align="center"
            color={"gradient"}
          />
        </Table>
      </div>
    </main>
  );
};

export default Keuringen;
