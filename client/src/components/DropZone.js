import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const DropZone = (props) => {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = (function (theFile) {
        var fileName = theFile.name;
        return function (e) {
          console.log(fileName);
          props.sendFile(e.target.result, fileName.split('-')[0]);
        };
      })(file);
      /*reader => props.sendFile(reader.result);*/
      reader.readAsText(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="justify-text-center">
      <input {...getInputProps()} />
      <p>Drag 'n' Drop or Click to Browse</p>
    </div>
  );
};

export default DropZone;
