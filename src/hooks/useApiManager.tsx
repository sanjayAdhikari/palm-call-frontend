import {
  CountryType,
  IDeliveryType,
  IPaginateData,
  IRating,
  IWallet,
  PackageStatusEnum,
} from "interfaces";
import { useContextData } from "./index";
import { ApiUrl } from "constant";
import { Api } from "services";

interface INextCTA {
  description: string;
  label: string;
  order: number;
  status: PackageStatusEnum;
}
interface IPackageRating {
  customer: IRating;
  vendor: IRating;
}

function UseApiManager() {
  const { postFormApi, getBlobResApi, deleteApi } = Api();
  const {
    lists: packageNextCTA,
    getListHandler: getPackageCTAHandler,
    isLoading: isCTALoading,
  } = useContextData();
  const {
    details: ratingDetails,
    getDetailsHandler: getRatingDetails,
    isLoading: isRatingLoading,
  } = useContextData();
  const {
    details: customerWalletDetails,
    getDetailsHandler: getCustomerWalletDetails,
    isDetailsLoading: isCustomerWalletDetailsLoading,
  } = useContextData();
  const {
    lists: courierCountry,
    getListHandler: getCourierCountry,
    isLoading: isCourierCountryLoading,
  } = useContextData();
  const {
    lists: deliveryTypes,
    getListHandler: getDeliveryType,
    isLoading: isDeliveryTypeLoading,
  } = useContextData();
  const getNextPackageCTAHandler = (packageId: string) => {
    return getPackageCTAHandler(ApiUrl.package.get_nextCTA(packageId));
  };
  const getRatingDetailsHandler = (activityID: string) => {
    return getRatingDetails(ApiUrl.rating.get_ratingDetails(activityID));
  };
  const getDeliveryTypeHandler = (srcCountry: string, destCountry: string) => {
    return getDeliveryType(ApiUrl.package.get_deliveryType, {
      sourceCountry: srcCountry,
      destinationCountry: destCountry,
    });
  };
  const getCourierCountryHandler = () => {
    return getCourierCountry(ApiUrl.package.get_courierCountry, {});
  };
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
  const getCustomerWalletDetailsHandler = async (
    ownerId: string,
    ownerType: any,
  ) => {
    return await getCustomerWalletDetails(ApiUrl.wallet.get_my, {
      ownerID: ownerId,
      ownerType: ownerType,
    });
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
    isCTALoading,
    packageNextCTA: packageNextCTA as INextCTA[],
    isDeliveryTypeLoading,
    deliveryTypes: deliveryTypes as IPaginateData<IDeliveryType>,
    isCourierCountryLoading,
    courierCountry: courierCountry as Record<CountryType, CountryType[]>,
    customerWalletDetails: customerWalletDetails as IWallet,
    ratingDetails: ratingDetails as IPackageRating,
    isCustomerWalletDetailsLoading,
    isRatingLoading,
    getCustomerWalletDetailsHandler,
    getRatingDetailsHandler,
    getCourierCountryHandler,
    getNextPackageCTAHandler,
    getDeliveryTypeHandler,
    uploadFileHandler,
    deleteFileHandler,
    getFilesHandler,
  };
}

export default UseApiManager;
