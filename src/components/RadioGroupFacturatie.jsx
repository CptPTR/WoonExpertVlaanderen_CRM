import Facturatie from "@/models/Facturatie";
import {
  Input,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  MdAlternateEmail,
  MdHome,
  MdLocationCity,
  MdPerson,
  MdPhone,
} from "react-icons/md";
import styles from "@/app/(dashboard)/keuringen/[id]/keuring.module.css";

const RadioGroupFacturatie = ({ keuring, setKeuring }) => {
  const [isShowAndersField, setisShowAndersField] = useState(false);

  const handleRadioChange = (value) => {
    const facturatie = keuring.facturatie;

    const updatedFacturatie = {
      ...facturatie,
      naar: value,
    };

    if (value == Facturatie.ANDERS) {
      setisShowAndersField(true);
    } else {
      setisShowAndersField(false);
      setKeuring({
        ...keuring,
        facturatie: {
          ...updatedFacturatie,
          klant: {},
          adres: {},
        },
      });
    }
  };

  return (
    <div>
      <RadioGroup colorScheme="green" defaultValue={Facturatie.HETZELFDE}>
        <Stack direction="row" mt={10} ml={5}>
          <Radio
            value={Facturatie.HETZELFDE}
            onChange={() => handleRadioChange(Facturatie.HETZELFDE)}
          >
            {Facturatie.HETZELFDE}
          </Radio>
          <Radio
            value={Facturatie.IMMO}
            onChange={() => handleRadioChange(Facturatie.IMMO)}
            ml={5}
          >
            {Facturatie.IMMO}
          </Radio>
          <Radio
            value={Facturatie.ANDERS}
            onChange={() => handleRadioChange(Facturatie.ANDERS)}
            ml={5}
          >
            {Facturatie.ANDERS}
          </Radio>
        </Stack>
      </RadioGroup>

      <List mt={10}>
        <ListItem className={styles.klant}>
          <MdPerson
            color={
              isShowAndersField ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0.2)"
            }
            size={24}
            style={{ margin: "0 20px" }}
          />

          <Input
            disabled={!isShowAndersField}
            placeholder="Voornaam"
            width="150px"
            height="27px"
            fontSize="16px"
            onBlur={(e) =>
              setKeuring({
                ...keuring,
                facturatie: {
                  ...keuring.facturatie,
                  klant: {
                    ...keuring.facturatie.klant,
                    voornaam: e.target.value,
                  },
                },
              })
            }
          />
          <Input
            disabled={!isShowAndersField}
            placeholder="Familienaam"
            width="175px"
            height="27px"
            fontSize="16px"
            onBlur={(e) =>
              setKeuring({
                ...keuring,
                facturatie: {
                  ...keuring.facturatie,
                  klant: {
                    ...keuring.facturatie.klant,
                    achternaam: e.target.value,
                  },
                },
              })
            }
          />
        </ListItem>
        <ListItem className={styles.klant}>
          <MdAlternateEmail
            color={
              isShowAndersField ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0.2)"
            }
            size={24}
            style={{ margin: "0 20px" }}
          />

          <Input
            disabled={!isShowAndersField}
            placeholder="E-mail"
            type="email"
            width="325px"
            height="27px"
            fontSize="16px"
            onBlur={(e) =>
              setKeuring({
                ...keuring,
                facturatie: {
                  ...keuring.facturatie,
                  klant: {
                    ...keuring.facturatie.klant,
                    email: e.target.value,
                  },
                },
              })
            }
          />
        </ListItem>
        <ListItem className={styles.klant}>
          <MdPhone
            color={
              isShowAndersField ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0.2)"
            }
            size={24}
            style={{ margin: "0 20px" }}
          />

          <Input
            disabled={!isShowAndersField}
            placeholder="Telefoonnummer"
            type="tel"
            width="325px"
            height="27px"
            fontSize="16px"
            onBlur={(e) =>
              setKeuring({
                ...keuring,
                facturatie: {
                  ...keuring.facturatie,
                  klant: {
                    ...keuring.facturatie.klant,
                    telefoonnummer: e.target.value,
                  },
                },
              })
            }
          />
        </ListItem>
        <ListItem className={styles.adres}>
          <MdHome
            color={
              isShowAndersField ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0.2)"
            }
            size={24}
            style={{ margin: "0 20px" }}
          />

          <Input
            disabled={!isShowAndersField}
            placeholder="Straatnaam"
            type="text"
            width="250px"
            height="27px"
            fontSize="16px"
            onBlur={(e) =>
              setKeuring({
                ...keuring,
                facturatie: {
                  ...keuring.facturatie,
                  adres: {
                    ...keuring.facturatie.adres,
                    straat: e.target.value,
                  },
                },
              })
            }
          />
          <Input
            disabled={!isShowAndersField}
            placeholder="Nr"
            type="number"
            width="75px"
            height="27px"
            fontSize="16px"
            onBlur={(e) =>
              setKeuring({
                ...keuring,
                facturatie: {
                  ...keuring.facturatie,
                  adres: {
                    ...keuring.facturatie.adres,
                    nummer: +e.target.value,
                  },
                },
              })
            }
          />
        </ListItem>
        <ListItem className={styles.adres}>
          <MdLocationCity
            color={
              isShowAndersField ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0.2)"
            }
            size={24}
            style={{ margin: "0 20px" }}
          />

          <Input
            disabled={!isShowAndersField}
            placeholder="Postcode"
            type="number"
            width="100px"
            height="27px"
            fontSize="16px"
            onBlur={(e) =>
              setKeuring({
                ...keuring,
                facturatie: {
                  ...keuring.facturatie,
                  adres: {
                    ...keuring.facturatie.adres,
                    postcode: +e.target.value,
                  },
                },
              })
            }
          />
          <Input
            disabled={!isShowAndersField}
            placeholder="Gemeente"
            width="225px"
            height="27px"
            fontSize="16px"
            onBlur={(e) =>
              setKeuring({
                ...keuring,
                facturatie: {
                  ...keuring.facturatie,
                  adres: {
                    ...keuring.facturatie.adres,
                    gemeente: e.target.value,
                  },
                },
              })
            }
          />
        </ListItem>
      </List>
    </div>
  );
};

export default RadioGroupFacturatie;
