import { useDropzone } from "react-dropzone";

import styles from "@/styles/dropzone.module.css";
import { List, ListItem, Spacer, Tooltip } from "@chakra-ui/react";
import { Image } from "cloudinary-react";
import { useEffect, useMemo, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa";

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
}) => {
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  useEffect(() => {
    const formValues = getValues("extraDocumenten");

    uploadedDocuments.map((doc) => {
      setValue("extraDocumenten", [...formValues, doc]);
    });
  }, [getValues, setValue, uploadedDocuments]);

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

      const newDocument = {
        id: data.public_id,
        format: data.format,
        name: data.original_filename,
        size: data.bytes,
      };

      setUploadedDocuments((prevDocuments) => [...prevDocuments, newDocument]);
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

  return (
    <>
      <div {...getRootProps({ style })} className={styles.dropzone}>
        <input {...getInputProps()} />
        <div className={styles.dzone}>
          <div className={styles.icon}>
            <FaRegFilePdf size={48} color="#F40F02" />
          </div>
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <p>
              Sleep hier afbeeldingen/PDF-bestanden naartoe, of klik om ze te
              selecteren.
            </p>
          )}
        </div>
      </div>
      {uploadedDocuments.length > 0 && (
        <div className={styles.content}>
          <List mt={10}>
            {uploadedDocuments.map((document, index) => (
              <ListItem key={document.id}>
                <div className={styles.imageContainer}>
                  {document.format !== "pdf" ? (
                    <Image
                      alt=""
                      cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                      publicId={document.id}
                      width="30"
                      height="30"
                      scrop="scale"
                    />
                  ) : (
                    <FaRegFilePdf size={30} color="#F40F02" />
                  )}
                </div>

                <div className={styles.documentInfo}>
                  <span className={styles.documentName}>{document.name}</span>

                  <Spacer />
                  <span className={styles.documentSize}>
                    {formatFileSize(document.size)}
                  </span>
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
