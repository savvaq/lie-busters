import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { ResponseError } from '@/lib/types';

const useFormErrors = () => {
  const [axiosError, setAxiosError] =
    useState<AxiosError<ResponseError> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!axiosError || !axiosError.response) {
      setErrors({});
      return;
    }

    const newErrors: typeof errors = {};
    const fieldErrors = axiosError.response.data.fieldErrors || {};

    Object.entries(fieldErrors).forEach(([field, errors]) => {
      if (errors) {
        newErrors[field] = errors[0];
      }
    });

    setErrors(newErrors);
  }, [axiosError]);

  return {
    errors,
    setAxiosError,
  };
};

export default useFormErrors;
