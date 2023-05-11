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

type JoinGameModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const JoinGameModal: FC<JoinGameModalProps> = ({ isOpen, onClose }) => {
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
      });
  };

  return (
    <Modal title="Join Game" isOpen={isOpen} onClose={onClose}>
      <form className={styles['modal-form']} onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <label htmlFor="name">Your Name</label>
          <input {...register('name')} />
          <span>{errors?.name?.message}</span>
        </fieldset>

        <fieldset>
          <label htmlFor="code">Game Code</label>
          <input {...register('code')} />
          <span>{errors?.code?.message}</span>
        </fieldset>

        <Button text="Join Game" type="submit" />
      </form>
    </Modal>
  );
};

export default JoinGameModal;
