import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { JoinGameSchema, JoinGameSchemaType } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from './Modal/Modal';
import { useRouter } from 'next/router';
import { joinGameApi } from '@/lib/api';
import Button from '../Button/Button';
import styles from './Modal/Modal.module.scss';
import { AxiosError } from 'axios';
import { ResponseError } from '@/lib/types';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

type JoinGameModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const JoinGameModal: FC<JoinGameModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<JoinGameSchemaType>({
    resolver: zodResolver(JoinGameSchema),
  });

  const onSubmit: SubmitHandler<JoinGameSchemaType> = ({ code, name }) => {
    setIsLoading(true);
    joinGameApi(code, name)
      .then((res) => {
        router.push(`/game/${res.data.code}`);
      })
      .catch((error: AxiosError<ResponseError>) => {
        if (error.response?.data?.fieldErrors?.name) {
          setError('name', {
            type: 'manual',
            message: error.response.data.fieldErrors.name[0],
          });
        } 
        
        if (error.response?.data?.fieldErrors?.code) {
          setError('name', {
            type: 'manual',
            message: error.response.data.fieldErrors.code[0],
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      }
    );
  };

  return (
    <Modal title="Join Game" isOpen={isOpen} onClose={onClose}>
      <form className={styles['modal-form']} onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">{t('your_name')}</label>
        <input {...register('name')} />
        <span>{errors?.name?.message}</span>

        <label htmlFor="code">{t('game_code')}</label>
        <input {...register('code')} />
        <span>{errors?.code?.message}</span>

        <Button text={t('join_game')} type="submit" />
      </form>
    </Modal>
  );
};

export default JoinGameModal;
