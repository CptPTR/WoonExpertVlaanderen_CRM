// "use client";

// import styles from "@/app/(dashboard)/keuringen/[id]/keuring.module.css";
// import ExtraDocumentenCard from "@/components/NieuweKeuring/ExtraDocumentenCard";
// import ExtraOpmerkingenCard from "@/components/NieuweKeuring/ExtraOpmerkingenCard";
// import FacturatieCard from "@/components/NieuweKeuring/FacturatieCard2";
// import KlantAdresCard from "@/components/NieuweKeuring/KlantAdresCard";
// import ToegangEenheidTypeKeuringCard from "@/components/NieuweKeuring/ToegangEenheidTypeKeuringCard";
// import useGetCurrentUser from "@/hooks/useGetCurrentUser";
// import Facturatie from "@/models/Facturatie";
// import Status from "@/models/Status";
// import ToegangEenheid from "@/models/ToegangEenheid";
// import TypeKeuring from "@/models/TypeKeuring";
// import {
//   AlertDialog,
//   AlertDialogBody,
//   AlertDialogContent,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogOverlay,
//   Button,
//   Grid,
//   useDisclosure,
// } from "@chakra-ui/react";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// import { Roboto } from "next/font/google";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// const roboto900 = Roboto({ subsets: ["latin"], weight: "900" });

// const Nieuw = () => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const cancelRef = React.useRef();
//   const router = useRouter();
//   const supabase = createClientComponentClient({
//     supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
//     supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//   });
//   const user = useGetCurrentUser(supabase);
//   const [keuring, setKeuring] = useState({
//     adresID: {
//       straatnaam: "",
//       nummer: "",
//       postcode: "",
//       gemeente: "",
//       klantID: {
//         voornaam: "",
//         familienaam: "",
//         emailadres: "",
//         telefoonnummer: "",
//       },
//     },
//     datumPlaatsbezoek: null,
//     extraDocumenten: [],
//     toegang_eenheid: ToegangEenheid.KLANT,
//     type: TypeKeuring.EPC,
//     status: Status.NIEUW,
//     facturatie: {
//       naar: Facturatie.HETZELFDE,
//     },
//     zaakvoerder: "f3474995-7517-4640-beb9-30a522ee34c5",
//     certificaat: {
//       epc: null,
//       asbest: null,
//     },
//     opmerking: "",
//   });

//   useEffect(() => {
//     setKeuring((prevKeuring) => ({
//       ...prevKeuring,
//       immo: user.onderneming,
//     }));
//   }, [user.onderneming]);

//   const handleUploadKeuring = async () => {
//     let klantID = null;
//     let adresID = null;
//     let facturatieID = null;
//     let keuringID = null;

//     const { data: klantData, error: klantError } = await supabase
//       .from("Klant")
//       .insert([
//         {
//           voornaam: keuring.adresID.klantID.voornaam,
//           familienaam: keuring.adresID.klantID.familienaam,
//           emailadres: keuring.adresID.klantID.emailadres,
//           telefoonnummer: keuring.adresID.klantID.telefoonnummer,
//         },
//       ])
//       .select();

//     if (klantError) {
//       console.error("Error toevoegen van klant: ", klantError);
//     } else if (klantData.length > 0) {
//       klantID = klantData[0].id || null;
//     }

//     const { data: facturatieData, error: facturatieError } = await supabase
//       .from("Facturatie")
//       .insert({
//         naar: keuring.facturatieID.naar,
//         voornaam:
//           keuring.facturatieID.naar == Facturatie.HETZELFDE
//             ? keuring.adresID.klantID.voornaam
//             : keuring.facturatieID.voornaam,
//         familienaam:
//           keuring.facturatieID.naar == Facturatie.HETZELFDE
//             ? keuring.adresID.klantID.familienaam
//             : keuring.facturatieID.familienaam,
//         emailadres:
//           keuring.facturatieID.naar == Facturatie.HETZELFDE
//             ? keuring.adresID.klantID.emailadres
//             : keuring.facturatieID.emailadres,
//         telefoonnummer:
//           keuring.facturatieID.naar == Facturatie.HETZELFDE
//             ? keuring.adresID.klantID.telefoonnummer
//             : keuring.facturatieID.telefoonnummer,
//         straatnaam:
//           keuring.facturatieID.naar == Facturatie.HETZELFDE
//             ? keuring.adresID.straatnaam
//             : keuring.facturatieID.straatnaam,
//         nummer:
//           keuring.facturatieID.naar == Facturatie.HETZELFDE
//             ? +keuring.adresID.nummer
//             : +keuring.facturatieID.nummer,
//         postcode:
//           keuring.facturatieID.naar == Facturatie.HETZELFDE
//             ? +keuring.adresID.postcode
//             : +keuring.facturatieID.postcode,
//         gemeente:
//           keuring.facturatieID.naar == Facturatie.HETZELFDE
//             ? keuring.adresID.gemeente
//             : keuring.facturatieID.gemeente,
//       })
//       .select();

