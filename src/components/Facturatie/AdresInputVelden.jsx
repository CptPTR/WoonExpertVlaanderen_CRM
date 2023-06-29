import { Input, ListItem } from "@chakra-ui/react";
import { MdHome, MdLocationCity } from "react-icons/md";

import styles from "@/app/(dashboard)/keuringen/[id]/keuring.module.css";
import Facturatie from "@/models/Facturatie";

const AdresInputVelden = ({
  facturatieData,
  isShowAndersField,
  onChange,
  keuring,
  setKeuring,
}) => {
  return (
    <>
      <ListItem className={styles.adres}>
        <MdHome
          color={isShowAndersField ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0.2)"}
          size={24}
          style={{ margin: "0 20px" }}
        />

        <Input
          value={
            keuring.facturatieID?.naar == Facturatie.ANDERS
              ? keuring.facturatieID.straatnaam
              : facturatieData.straat || ""
          }
          disabled={!isShowAndersField}
          placeholder="Straatnaam"
          type="text"
          width="250px"
          height="27px"
          fontSize="16px"
          onChange={(e) => onChange("straatnaam", e.target.value)}
        />
        <Input
          value={
            keuring.facturatieID?.naar == Facturatie.ANDERS
              ? keuring.facturatieID.nummer
              : facturatieData.nummer || ""
          }
          disabled={!isShowAndersField}
          placeholder="Nr"
          type="number"
          width="75px"
          height="27px"
          fontSize="16px"
          onChange={(e) => onChange("nummer", +e.target.value)}
        />
      </ListItem>
      <ListItem className={styles.adres}>
        <MdLocationCity
          color={isShowAndersField ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0.2)"}
          size={24}
          style={{ margin: "0 20px" }}
        />

        <Input
          value={
            keuring.facturatieID?.naar == Facturatie.ANDERS
              ? keuring.facturatieID.postcode
              : facturatieData.postcode || ""
          }
          disabled={!isShowAndersField}
          placeholder="Postcode"
          type="number"
          width="100px"
          height="27px"
          fontSize="16px"
          onChange={(e) => onChange("postcode", +e.target.value)}
        />
        <Input
          value={
            keuring.facturatieID?.naar == Facturatie.ANDERS
              ? keuring.facturatieID.gemeente
              : facturatieData.gemeente || ""
          }
          disabled={!isShowAndersField}
          placeholder="Gemeente"
          width="225px"
          height="27px"
          fontSize="16px"
          onChange={(e) => onChange("gemeente", e.target.value)}
        />
      </ListItem>
    </>
  );
};

export default AdresInputVelden;
