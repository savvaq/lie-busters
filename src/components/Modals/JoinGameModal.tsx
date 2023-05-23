import { FC, FormEventHandler } from 'react';
import Modal from './Modal/Modal';
import { useRouter } from 'next/router';
import { joinGameApi } from '@/lib/api';
import Button from '../Button/Button';
import styles from './Modal/Modal.module.scss';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import useFormErrors from '@/hooks/useFormErrors';

type JoinGameModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const JoinGameModal: FC<JoinGameModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const { t } = useTranslation();
  const router = useRouter();
  const { errors, setAxiosError } = useFormErrors();

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

    joinGameApi(code, name)
      .then((res) => router.push(`/game/${res.data.code}`))
      .catch((error) => {
        setAxiosError(error);
        setIsLoading(false);
      });
  };

  return (
    <Modal title="Join Game" isOpen={isOpen} onClose={onClose}>
      <form className={styles['modal-form']} onSubmit={onSubmit}>
        <label htmlFor="name">{t('your_name')}</label>
        <input
          id="name"
          type="text"
          minLength={2}
          maxLength={20}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <span>{errors.name}</span>

        <label htmlFor="code">{t('game_code')}</label>
        <input
          id="code"
          type="text"
          minLength={6}
          maxLength={6}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <span>{errors.code}</span>

        <Button type="submit" text={t('join_game')} isLoading={isLoading} />
      </form>
    </Modal>
  );
};

export default JoinGameModal;
