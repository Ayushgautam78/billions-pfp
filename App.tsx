import React, { useState, useEffect, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import Button from './components/Button';
import { generatePfp } from './services/geminiService';

const App: React.FC = () => {
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [overlayImage, setOverlayImage] = useState<File | null>(null);

  const [faceImageUrl, setFaceImageUrl] = useState<string | null>(null);
  const [overlayImageUrl, setOverlayImageUrl] = useState<string | null>(null);

  const [generatedPfpUrl, setGeneratedPfpUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const cleanupUrls = useCallback(() => {
    if (faceImageUrl) URL.revokeObjectURL(faceImageUrl);
    if (overlayImageUrl) URL.revokeObjectURL(overlayImageUrl);
  }, [faceImageUrl, overlayImageUrl]);

  useEffect(() => {
    return () => {
      cleanupUrls();
    };
  }, [cleanupUrls]);

  const handleFaceImageUpload = (file: File) => {
    cleanupUrls();
    setFaceImage(file);
    setFaceImageUrl(URL.createObjectURL(file));
  };
  
  const handleOverlayImageUpload = (file: File) => {
    cleanupUrls();
    setOverlayImage(file);
    setOverlayImageUrl(URL.createObjectURL(file));
  };

  const handleGenerateClick = async () => {
    if (!faceImage || !overlayImage) {
      setError("Please upload both a face photo and a glasses/mask image.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPfpUrl(null);

    try {
      const resultImageUrl = await generatePfp(faceImage, overlayImage);
      setGeneratedPfpUrl(resultImageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred during PFP generation.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedPfpUrl) return;
    const link = document.createElement('a');
    link.href = generatedPfpUrl;
    link.download = 'billions-network-pfp.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const resetState = () => {
    cleanupUrls();
    setFaceImage(null);
    setOverlayImage(null);
    setFaceImageUrl(null);
    setOverlayImageUrl(null);
    setGeneratedPfpUrl(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyan-300 drop-shadow-[0_0_10px_rgba(72,187,255,0.7)]">
          Billions Network PFP Generator
        </h1>
        <p className="text-fuchsia-400 mt-2 text-sm sm:text-base">
          — Made by Rohit —
        </p>
      </header>
      
      <main className="w-full max-w-5xl flex-grow flex flex-col items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ImageUploader
            id="face-uploader"
            label="Upload Face Photo"
            onImageUpload={handleFaceImageUpload}
            imageUrl={faceImageUrl}
            />
          <ImageUploader
            id="overlay-uploader"
            label="Upload Glasses/Mask (PNG)"
            onImageUpload={handleOverlayImageUpload}
            imageUrl={overlayImageUrl}
            accept="image/png"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <Button 
                onClick={handleGenerateClick}
                disabled={!faceImage || !overlayImage || isLoading}
            >
                {isLoading ? 'Generating...' : 'Generate PFP'}
            </Button>
            {(faceImage || overlayImage) && (
              <Button onClick={resetState} className="bg-red-500/50 hover:bg-red-500/80 hover:shadow-red-500/50">
                Reset
              </Button>
            )}
        </div>

        {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg text-center mb-8">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        )}

        {isLoading && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
                <p className="mt-4 text-lg text-cyan-300">Merging images with Gemini AI...</p>
                <p className="text-sm text-purple-300">This might take a moment.</p>
            </div>
        )}

        {generatedPfpUrl && (
            <div className="w-full max-w-md flex flex-col items-center gap-6 p-6 bg-white/5 border border-cyan-400/20 rounded-xl shadow-lg shadow-cyan-500/10">
                <h2 className="text-2xl font-bold text-cyan-300">Your PFP is Ready!</h2>
                <div className="relative group">
                    <img 
                        src={generatedPfpUrl} 
                        alt="Generated PFP" 
                        className="rounded-full w-64 h-64 object-cover border-4 border-fuchsia-500 shadow-2xl shadow-fuchsia-500/50"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-xl font-bold">Looks great!</p>
                    </div>
                </div>
                <Button onClick={handleDownload}>
                    Download PFP
                </Button>
            </div>
        )}
      </main>

       <footer className="w-full max-w-5xl text-center mt-auto py-4">
          <p className="text-gray-400 text-xs">Powered by Google Gemini</p>
       </footer>
    </div>
  );
};

export default App;
