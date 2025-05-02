import { DEFAULT_FROM_DATE, DEFAULT_TO_DATE, PageLinks } from "constant";
import { ParamsNames, QueryNames } from "interfaces";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useScreenSize } from "./index";

function useQueryParams() {
  const [query] = useSearchParams();
  const params = useParams<ParamsNames>();
  const navigate = useNavigate();
  const location = useLocation();
  const editId = params.ID;
  const { isSmScreen } = useScreenSize();
  const isActiveList = query.get(QueryNames.INACTIVE) != "1";
  const returnUrl = query.get(QueryNames.RETURN_URL);
  const from = query.get(QueryNames.FROM) || DEFAULT_FROM_DATE;
  const to = query.get(QueryNames.TO) || DEFAULT_TO_DATE;

  const getResponsiveBackLink = () => {
    return returnUrl || PageLinks.dashboard.more;
  };

  const goToWithReturnUrl = (url: string) => {
    return navigate({
      pathname: url,
      search: `?${QueryNames.RETURN_URL}=${location.pathname}`,
    });
  };

  const goToChatDetails = (thread: string) => {
    navigate(
      isSmScreen
        ? PageLinks.dashboard.details_new(thread)
        : PageLinks.dashboard?.details(thread),
    );
  };

  return {
    isActiveList,
    editId,
    from,
    to,
    getResponsiveBackLink,
    goToWithReturnUrl,
    goToChatDetail,
  };
}

export default useQueryParams;
