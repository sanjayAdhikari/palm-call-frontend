import { Image } from "antd";
import { useApiManager } from "hooks";
import React, { useCallback, useEffect, useState } from "react";

interface ViewFileProps {
  name: string[];
  className?: string;
  canPreview?: boolean;
  onError?: (status?: boolean) => void;
}

const DEFAULT_CLASSES =
  "rounded-md max-h-[120px] max-w-[120px] min-h-[120px] min-w-[120px]";

const ViewFile: React.FC<ViewFileProps> = ({
  name,
  canPreview,
  onError,
  className = DEFAULT_CLASSES,
}) => {
  const [files, setFiles] = useState<Blob[]>([]);
  const [prevFile, setPrevFile] = useState<string>();
  const { getFilesHandler } = useApiManager();

  const fetchFiles = useCallback(async (fileNames: string[]) => {
    try {
      const fileRes = await getFilesHandler(fileNames);
      setFiles(fileRes);
    } catch (error) {
      console.log(error);
      typeof onError === "function" && onError(true);
      setFiles([]);
    }
  }, []);

  useEffect(() => {
    if (name?.length) {
      if (name?.[0] == prevFile) return;
      fetchFiles(name);
      setPrevFile(name?.[0]);
    } else {
      setFiles([]);
    }
  }, [name, prevFile]);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
    };
  }, [files]);

  if (!files.length) return null;

  return (
    <>
      {files.map((file, index) => (
        <Image
          className={className}
          key={`file-${index}`}
          src={URL.createObjectURL(file)}
          alt={`file-preview-${index}`}
          preview={canPreview}
        />
      ))}
    </>
  );
};

export default React.memo(ViewFile);
