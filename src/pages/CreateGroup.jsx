import React, { useEffect, useState } from 'react'
import GlobalSearch from '../components/GlobalSearch'
import GroupForm from '../components/GroupForm'
import axios from 'axios';

const CreateGroup = () => {
    const [group, setGroup] = useState(null);

    const fetchGroup = async (id) => {
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/groups/get?group_id=${id}`);
            setGroup(res.data?.data || null);
        } catch (err) {
            console.error("Failed to fetch group:", err);
        }
    };

    useEffect(() => {
        fetchGroup();
    }, []);
    return (
        <>
            <GlobalSearch />
            <section>
                <div className="inner-groups-sec groups-sec pt-0">
                    <div className="container">
                        <div className="row" style={{ justifyContent: 'center' }}>
                            <div className='col-md-7'>
                                <GroupForm create={true} fetchGroup={fetchGroup} group={group} />
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </>
    )
}

export default CreateGroup
