import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { Box, List, ListItem } from "@chakra-ui/react";

import styles from "@/styles/dropzone.module.css";
import { CardBody } from "@chakra-ui/react";
import { Image } from "cloudinary-react";
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
      const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

      acceptedFiles.forEach(async (acceptedFile) => {
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

        if (forFiles == "extradocs") {
          setKeuring((previousKeuring) => ({
            ...previousKeuring,
            extraDocumenten: [
              ...previousKeuring.extraDocumenten,
              {
                id: data.public_id,
                format: data.format,
                name: data.original_filename,
                size: data.bytes,
              },
            ],
          }));
        } else if (forFiles == "epc-certificaat") {
          setKeuring((previousKeuring) => ({
            ...previousKeuring,
            certificaat: {
              ...previousKeuring.certificaat,
              epc: {
                id: data.public_id,
                format: data.format,
                name: data.original_filename,
                size: data.bytes,
              },
            },
          }));
        } else if (forFiles == "asbest-certificaat") {
          setKeuring((previousKeuring) => ({
            ...previousKeuring,
            certificaat: {
              ...previousKeuring.certificaat,
              asbest: {
                id: data.public_id,
                format: data.format,
                name: data.original_filename,
                size: data.bytes,
              },
            },
          }));
        }
      });
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
    if (forFiles === "extradocs") {
      if (!keuring?.extraDocumenten.length > 0) {
        return isDragActive ? (
          <div className={styles.content}>
            <p>Drop the files here..</p>
          </div>
        ) : (
          renderDefaultContent()
        );
      } else {
        return (
          <div className={styles.content}>
            <List>
              {keuring?.extraDocumenten.map((xtraDoc) => (
                <ListItem key={xtraDoc.id}>
                  <div className={styles.imageContainer}>
                    {xtraDoc.format !== "pdf" ? (
                      <Image
                        alt=""
                        cloudName={
                          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                        }
                        publicId={xtraDoc.id}
                        width="100"
                        height="100"
                        scrop="scale"
                      />
                    ) : (
                      <FaRegFilePdf size={48} color="#F40F02" />
                    )}
                  </div>

                  <div className={styles.imageInfo}>
                    <span className={styles.imageName}>{xtraDoc.name}</span>
                    <span className={styles.imageSize}>
                      {formatFileSize(xtraDoc.size)}
                    </span>
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
        );
      }
    } else if (forFiles === "epc-certificaat") {
      if (Object.keys(keuring?.certificaat?.epc ?? {}).length === 0) {
        return isDragActive ? (
          <div className={styles.content}>
            <p>Drop the PDF file here..</p>
          </div>
        ) : (
          renderDefaultContent()
        );
      } else {
        return (
          <div className={styles.content}>
            <Box display="flex">
              <div className={styles.imageContainer}>
                <FaRegFilePdf size={48} color="#F40F02" />
              </div>
              <div className={styles.imageInfo}>
                <span className={styles.imageName}>
                  {keuring.certificaat.epc.name}
                </span>
                <span className={styles.imageSize}>
                  {formatFileSize(keuring.certificaat.epc.size)}
                </span>
              </div>
            </Box>
          </div>
        );
      }
    } else if (forFiles === "asbest-certificaat") {
      if (Object.keys(keuring?.certificaat?.asbest ?? {}).length === 0) {
        return isDragActive ? (
          <div className={styles.content}>
            <p>Drop the PDF file here..</p>
          </div>
        ) : (
          renderDefaultContent()
        );
      } else {
        return (
          <div className={styles.content}>
            <Box display="flex">
              <div className={styles.imageContainer}>
                <FaRegFilePdf size={48} color="#F40F02" />
              </div>
              <div className={styles.imageInfo}>
                <span className={styles.imageName}>
                  {keuring.certificaat.asbest.name}
                </span>
                <span className={styles.imageSize}>
                  {formatFileSize(keuring.certificaat.asbest.size)}
                </span>
              </div>
            </Box>
          </div>
        );
      }
    }
  };

  const renderDefaultContent = () => {
    return (
      <div className={styles.content}>
        <div className={styles.icon}>
          <FaRegFilePdf size={48} color="#F40F02" />
        </div>
        <p>{text}</p>
      </div>
    );
  };

  return (
    <CardBody style={getStyle()}>
      <div {...getRootProps()} className={styles.dropzone}>
        <input {...getInputProps()} />
        {forFiles === "extradocs"
          ? renderDropZone("extradocs")
          : forFiles === "epc-certificaat"
          ? renderDropZone("epc-certificaat")
          : renderDropZone("asbest-certificaat")}
      </div>
    </CardBody>
  );
};

export default Dropzone;
