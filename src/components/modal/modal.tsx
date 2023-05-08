import styles from './Modal.module.css';
import Button from '../Button/Button';
import React from 'react';
import CrossIcon from '../icons/cross.png';

const Modal = (props) => {

    return (
        <div className={styles.modal}>
            <h2>{props.title}</h2>
            <div className={styles['form-wrapper']}>
                {
                    props.fields.map((field) => 
                        <form key={field.id} className={styles['modal-form']}>
                            <label htmlFor={field.name}>{field.title}</label>
                            {
                                field.name === 'code' ?
                                    <input
                                        type="text"
                                        id={field.name}
                                        name={field.name}
                                        value={props.code}
                                        onChange={(e) => props.setCode(e.target.value)}
                                    />
                                : null
                            }
                            {
                                field.name === 'name' ?
                                    <input
                                        type="text"
                                        id={field.name}
                                        name={field.name}
                                        value={props.name}
                                        onChange={(e) => props.setName(e.target.value)}
                                    />
                                : null
                            }
                        </form>
                    )
                }
            </div>
            <Button text={props.button} onclick={props.handleClick} />
            <div className={styles['close-modal']} onClick={props.closeModal}></div>

        </div>
    )    

};

export default Modal;