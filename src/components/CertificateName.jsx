import { Text } from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";

const CertificateName = ({ watchCert }) => {
  const [certName, setCertName] = useState();

  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  useEffect(() => {
    const getCertificaatName = async (id) => {
      const { data: certificaatData, error: certificaatError } = await supabase
        .from("Certificaat")
        .select("name")
        .eq("id", id);

      if (certificaatError) {
        console.error("Error ophalen naam certificaat: ", certificaatError);
      } else {
        return certificaatData[0].name;
      }
    };

    setCertName(getCertificaatName(watchCert));
  }, [supabase, watchCert]);

  return <Text fontSize="sm">{certName}</Text>;
};

export default CertificateName;
