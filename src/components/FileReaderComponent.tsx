import { useRef, useState, type ChangeEvent } from "react";
import { TailwindButton } from "./TailwindButton";

type FileReaderComponentProps = {
  onContent?: (text: string, fileName: string) => void;
  accept?: string;
};

export default function FileReaderComponent({
  onContent,
  accept = ".txt,.csv,.json,.md",
}: FileReaderComponentProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const readFile = (file: File) => {
    setError(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setContent(text);
      onContent?.(text, file.name);
    };
    reader.onerror = () => {
      setError("Failed to read file");
      setContent("");
    };
    reader.readAsText(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    readFile(file);
    event.target.value = "";
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Choose a text file to read"
      />
      <TailwindButton variant="secondary" type="button" onClick={openFilePicker}>
        Choose file
      </TailwindButton>
      {fileName && (
        <p className="text-sm text-neutral-600">Selected: {fileName}</p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {content && (
        <pre className="max-h-48 overflow-auto rounded border border-neutral-200 bg-neutral-50 p-3 text-sm whitespace-pre-wrap">
          {content}
        </pre>
      )}
    </div>
  );
}