// A helper type for the generative part
interface GenerativePart {
    inlineData: {
        data: string;
        mimeType: string;
    };
}

/**
 * Converts a File object to a base64 string.
 * @param file The file to convert.
 * @returns A promise that resolves with the base64 encoded string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // The result includes the data URL prefix (e.g., "data:image/png;base64,"), 
      // which we need to remove for the API.
      const base64String = result.split(',')[1];
      if (base64String) {
        resolve(base64String);
      } else {
        reject(new Error("Failed to read base64 string from file."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Converts a File object into a GoogleGenerativeAI.Part object.
 * @param file The file to convert.
 * @returns A promise that resolves with the Part object.
 */
export const fileToGenerativePart = async (file: File): Promise<GenerativePart> => {
    const base64EncodedData = await fileToBase64(file);
    return {
        inlineData: {
            data: base64EncodedData,
            mimeType: file.type,
        },
    };
};
