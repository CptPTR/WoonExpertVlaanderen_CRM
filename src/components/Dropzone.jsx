import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = () => {
  const [file, setFile] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      setFile(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  return (
    <form>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {!file ? (
          isDragActive ? (
            <p>Drop the certificate here..</p>
          ) : (
            <p>Drag and drop a PDF file here, or click to select a file</p>
          )
        ) : (
          <p>{file.name}</p>
        )}
      </div>
    </form>
  );
};

export default Dropzone;
