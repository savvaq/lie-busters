import { FC, MouseEventHandler } from 'react';
import { useForm } from 'react-hook-form';
import { CreateGameSchemaType, CreateGameSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from './Modal/Modal';
import { useRouter } from 'next/router';
import { createGameApi } from '@/lib/api';
import Button from '../Button/Button';
import styles from './Modal/Modal.module.css';
import Input from '../Input/Input';

type CreateGameModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateGameModal: FC<CreateGameModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { getValues, register, watch } = useForm<CreateGameSchemaType>({
    resolver: zodResolver(CreateGameSchema),
  });

  const onSubmit: MouseEventHandler = (e) => {
    e.preventDefault();

    console.log(getValues('name'));

    // createGameApi(getValues('name')).then((res) => {
    //   router.push(`/game/${res.data.code}`);
    // });
  };

  return (
    <Modal title="Create Game" isOpen={isOpen} onClose={onClose}>
      <form className={styles['modal-form']}>
        <Input {...register('name')} label="Your Name" />
        <Button text="Create Game" type="submit" />
      </form>
    </Modal>
  );
};

export default CreateGameModal;
