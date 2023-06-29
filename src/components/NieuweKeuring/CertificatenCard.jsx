import {
  GridItem,
  Card,
  Tooltip,
  CardHeader,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import React from "react";
import Dropzone from "@/components/Dropzone";
import { MdDelete } from "react-icons/md";
import styles from "@/app/(dashboard)/keuringen/[id]/keuring.module.css";
import { block } from "million";

const CertificatenCard = ({ keuring, setKeuring }) => {
  return (
    <GridItem
      rowSpan={5}
      colSpan={4}
      bg="white"
      boxShadow={"0 12px 20px 6px rgb(104 112 118 / 0.08)"}
    >
      <Card padding="16px 24px" height="100%">
        <div className={styles.editIconsContainer}>
          <Tooltip label="Verwijder certificaten" placement="bottom-end">
            <div
              className={styles.editIconContainer}
              onClick={() => removeFiles("certificaat")}
            >
              <MdDelete size={24} />
            </div>
          </Tooltip>
        </div>
        <CardHeader padding="20px 20px 10px 20px">
          <Heading size="md">Certificaat</Heading>
        </CardHeader>
        <Tabs isFitted variant="soft-rounded" mt="20px" ml="20px" mr="20px">
          <TabList>
            <Tab>EPC</Tab>
            <Tab>Asbest</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Dropzone
                keuring={keuring}
                setKeuring={setKeuring}
                forFiles="epc-certificaat"
                acceptFileType="pdf"
                text="Sleep hier een EPC certificaat naartoe, of klik om het bestand te selecteren"
              />
            </TabPanel>
            <TabPanel>
              <Dropzone
                keuring={keuring}
                setKeuring={setKeuring}
                forFiles="asbest-certificaat"
                acceptFileType="pdf"
                text="Sleep hier een Asbest certificaat naartoe, of klik om het bestand te selecteren"
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card>
    </GridItem>
  );
};

export default CertificatenCard;
