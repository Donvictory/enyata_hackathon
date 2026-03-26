import { useMutation } from "@tanstack/react-query";
import apiClient from "../lib/api-client";

export const useUploadMedia = () => {
  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiClient.post("/media/upload/single", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });
};
