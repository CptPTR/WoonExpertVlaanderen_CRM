"use client";

import { useEffect, useState } from "react";
import { Roboto } from "next/font/google";
import { Card, Grid } from "@nextui-org/react";
import {
  MdPerson,
  MdAlternateEmail,
  MdPhone,
  MdLocationCity,
  MdHome,
  MdEdit,
} from "react-icons/md";
import { GiHouseKeys } from "react-icons/gi";
import { FaHandshake } from "react-icons/fa";

import Status from "@/models/Status";
import TypeKeuring from "@/models/TypeKeuring";
import ToegangEenheid from "@/models/ToegangEenheid";
import Dropzone from "@/components/Dropzone";

import styles from "@/app/(dashboard)/keuringen/[id]/keuring.module.css";

const roboto900 = Roboto({ subsets: ["latin"], weight: "900" });

const Keuring = ({ params }) => {
  const [keuring, setKeuring] = useState(null);

  useEffect(() => {
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
        toegangEenheid: ToegangEenheid.KLANT,
        type: TypeKeuring.EPC,
        status: Status.CERTIFICAAT,
        energiedeskundige: "Danny",
        certificaat: false,
      },
    ];
    const foundKeuring = keuringen.find((keuring) => keuring.id == params.id);

    setKeuring(foundKeuring);
  }, [params.id]);

  const getBackgroundStatusColor = (status) => {
    switch (status) {
      case Status.GEANNULEERD.valueOf():
        return "rgba(244, 67, 54, 0.7)";
      case Status.IN_BEHANDELING.valueOf():
        return "rgba(255, 152, 0, 0.7)";
      case Status.CERTIFICAAT.valueOf():
        return "rgba(76, 175, 80, 0.7)";
    }
    return "rgba(33, 150, 243, 0.7)";
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours();
    const amOrPm = hours >= 12 ? "PM" : "AM";

    return `${day}/${month}/${year} ${amOrPm}`;
  };

  return (
    <main>
      <div>
        {keuring && (
          <header>
            <h1 className={`${roboto900.className} ${styles.title}`}>
              KEURING
            </h1>
            <div
              className={styles.keuringStatus}
              style={{
                backgroundColor: getBackgroundStatusColor(keuring.status),
              }}
            >
              {keuring.status +
                (keuring.status == Status.INGEPLAND
                  ? " -> " + formatDate(keuring.datumPlaatsbezoek)
                  : "")}
            </div>
          </header>
        )}

        <Grid.Container gap={2} justify="center">
          <Grid xs={5}>
            <Card css={{ padding: "15px 30px" }}>
              <Card.Body>
                <div className={styles.cardSubHeader}>
                  <h2>Klant</h2>
                  <div className={styles.editIconContainer}>
                    <MdEdit className={styles.editIcon} size={24} />
                  </div>
                </div>
                <ul>
                  {keuring && (
                    <>
                      <li className={styles.klant}>
                        <MdPerson size={24} style={{ margin: "0 20px" }} />
                        {`${keuring.klant.voornaam} ${keuring.klant.achternaam}`}
                      </li>
                      <li className={styles.klant}>
                        <MdAlternateEmail
                          size={24}
                          style={{ margin: "0 20px" }}
                        />
                        {keuring.klant.email}
                      </li>
                      <li className={styles.klant}>
                        <MdPhone size={24} style={{ margin: "0 20px" }} />
                        {keuring.klant.telefoonnummer}
                      </li>
                    </>
                  )}
                </ul>
                <div className={styles.cardSubHeader}>
                  <h2>Adres</h2>
                  <div className={styles.editIconContainer}>
                    <MdEdit className={styles.editIcon} size={24} />
                  </div>
                </div>
                <ul>
                  {keuring && (
                    <>
                      <li className={styles.adres}>
                        <MdHome size={24} style={{ margin: "0 20px" }} />
                        {`${keuring.adres.straat} ${keuring.adres.nummer}`}
                      </li>
                      <li className={styles.adres}>
                        <MdLocationCity
                          size={24}
                          style={{ margin: "0 20px" }}
                        />
                        {`${keuring.adres.postcode} ${keuring.adres.gemeente}`}
                      </li>
                    </>
                  )}
                </ul>
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={7}>
            <Card css={{ padding: "15px 30px" }}>
              <Card.Body>
                <h2>Extra documenten</h2>
                {/* <ul>{keuring && <li>{keuring.id}</li>}</ul> */}
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={5}>
            <Card css={{ padding: "15px 30px" }}>
              <Card.Body>
                <h2>Facturatie</h2>
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={3}>
            <Card css={{ padding: "15px 30px 0 30px" }}>
              <Card.Body>
                <h2>Toegang eenheid</h2>
                <div className={styles.iconContainer}>
                  {keuring &&
                    (keuring.toegangEenheid == ToegangEenheid.KLANT ? (
                      <FaHandshake size={64} />
                    ) : (
                      <GiHouseKeys size={64} />
                    ))}
                  <p>{keuring && keuring.toegangEenheid}</p>
                </div>
              </Card.Body>
            </Card>
          </Grid>

          <Grid xs={4}>
            <Card css={{ padding: "15px 30px" }}>
              <Card.Body>
                <h2>Energiecertificaat</h2>
                <Dropzone />
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={12}>
            <Card css={{ padding: "15px 30px", backgroundColor: "red" }}>
              <Card.Body>
                <h2>TEST</h2>
              </Card.Body>
            </Card>
          </Grid>
        </Grid.Container>
      </div>
    </main>
  );
};

export default Keuring;
