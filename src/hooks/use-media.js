import { useMutation } from "@tanstack/react-query";

export const useUploadMedia = () => {
  return useMutation({
    mutationFn: async (file) => {
      return {
        data: {
          url: URL.createObjectURL(file),
        }
      };
    },
  });
};
