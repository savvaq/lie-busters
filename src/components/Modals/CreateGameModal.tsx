import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { CreateGameSchemaType, CreateGameSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from './Modal/Modal';
import { useRouter } from 'next/router';
import { createGameApi } from '@/lib/api';
import Button from '../Button/Button';
import styles from './Modal/Modal.module.scss';

type CreateGameModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateGameModal: FC<CreateGameModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGameSchemaType>({
    resolver: zodResolver(CreateGameSchema),
  });

  const onSubmit: SubmitHandler<CreateGameSchemaType> = ({ name }) => {
    createGameApi(name, i18n.language)
      .then((res) => {
        router.push(`/game/${res.data.code}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Modal title="Create Game" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles['modal-form']}>
        <label htmlFor="name">{t('your_name')}</label>
        <input {...register('name')} />
        <span>{errors?.name?.message || ''}</span>

        <Button text={t('create_game')} type="submit" />
      </form>
    </Modal>
  );
};

export default CreateGameModal;
