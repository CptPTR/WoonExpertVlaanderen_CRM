import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import styles from "@/styles/dropzone.module.css";
import { FaRegFilePdf } from "react-icons/fa";
import Image from "next/image";

const Dropzone = ({ acceptFileType, multipleFiles }) => {
  const [files, setFiles] = useState([]);

  const getFileAcceptValue = () => {
    if (acceptFileType === "images") {
      return { "image/*": [".png", ".jpg", ".jpeg", ".gif"] };
    } else if (acceptFileType === "pdf") {
      return { "application/pdf": [".pdf"] };
    }
    return undefined;
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop,
    accept: getFileAcceptValue(),
    maxFiles: multipleFiles ? 0 : 1,
  });

  const removeFile = () => {
    if (files.length > 0) {
      setFiles([]);
    }
  };

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

  return (
    <form>
      <div {...getRootProps()} className={styles.dropzone}>
        <input {...getInputProps()} />
        {!files.length > 0 ? (
          isDragActive ? (
            <div className={styles.content}>
              <p>Drop het PDF-bestand hier..</p>
            </div>
          ) : (
            <div className={styles.content}>
              <div className={styles.icon}>
                <FaRegFilePdf size={48} color="#F40F02" />
              </div>
              <p>
                Sleep hier een PDF-bestand naartoe, <br />
                of klik om een bestand te selecteren
              </p>
            </div>
          )
        ) : (
          <div className={styles.content}>
            <ul>
              {files.map((file) => (
                <li key={file.name}>
                  <Image width={100} height={200} src={file.preview} alt="" />
                  {file.name} - {formatFileSize(file.size)}
                </li>
              ))}
            </ul>

            <button onClick={removeFile}>X</button>
          </div>
        )}
      </div>
    </form>
  );
};

export default Dropzone;
