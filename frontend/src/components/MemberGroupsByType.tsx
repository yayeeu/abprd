import { TableBody, TableCell, TableRow } from '@mui/material/';

import { Member } from '../types/Member';
import { useState } from 'react';
import MemberModal from './MemberModal';

interface MemberGroupsByTypeProps {
    members: Member[] | undefined;
    weekFrame: string;
}
  
const MemberGroupsByType: React.FC<MemberGroupsByTypeProps> = ({ members, weekFrame }) => {
    const memberTypes: string[] = ['member','regular','visitor','remote' ]; // fetch from server
    const [showModal, setShowModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member>();

    const handleClick = (member: Member) => {
      setSelectedMember(member);
      setShowModal(true);
    };

    if (!members) {
        return (
            <TableRow>
                <TableCell colSpan={4}>No members contacted {weekFrame}</TableCell>
            </TableRow>
        )
    }

    const groupedMembers = members.reduce((acc: { [key: string]: Member[] }, member: Member) => {
        if (!acc[member.memberType]) {
            acc[member.memberType] = [];
        }
        acc[member.memberType].push(member);
        return acc;
    }, {});

    const printMember = (member: Member) => {
        const { firstName, middleName, lastName } = member;

        return (
            <div onClick={() => handleClick(member)} style={{ cursor: 'pointer' }}>
                {firstName} {middleName} {lastName}
            </div>
        );
    }

    // Calculate the maximum number of rows for any member type
    const maxRows = Math.max(...Object.values(groupedMembers).map((members) => members.length));

    return (
        <TableBody>
            <TableRow>
                {memberTypes.map((memberType) => (
                    <>
                        {[...Array(maxRows)].map((_, index) => (
                            <TableCell key={index} className={`member-cell ${memberType}-type-cell`}>
                                {groupedMembers[memberType] && groupedMembers[memberType][index] &&
                                    printMember(groupedMembers[memberType][index])}
                            </TableCell>
                        ))}
                    </>
                ))}
            </TableRow>
            {showModal && selectedMember && <MemberModal member={selectedMember} onClose={() => setShowModal(false)} />}
        </TableBody>
    );
};
  
export default MemberGroupsByType;