import BaseModal from '@/shared/components/BaseModal';

import ProfileUpdateForm from './ProfileUpdateForm';
import { MeResponse } from '../../../../openapi/requests';

interface Props {
  isOpen: boolean;
  userDetail: MeResponse;
  onClose: () => void;
}

const ProfileUpdateModal = ({ isOpen, userDetail, onClose }: Props) => {
  return (
    <BaseModal
      isOpen={isOpen}
      title='프로필 편집'
      size='L'
      closeOnOutsideClick={false}
      onClose={onClose}
    >
      <ProfileUpdateForm userDetail={userDetail} onClose={onClose} />
    </BaseModal>
  );
};

export default ProfileUpdateModal;
