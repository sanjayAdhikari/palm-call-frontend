import { ApiUrl } from "constant";
import { Api } from "services";

function UseApiManager() {
  const { postFormApi, getBlobResApi, deleteApi } = Api();

  const uploadFileHandler = async (payload: any) => {
    try {
      const res: any = await postFormApi(ApiUrl.file.post_upload, payload);
      return res?.name;
    } catch (err) {
      throw new Error("Error on uploading file");
    }
  };
  const deleteFileHandler = async (name: string) => {
    try {
      await deleteApi(ApiUrl.file.delete_file(name));
    } catch (err) {}
  };

  const getFilesHandler = async (path: string[]) => {
    try {
      let tempPath = path?.filter((e) => e);
      const res: any = await Promise.all(
        tempPath?.map((e) => getBlobResApi(ApiUrl.file.get_file(e))),
      );
      return res;
    } catch (err) {
      throw err;
    }
  };
  return {
    uploadFileHandler,
    deleteFileHandler,
    getFilesHandler,
  };
}

export default UseApiManager;
