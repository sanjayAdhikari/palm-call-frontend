import axios from "axios";
import { BASE_URL } from "configs"; // Importing the API configuration
import { getAccessToken, getRefreshToken } from "utils"; // Importing the utility function to retrieve the authentication token

/**
 * API Utility Class for managing HTTP requests with Axios.
 */
function Api() {
  const handleError = (error) => {
    // Handling 401 - Unauthorized Error (e.g. expired token)
    if (error?.response?.status === 401) {
      throw error?.response?.data?.message
        ? new Error(error?.response?.data?.message)
        : new Error("Login expired");
    }
    // Handling 404 - Not Found Error (e.g. wrong API routes)
    else if (error?.response?.status === 404) {
      throw error?.response?.data?.message
        ? new Error(error?.response?.data?.message)
        : new Error("Routes not found");
    }
    // Handling other types of errors
    else {
      if (error?.response?.data) {
        throw error?.response?.data; // Return specific data error message
      } else {
        throw error?.response; // Return a general error response
      }
    }
  };

  const handleSuccess = (response: any) => {
    // If the response status is 200 (OK), return the response data.
    if (response?.status === 200) {
      return response?.data;
    }
    // Otherwise, return the entire response object.
    return response;
  };

  const apiAxiosInstance = (tokenType: "access" | "refresh" = "access") => {
    const headers: any = {
      "Content-Type": "application/json", // Set content type as JSON
      Accept: "application/json", // Accept JSON responses
    }
    if(tokenType === 'access') {
      headers.Authorization = getAccessToken(); // Add Authorization token in header
    }
    let axiosInstance = axios.create({
      baseURL: BASE_URL, // Set base URL for API requests
      headers: headers,
      withCredentials: tokenType === "refresh",
    });

    // Add interceptors for handling responses and errors globally
    axiosInstance.interceptors.response.use(handleSuccess, handleError);
    return axiosInstance;
  };

  async function getApi(url: string, body?: any) {
    try {
      return await apiAxiosInstance().get(url, {
        params: body, // Attach query parameters to the GET request
      });
    } catch (err: any) {
      throw err; // Throw error for further handling
    }
  }

  async function getBlobResApi(url: string, body?: any) {
    try {
      return await apiAxiosInstance().get(url, {
        params: body,
        responseType: "blob", // Expect a blob response type (e.g., files or images)
      });
    } catch (err: any) {
      throw err;
    }
  }

  async function postApi(url: string, body: any) {
    try {
      // Make POST request with body data
      return await apiAxiosInstance().post(url, body); // Return the response
    } catch (err: any) {
      throw err; // Throw error for further handling
    }
  }

  async function putApi(url: string, body?: any) {
    try {
      // Make PUT request with body data
      return await apiAxiosInstance().put(url, body);
    } catch (err: any) {
      throw err;
    }
  }

  async function deleteApi(
    url: string,
    body?: any,
    config?: {
      tokenType: "access" | "refresh";
    },
  ) {
    try {
      return await apiAxiosInstance(config?.tokenType).delete(url, {
        data: body, // Attach data to the DELETE request
      });
    } catch (err: any) {
      throw err;
    }
  }

  async function postFormApi(url: string, body?: any) {
    try {
      return await apiAxiosInstance().post(url, body, {
        headers: {
          "Content-Type": "multipart/form-data", // Specify multipart/form-data for file uploads
        },
      });
    } catch (err) {
      throw err;
    }
  }

  // Return the API methods and utility functions for use in other parts of the app
  return {
    getApi,
    postApi,
    putApi,
    deleteApi,
    postFormApi,
    getBlobResApi,
    utils: { handleError, handleSuccess }, // Expose error and success handling methods
  };
}

export default Api;
