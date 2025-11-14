import React from 'react'
import { FaInfo } from 'react-icons/fa6'

const GroupInvites = () => {
    return (
        <div className='groupInvites-set py-4'>
            <h4>Group Invites</h4>
            <div className="sorry-activity-found activity-all-memeber ms-5" style={{ width: "40%" }}>
                <ul style={{ alignItems: 'start' }}>
                    <li><FaInfo /></li>
                    <li>
                        <p>Currently every member of the community can invite you to join their groups. If you are not comfortable with it, you can always restrict group invites to your friends only.</p>
                    </li>
                </ul>
            </div>
            <div className="custom-radio mb-2">
                <input id="privacy-1" type="checkbox" />
                <label htmlFor="privacy-1" className="ms-2">I want to restrict Group invites to my friends only.</label>
            </div>
            <button className="btncs">
                Save Changes
            </button>

        </div>
    )
}

export default GroupInvites
