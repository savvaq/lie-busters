import { FC, FormEventHandler } from 'react';
import { useTranslation } from 'next-i18next';
import Modal from './Modal/Modal';
import { useRouter } from 'next/router';
import { createGameApi } from '@/lib/api';
import Button from '../Button/Button';
import styles from './Modal/Modal.module.scss';
import { useState } from 'react';
import useFormErrors from '@/hooks/useFormErrors';

type CreateGameModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateGameModal: FC<CreateGameModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { errors, setAxiosError } = useFormErrors();

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setIsLoading(true);

    createGameApi(name, i18n.language)
      .then((res) => router.push(`/game/${res.data.code}`))
      .catch((error) => {
        setAxiosError(error);
        setIsLoading(false);
      });
  };

  return (
    <Modal title="Create Game" isOpen={isOpen} onClose={onClose}>
      <form className={styles['modal-form']} onSubmit={onSubmit}>
        <label htmlFor="name">{t('your_name')}</label>
        <input
          id="name"
          type="text"
          minLength={2}
          maxLength={20}
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />
        <span>{errors.name}</span>

        <Button type="submit" text={t('create_game')} isLoading={isLoading} />
      </form>
    </Modal>
  );
};

export default CreateGameModal;
