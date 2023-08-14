import TypeKeuring from "@/models/TypeKeuring";
import { Box, Input, Text } from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const CertificaatUploader = ({ type, setValue, id }) => {
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  const AddEPCCertificaat = async (name, size) => {
    const { data: certificaatData, error: certificaatError } = await supabase
      .from("Certificaat")
      .upsert({
        name: name,
        type: TypeKeuring.EPC,
        keuringID: id,
        size: size,
      })
      .select();

    if (certificaatError) {
      console.error("Error toevoegen van EPC certificaat: ", certificaatError);
    } else {
      setValue("certificaat_epc", certificaatData[0].id);
    }
  };

  const AddAsbestCertificaat = async (name, size) => {
    const { data: certificaatData, error: certificaatError } = await supabase
      .from("Certificaat")
      .upsert({
        name: name,
        type: TypeKeuring.ASBEST,
        keuringID: id,
        size: size,
      })
      .select();

    if (certificaatError) {
      console.error(
        "Error toevoegen van Asbest certificaat: ",
        certificaatError
      );
    } else {
      setValue("certificaat_asbest", certificaatData[0].id);
    }
  };

  const handleFileChange = async (event) => {
    if (type == TypeKeuring.EPC) {
      const { data: uploadedEpcData, error: uploadedEpcError } =
        await supabase.storage
          .from("certificaten")
          .upload(`epc/${event.target.files[0].name}`, event.target.files[0], {
            upsert: true,
          });
      AddEPCCertificaat(event.target.files[0].name, event.target.files[0].size);
      // setValue("certificaat_epc", uploadedEpcData.id);
      // console.log(uploadedEpcData);
    } else {
      const { data: uploadedAsbestData, error: uploadedAsbestError } =
        await supabase.storage
          .from("certificaten")
          .upload(
            `asbest/${event.target.files[0].name}`,
            event.target.files[0],
            {
              upsert: true,
            }
          );
      AddAsbestCertificaat(
        event.target.files[0].name,
        event.target.files[0].size
      );
      // console.log(uploadedAsbestData);
      // setValue("certificaat_asbest", uploadedAsbestData.id);
    }
  };

  return (
    <Box display="flex" flexDirection="column" mb={5}>
      <Text fontSize="sm" fontWeight="bold">
        {type}
      </Text>
      <Input
        id={type.toLowerCase()}
        name={type.toLowerCase()}
        size="sm"
        type="file"
        accept="application/pdf"
        multiple={false}
        onChange={handleFileChange}
      />
    </Box>
  );
};

export default CertificaatUploader;
