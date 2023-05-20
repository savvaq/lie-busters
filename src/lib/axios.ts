import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { ResponseError } from './types';

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ResponseError>) => {
    // Don't show toast if the error is a validation error
    if (error.response?.status !== 422) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }

    return Promise.reject(error);
  }
);

export default axios;
