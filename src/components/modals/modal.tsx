import React from 'react'
import { Modal, Image } from 'antd'

interface ModalProps {
  handleClose: () => void
  isModalOpen: boolean
  modalPath: string
}

export const ModalWithPicture: React.FC<ModalProps> = (props: ModalProps) => {
  const logo = props.modalPath

  return (
        <>
            <Modal
                title='Пример использования'
                width={250}
                open={props.isModalOpen}
                onCancel={props.handleClose}
                okButtonProps={{ style: { display: 'none' } }}
            >
                <div>
                    <Image
                        width={200}
                        src={logo}
                    />
                </div>
            </Modal>
        </>
  )
}
