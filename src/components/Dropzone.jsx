import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { Box, List, ListItem } from "@chakra-ui/react";

import styles from "@/styles/dropzone.module.css";
import { CardBody } from "@chakra-ui/react";
import Image from "next/image";
import { FaRegFilePdf } from "react-icons/fa";

const Dropzone = ({
  keuring,
  setKeuring,
  forFiles,
  acceptFileType,
  multipleFiles,
  text,
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

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles?.length) {
        const updatedFiles = acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        );

        if (forFiles == "extradocs") {
          setKeuring((previousKeuring) => ({
            ...previousKeuring,
            extraDocumenten: [
              ...previousKeuring.extraDocumenten,
              ...updatedFiles,
            ],
          }));
        } else {
          setKeuring((previousKeuring) => ({
            ...previousKeuring,
            certificaat: updatedFiles[0],
          }));
        }
      }
    },
    [forFiles, setKeuring]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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

  const getStyle = () => {
    return forFiles == "extradocs" && keuring?.extraDocumenten.length > 2
      ? { overflowY: "scroll" }
      : {};
  };

  const renderDropZone = (forFiles) => {
    if (forFiles == "extradocs") {
      return (
        <>
          {!keuring?.extraDocumenten.length > 0 ? (
            isDragActive ? (
              <div className={styles.content}>
                <p>Drop de bestanden hier..</p>
              </div>
            ) : (
              <div className={styles.content}>
                <div className={styles.icon}>
                  <FaRegFilePdf size={48} color="#F40F02" />
                </div>
                <p>{text}</p>
              </div>
            )
          ) : (
            <div className={styles.content}>
              <List>
                {keuring?.extraDocumenten.map((file) => (
                  <ListItem key={file.name}>
                    <div className={styles.imageContainer}>
                      {file.type.startsWith("image/") ? (
                        <Image
                          width={100}
                          height={100}
                          src={file.preview}
                          alt=""
                          style={{ objectFit: "contain" }}
                        />
                      ) : (
                        <FaRegFilePdf size={48} color="#F40F02" />
                      )}
                    </div>
                    <div className={styles.imageInfo}>
                      <span className={styles.imageName}>{file.name}</span>
                      <span className={styles.imageSize}>
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  </ListItem>
                ))}
              </List>
            </div>
          )}
        </>
      );
    } else {
      return (
        <>
          {Object.keys(keuring?.certificaat ?? {}).length === 0 ? (
            isDragActive ? (
              <div className={styles.content}>
                <p>Drop het PDF-bestand hier..</p>
              </div>
            ) : (
              <div className={styles.content}>
                <div className={styles.icon}>
                  <FaRegFilePdf size={48} color="#F40F02" />
                </div>
                <p>{text}</p>
              </div>
            )
          ) : (
            <div className={styles.content}>
              <Box display="flex">
                <div className={styles.imageContainer}>
                  <FaRegFilePdf size={48} color="#F40F02" />
                </div>
                <div className={styles.imageInfo}>
                  <span className={styles.imageName}>
                    {keuring.certificaat.name}
                  </span>
                  <span className={styles.imageSize}>
                    {formatFileSize(keuring.certificaat.size)}
                  </span>
                </div>
              </Box>
            </div>
          )}
        </>
      );
    }
  };

  return (
    <CardBody style={getStyle()}>
      <div {...getRootProps()} className={styles.dropzone}>
        <input {...getInputProps()} />
        {forFiles == "extradocs"
          ? renderDropZone("extradocs")
          : renderDropZone("certificaat")}
      </div>
    </CardBody>
  );
};

export default Dropzone;
