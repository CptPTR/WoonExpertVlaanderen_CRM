import {
  Card,
  CardBody,
  CardHeader,
  GridItem,
  Heading,
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";
import {
  MdAlternateEmail,
  MdHome,
  MdLocationCity,
  MdPerson,
  MdPhone,
} from "react-icons/md";

import styles from "@/app/(dashboard)/keuringen/[id]/keuring.module.css";

const KlantAdresCard = ({ keuring, setKeuring }) => {
  return (
    <GridItem
      rowSpan={7}
      colSpan={4}
      bg="white"
      boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
      position={"relative"}
    >
      <Card padding="16px 24px" height="100%">
        <CardHeader padding="20px 20px 10px 20px">
          <Heading size="md">Klant</Heading>
        </CardHeader>
        <CardBody>
          <List>
            <ListItem className={styles.klant}>
              <MdPerson size={24} style={{ margin: "0 20px" }} />

              <Input
                placeholder="Voornaam"
                width="150px"
                height="27px"
                fontSize="16px"
                onBlur={(e) =>
                  setKeuring((prevKeuring) => ({
                    ...prevKeuring,
                    adresID: {
                      ...prevKeuring.adresID,
                      klantID: {
                        ...prevKeuring.adresID.klantID,
                        voornaam: e.target.value,
                      },
                    },
                  }))
                }
              />
              <Input
                placeholder="Familienaam"
                width="175px"
                height="27px"
                fontSize="16px"
                onBlur={(e) =>
                  setKeuring((prevKeuring) => ({
                    ...prevKeuring,
                    adresID: {
                      ...prevKeuring.adresID,
                      klantID: {
                        ...prevKeuring.adresID.klantID,
                        familienaam: e.target.value,
                      },
                    },
                  }))
                }
              />
            </ListItem>
            <ListItem className={styles.klant}>
              <MdAlternateEmail size={24} style={{ margin: "0 20px" }} />

              <Input
                placeholder="E-mail"
                type="email"
                width="325px"
                height="27px"
                fontSize="16px"
                onBlur={(e) =>
                  setKeuring((prevKeuring) => ({
                    ...prevKeuring,
                    adresID: {
                      ...prevKeuring.adresID,
                      klantID: {
                        ...prevKeuring.adresID.klantID,
                        emailadres: e.target.value,
                      },
                    },
                  }))
                }
              />
            </ListItem>
            <ListItem className={styles.klant}>
              <MdPhone size={24} style={{ margin: "0 20px" }} />

              <Input
                placeholder="Telefoonnummer"
                type="tel"
                width="325px"
                height="27px"
                fontSize="16px"
                onBlur={(e) =>
                  setKeuring((prevKeuring) => ({
                    ...prevKeuring,
                    adresID: {
                      ...prevKeuring.adresID,
                      klantID: {
                        ...prevKeuring.adresID.klantID,
                        telefoonnummer: e.target.value,
                      },
                    },
                  }))
                }
              />
            </ListItem>
          </List>
        </CardBody>
        <CardHeader padding="20px 20px 10px 20px">
          <Heading size="md">Adres</Heading>
        </CardHeader>
        <CardBody>
          <List>
            {keuring && (
              <>
                <ListItem className={styles.adres}>
                  <MdHome size={24} style={{ margin: "0 20px" }} />

                  <Input
                    placeholder="Straatnaam"
                    type="text"
                    width="250px"
                    height="27px"
                    fontSize="16px"
                    onBlur={(e) =>
                      setKeuring((prevKeuring) => ({
                        ...prevKeuring,
                        adresID: {
                          ...prevKeuring.adresID,
                          straatnaam: e.target.value,
                        },
                      }))
                    }
                  />
                  <Input
                    placeholder="Nr"
                    type="number"
                    width="75px"
                    height="27px"
                    fontSize="16px"
                    onBlur={(e) =>
                      setKeuring((prevKeuring) => ({
                        ...prevKeuring,
                        adresID: {
                          ...prevKeuring.adresID,
                          nummer: +e.target.value,
                        },
                      }))
                    }
                  />
                </ListItem>
                <ListItem className={styles.adres}>
                  <MdLocationCity size={24} style={{ margin: "0 20px" }} />

                  <Input
                    placeholder="Postcode"
                    type="number"
                    width="100px"
                    height="27px"
                    fontSize="16px"
                    onBlur={(e) =>
                      setKeuring((prevKeuring) => ({
                        ...prevKeuring,
                        adresID: {
                          ...prevKeuring.adresID,
                          postcode: +e.target.value,
                        },
                      }))
                    }
                  />
                  <Input
                    placeholder="Gemeente"
                    width="225px"
                    height="27px"
                    fontSize="16px"
                    onBlur={(e) =>
                      setKeuring((prevKeuring) => ({
                        ...prevKeuring,
                        adresID: {
                          ...prevKeuring.adresID,
                          gemeente: e.target.value,
                        },
                      }))
                    }
                  />
                </ListItem>
              </>
            )}
          </List>
        </CardBody>
      </Card>
    </GridItem>
  );
};

export default KlantAdresCard;
