import Facturatie from "@/models/Facturatie";
import { List, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AdresInputVelden from "./AdresInputVelden";
import KlantInputVelden from "./KlantInputVelden";

const RadioGroupFacturatie = ({ keuring, setKeuring }) => {
  const [isShowAndersField, setisShowAndersField] = useState(false);
  const [facturatieData, setFacturatieData] = useState({
    naar: Facturatie.HETZELFDE,
  });

  const handleRadioChange = (value) => {
    let newData = {
      naar: value,
      voornaam: "",
      familienaam: "",
      emailadres: "",
      telefoonnummer: "",
      straatnaam: "",
      nummer: "",
      postcode: "",
      gemeente: "",
    };

    if (value === Facturatie.ANDERS) {
      newData = {
        ...newData,
        voornaam: keuring.adresID.klantID.voornaam,
        familienaam: keuring.adresID.klantID.familienaam,
        emailadres: keuring.adresID.klantID.emailadres,
        telefoonnummer: keuring.adresID.klantID.telefoonnummer,
        straatnaam: keuring.adresID.straatnaam,
        nummer: keuring.adresID.nummer,
        postcode: keuring.adresID.postcode,
        gemeente: keuring.adresID.gemeente,
      };
    }

    setisShowAndersField(value === Facturatie.ANDERS);
    setFacturatieData(newData);
  };

  const handleFacturatieDataChange = (key, value) => {
    setFacturatieData((prevFacturatieData) => ({
      ...prevFacturatieData,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (keuring?.facturatieID?.naar == "Anders") {
      setisShowAndersField(true);
      setFacturatieData((prevFacturatieData) => ({
        ...prevFacturatieData,
        naar: Facturatie.ANDERS,
      }));
    }
  }, [keuring?.facturatieID?.naar]);

  useEffect(() => {
    setKeuring((prevKeuring) => ({
      ...prevKeuring,
      facturatieID: facturatieData,
    }));
  }, [facturatieData, setKeuring]);

  return (
    <>
      {keuring && (
        <>
          <RadioGroup colorScheme="green" defaultValue={facturatieData.naar}>
            <Stack direction="row" mt={10} ml={5}>
              <Radio
                value={Facturatie.HETZELFDE.valueOf()}
                onChange={() => handleRadioChange(Facturatie.HETZELFDE)}
              >
                {Facturatie.HETZELFDE}
              </Radio>
              <Radio
                value={Facturatie.IMMO.valueOf()}
                onChange={() => handleRadioChange(Facturatie.IMMO)}
                ml={5}
              >
                {Facturatie.IMMO}
              </Radio>
              <Radio
                value={Facturatie.ANDERS.valueOf()}
                onChange={() => handleRadioChange(Facturatie.ANDERS)}
                ml={5}
              >
                {Facturatie.ANDERS}
              </Radio>
            </Stack>
          </RadioGroup>

          <List mt={10}>
            <KlantInputVelden
              facturatieData={facturatieData}
              isShowAndersField={isShowAndersField}
              onChange={handleFacturatieDataChange}
              keuring={keuring}
              setKeuring={setKeuring}
            />
            <AdresInputVelden
              facturatieData={facturatieData}
              isShowAndersField={isShowAndersField}
              onChange={handleFacturatieDataChange}
              keuring={keuring}
              setKeuring={setKeuring}
            />
          </List>
        </>
      )}
    </>
  );
};

export default RadioGroupFacturatie;