//     if (facturatieError) {
//       console.error("Error toevoegen van facturatie: ", facturatieError);
//     } else if (facturatieData.length > 0) {
//       facturatieID = facturatieData[0].id || null;
//     }

//     if (klantID) {
//       const { data: adresData, error: adresError } = await supabase
//         .from("Adres")
//         .insert([
//           {
//             straatnaam: keuring.adresID.straatnaam,
//             nummer: keuring.adresID.nummer,
//             postcode: +keuring.adresID.postcode,
//             gemeente: keuring.adresID.gemeente,
//             klantID: klantID,
//             isFacturatieAdres:
//               keuring.facturatieID.naar == Facturatie.HETZELFDE ? true : false,
//           },
//         ])
//         .select();

//       if (adresError) {
//         console.error("Error toevoegen van adres: ", adresError);
//       } else if (adresData.length > 0) {
//         adresID = adresData[0].id || null;
//       }
//     }

//     if (adresID && facturatieID) {
//       const { data: keuringData, error: keuringError } = await supabase
//         .from("Keuring")
//         .insert({
//           datumPlaatsbezoek: keuring.datumPlaatsbezoek,
//           adresID: adresID,
//           facturatieID: facturatieID,
//           toegewezen_aan: keuring.zaakvoerder,
//           status: keuring.status,
//           type: keuring.type,
//           created_by: user.id,
//           opmerking: keuring.opmerking,
//           toegang_eenheid: keuring.toegang_eenheid,
//         })
//         .select();

//       if (keuringError) {
//         console.error("Error toevoegen van keuring: ", keuringError);
//       } else if (keuringData.length > 0) {
//         keuringID = keuringData[0].id || null;
//       }
//     }

//     if (keuring.extraDocumenten.length > 0) {
//       if (keuringID) {
//         keuring.extraDocumenten.forEach(async (extraDocument) => {
//           const { data: extraDocumentData, error: extraDocumentError } =
//             await supabase
//               .from("ExtraDocument")
//               .insert({
//                 format: extraDocument.format,
//                 name: extraDocument.name,
//                 size: extraDocument.size,
//                 cldnry_id: extraDocument.cldnry_id,
//                 keuringID: keuringID,
//               })
//               .select();

//           if (extraDocumentError) {
//             console.error(
//               "Error toevoegen van extra document: ",
//               extraDocumentError
//             );
//           }
//         });
//       }
//     }

//     router.replace("/keuringen");
//   };

//   return (
//     <main>
//       <div>
//         {
//           <header>
//             <h1 className={`${roboto900.className} ${styles.title}`}>
//               NIEUWE KEURING
//             </h1>
//             <Button colorScheme="green" onClick={onOpen}>
//               OPSLAAN
//             </Button>
//             <AlertDialog
//               isOpen={isOpen}
//               leastDestructiveRef={cancelRef}
//               onClose={onClose}
//             >
//               <AlertDialogOverlay>
//                 <AlertDialogContent>
//                   <AlertDialogHeader fontSize="lg" fontWeight="bold">
//                     Keuring opslaan
//                   </AlertDialogHeader>
//                   <AlertDialogBody>
//                     Ben je zeker dat u deze keuring wil opslaan?
//                   </AlertDialogBody>
//                   <AlertDialogFooter>
//                     <Button ref={cancelRef} onClick={onClose}>
//                       Sluit venster
//                     </Button>
//                     <Button ml={3} onClick={handleUploadKeuring}>
//                       Upload Keuring
//                     </Button>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialogOverlay>
//             </AlertDialog>
//           </header>
//         }
//         <Grid
//           h="800px"
//           templateRows="repeat(12, 1fr)"
//           templateColumns="repeat(12, 1fr)"
//           gap={15}
//         >
//           <KlantAdresCard keuring={keuring} setKeuring={setKeuring} />
//           <FacturatieCard keuring={keuring} setKeuring={setKeuring} />
//           <ExtraDocumentenCard keuring={keuring} setKeuring={setKeuring} />
//           <ToegangEenheidTypeKeuringCard
//             keuring={keuring}
//             setKeuring={setKeuring}
//           />
//           <ExtraOpmerkingenCard keuring={keuring} setKeuring={setKeuring} />
//           {/* <CertificatenCard keuring={keuring} setKeuring={setKeuring} /> */}
//         </Grid>
//       </div>
//     </main>
//   );
// };

// export default Nieuw;
