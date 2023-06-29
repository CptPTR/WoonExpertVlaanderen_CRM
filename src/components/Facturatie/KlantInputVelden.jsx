import { Input, ListItem } from "@chakra-ui/react";
import { MdAlternateEmail, MdPerson, MdPhone } from "react-icons/md";

import styles from "@/app/(dashboard)/keuringen/[id]/keuring.module.css";
import Facturatie from "@/models/Facturatie";

const KlantInputVelden = ({
  facturatieData,
  isShowAndersField,
  onChange,
  keuring,
  setKeuring,
}) => {
  return (
    <>
      {keuring && (
        <>
          <ListItem className={styles.klant || ""}>
            <MdPerson
              color={
                isShowAndersField ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0.2)"
              }
              size={24}
              style={{ margin: "0 20px" }}
            />

            <Input
              value={
                keuring.facturatieID?.naar == Facturatie.ANDERS
                  ? keuring.facturatieID.voornaam
                  : facturatieData.voornaam || ""
              }
              disabled={!isShowAndersField}
              placeholder="Voornaam"
              width="150px"
              height="27px"
              fontSize="16px"
              onChange={(e) => onChange("voornaam", e.target.value)}
            />
            <Input
              value={
                keuring.facturatieID?.naar == Facturatie.ANDERS
                  ? keuring?.facturatieID.familienaam
                  : facturatieData.familienaam || ""
              }
              disabled={!isShowAndersField}
              placeholder="Familienaam"
              width="175px"
              height="27px"
              fontSize="16px"
              onChange={(e) => onChange("familienaam", e.target.value)}
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
              value={
                keuring.facturatieID?.naar == Facturatie.ANDERS
                  ? keuring?.facturatieID.emailadres
                  : facturatieData.email || ""
              }
              disabled={!isShowAndersField}
              placeholder="E-mail"
              type="email"
              width="325px"
              height="27px"
              fontSize="16px"
              onChange={(e) => onChange("emailadres", e.target.value)}
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
              value={
                keuring.facturatieID?.naar == Facturatie.ANDERS
                  ? keuring?.facturatieID.telefoonnummer
                  : facturatieData.telefoonnummer || ""
              }
              disabled={!isShowAndersField}
              placeholder="Telefoonnummer"
              type="tel"
              width="325px"
              height="27px"
              fontSize="16px"
              onChange={(e) => onChange("telefoonnummer", e.target.value)}
            />
          </ListItem>
        </>
      )}
    </>
  );
};

export default KlantInputVelden;
