import BaseModal from '@/shared/components/BaseModal';

import ProfileUpdateForm from './ProfileUpdateForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileUpdateModal = ({ isOpen, onClose }: Props) => {
  return (
    <BaseModal
      isOpen={isOpen}
      title='프로필 편집'
      size='L'
      closeOnOutsideClick={false}
      onClose={onClose}
    >
      <ProfileUpdateForm />
    </BaseModal>
  );
};

export default ProfileUpdateModal;
