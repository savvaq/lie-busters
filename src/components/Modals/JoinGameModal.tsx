import { FC, MouseEventHandler } from 'react';
import { useForm } from 'react-hook-form';
import { JoinGameSchema, JoinGameSchemaType } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from './Modal/Modal';
import { useRouter } from 'next/router';
import { joinGameApi } from '@/lib/api';
import Button from '../Button/Button';
import styles from './Modal/Modal.module.css';
import Input from '../Input/Input';

type JoinGameModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const JoinGameModal: FC<JoinGameModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { getValues, register } = useForm<JoinGameSchemaType>({
    resolver: zodResolver(JoinGameSchema),
  });

  const handleSubmit: MouseEventHandler = (e) => {
    e.preventDefault();

    joinGameApi(getValues('code'), getValues('name')).then((res) => {
      router.push(`/game/${res.data.code}`);
    });
  };

  return (
    <Modal title="Join Game" isOpen={isOpen} onClose={onClose}>
      <form className={styles['modal-form']}>
        <Input {...register('name')} label="Name" />
        <Input {...register('code')} label="Code" />

        <Button text="Join Game" onclick={handleSubmit} />
      </form>
    </Modal>
  );
};

export default JoinGameModal;
