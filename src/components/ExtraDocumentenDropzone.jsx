import styles from "@/styles/dropzone.module.css";
import { IconButton, List, ListItem, Spacer, Text } from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Image } from "cloudinary-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { FaRegFilePdf } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const ExtraDocumentenDropzone = ({
  setValue,
  getValues,
  acceptFileType,
  multipleFiles,
  extraDocumenten,
}) => {
  const getFileAcceptValue = () => {
    if (acceptFileType === "images") {
      return {
        "image/*": [".png", ".jpg", ".jpeg", ".gif"],
        "application/pdf": [".pdf"],
      };
    } else if (acceptFileType === "pdf") {
      return { "application/pdf": [".pdf"] };
    }
    return undefined;
  };

  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  const router = useRouter();

  const onDrop = async (acceptedFiles) => {
    for (const acceptedFile of acceptedFiles) {
      const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
      const formData = new FormData();
      formData.append("file", acceptedFile);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );
      const response = await fetch(url, {
        method: "post",
        body: formData,
      });
      const data = await response.json();

      console.log("UPLOADED doc:", data);
      const newDocument = {
        // id: data.public_id,
        format: data.format,
        name: data.original_filename,
        size: data.bytes,
        cldnry_id: data.public_id,
      };

      setValue("extraDocumenten", [
        ...getValues("extraDocumenten"),
        newDocument,
      ]);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    multiple: true,
    onDrop,
    accept: getFileAcceptValue(),
    maxFiles: multipleFiles ? 0 : 1,
  });

  const formatFileSize = (bytes) => {
    const kilobyte = 1024;
    const megabyte = kilobyte * 1024;
    const gigabyte = megabyte * 1024;

    if (bytes < kilobyte) {
      return bytes + " B";
    } else if (bytes < megabyte) {
      return (bytes / kilobyte).toFixed(2) + " KB";
    } else if (bytes < gigabyte) {
      return (bytes / megabyte).toFixed(2) + " MB";
    } else {
      return (bytes / gigabyte).toFixed(2) + " GB";
    }
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
    }),
    [isFocused]
  );

  const handleDeleteExtraDocsOnClick = async (id) => {
    const { error } = await supabase
      .from("ExtraDocument")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting extra doc: ", id);
    } else {
      router.refresh();
    }
  };

  return (
    <>
      <div {...getRootProps({ style })} className={styles.dropzone}>
        <input {...getInputProps()} />
        <div className={styles.dzone}>
          {isDragActive ? (
            <Text fontSize="sm">Drop the files here...</Text>
          ) : (
            <Text fontSize="sm">
              Sleep hier afbeeldingen/PDF-bestanden naartoe, of klik hier om ze
              te selecteren.
            </Text>
          )}
        </div>
      </div>
      {extraDocumenten?.length > 0 && (
        <div className={styles.content}>
          <List mt={10}>
            {extraDocumenten.map((document, index) => (
              <ListItem key={document.id}>
                <div className={styles.imageContainer}>
                  {document.format !== "pdf" ? (
                    <Image
                      alt=""
                      cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                      publicId={document.cldnry_id}
                      width="30"
                      height="30"
                      scrop="scale"
                    />
                  ) : (
                    <FaRegFilePdf size={30} color="#F40F02" />
                  )}
                </div>

                <div className={styles.documentInfo}>
                  <Text fontSize="sm" className={styles.documentName}>
                    {document.name}
                  </Text>

                  <Spacer />
                  <Text fontSize="sm" className={styles.documentSize}>
                    {formatFileSize(document.size)}
                  </Text>
                  <IconButton
                    onClick={() => handleDeleteExtraDocsOnClick(document.id)}
                    icon={<MdDelete />}
                    mx={1}
                  ></IconButton>
                </div>
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </>
  );
};

export default ExtraDocumentenDropzone;
