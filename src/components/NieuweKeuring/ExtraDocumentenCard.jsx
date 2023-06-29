import styles from "@/app/(dashboard)/keuringen/[id]/keuring.module.css";
import Dropzone from "@/components/Dropzone";
import { Card, CardHeader, GridItem, Heading, Tooltip } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";

const ExtraDocumentenCard = ({ keuring, setKeuring }) => {
  const removeFiles = (from) => {
    if (from == "extradocs") {
      setKeuring((previousKeuring) => ({
        ...previousKeuring,
        extraDocumenten: [],
      }));
    } else {
      setKeuring((previousKeuring) => ({
        ...previousKeuring,
        certificaat: {},
      }));
    }
  };

  return (
    <GridItem
      rowSpan={12}
      colSpan={4}
      bg="white"
      boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
    >
      <Card height="100%">
        <div className={styles.editIconsContainer}>
          <Tooltip label="Verwijder alle documenten" placement="bottom-end">
            <div
              className={styles.editIconContainer}
              onClick={() => removeFiles("extradocs")}
            >
              <MdDelete className={styles.editIcon} size={24} />
            </div>
          </Tooltip>
        </div>
        <CardHeader padding="36px 44px">
          <Heading size="md">Extra documenten</Heading>
        </CardHeader>
        <Dropzone
          keuring={keuring}
          setKeuring={setKeuring}
          forFiles="extradocs"
          acceptFileType="images"
          multipleFiles
          text="Sleep hier afbeeldingen/PDF-bestanden naartoe, of klik om ze te selecteren."
        />
      </Card>
    </GridItem>
  );
};

export default ExtraDocumentenCard;
