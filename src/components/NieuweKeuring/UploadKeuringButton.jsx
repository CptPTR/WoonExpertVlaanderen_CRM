"use client";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";

const UploadKeuringButton = ({ handleSubmit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button type="submit">Opslaan</Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Keuring opslaan
            </AlertDialogHeader>
            <AlertDialogBody>
              Ben je zeker dat u deze keuring wil opslaan?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Sluit venster
              </Button>
              <Button ml={3} onClick={handleUploadKeuring}>
                Upload Keuring
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default UploadKeuringButton;
