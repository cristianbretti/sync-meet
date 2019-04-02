import React from 'react'

interface AddUserModalProps {}

const AddUserModal: React.FC<AddUserModalProps> = () => {
    return (
        <div>
            <div className="absolute flex items-center justify-center pin bg-grey-darkest opacity-25 z-10" />
            <div className="absolute flex items-center justify-center pin z-20">
                <div className="bg-grey-darkest rounded">Hej</div>
            </div>
        </div>
    )
}

export default AddUserModal
