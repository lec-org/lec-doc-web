import { handleImageUpload } from "@lec/doc-editor";
import { uploadFile } from "@/features/page/services/page-service.ts";
import { notifications } from "@mantine/notifications";
import { getFileUploadSizeLimit } from "@/lib/config.ts";
import { formatBytes } from "@/lib";
import i18n from "@/i18n.ts";
import { getApiErrorMessage } from "@/lib/api-error.ts";

export const uploadImageAction = handleImageUpload({
  onUpload: async (file: File, pageId: string): Promise<any> => {
    try {
      return await uploadFile(file, pageId);
    } catch (err) {
      notifications.show({
        color: "red",
        message: getApiErrorMessage(err, i18n.t("Upload failed")),
      });
      throw err;
    }
  },
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      return false;
    }
    if (file.size > getFileUploadSizeLimit()) {
      notifications.show({
        color: "red",
        message: i18n.t("File exceeds the {{limit}} attachment limit", {
          limit: formatBytes(getFileUploadSizeLimit()),
        }),
      });
      return false;
    }
    return true;
  },
});
