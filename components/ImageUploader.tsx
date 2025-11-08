import React, { useRef } from 'react';

interface ImageUploaderProps {
  id: string;
  label: string;
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
  accept?: string;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-400/50 group-hover:text-cyan-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onImageUpload, imageUrl, accept = "image/*" }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div 
        className="group w-full aspect-square bg-white/5 border-2 border-dashed border-cyan-400/30 rounded-xl flex flex-col justify-center items-center text-center p-4 transition-all duration-300 hover:border-cyan-400/80 hover:bg-white/10 cursor-pointer"
        onClick={handleClick}
    >
      <input
        id={id}
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />
      {imageUrl ? (
        <img src={imageUrl} alt={label} className="max-w-full max-h-full object-contain rounded-lg" />
      ) : (
        <div className="flex flex-col items-center">
            <UploadIcon />
            <p className="mt-2 text-lg font-semibold text-cyan-300/80 group-hover:text-cyan-200">{label}</p>
            <p className="text-xs text-gray-400">Click to browse</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
