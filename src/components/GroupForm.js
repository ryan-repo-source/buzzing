import React, { useEffect, useState } from 'react';
import Detail from './Group/Detail';
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';
import Setting from './Group/Setting';
import Forum from './Group/Forum';
import ProfilePicture from './Group/ProfilePicture';
import Album from './Group/Album';
import Invites from './Group/Invites';
import Delete from './Group/Delete';
import Members from './Group/Members';

const GroupForm = ({ group, fetchGroup, create }) => {
  const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState(group || {
    name: "",
    description: "",
    privacy: "",
    invitation: "",
    profile_picture: "",
    cover_photo: "",
    forum_enabled: 0,
    album_setting: ""
  });
  const [groupId, setGroupId] = useState(group?.id || null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [completedTabIndex, setCompletedTabIndex] = useState(0);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleTabClick = (e, id, index) => {
    if (create && index > completedTabIndex) {
      e.preventDefault();
      return;
    }
    setActiveTab(id);
  };

  const handleSubmit = async (e) => {
    let asd;
    e.preventDefault();
    try {
      setLoading(true);
      if (!groupId) {
        const payload = {
          user_id: auth.id,
          name: formData.name,
          description: formData.description,
        };

        const response = await axios.post(
          'https://buzzinguniverse.com/backend/api/groups/create',
          payload
        );

        setSuccessMessage('Group created successfully.');
        setFormData(response?.data?.data);
        setGroupId(response?.data?.data.id || null);
        asd = response?.data?.data.id;
      } else {
        const formDaTa = new FormData();
        for (const key in formData) {
          formDaTa.append(key, formData[key]);
        }

        const response = await axios.post(
          'https://buzzinguniverse.com/backend/api/groups/update',
          formDaTa,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        setSuccessMessage('Group saved successfully.');
        setFormData(response?.data?.data);
      }

      if (create) {
        const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
        if (currentIndex >= completedTabIndex) {
          setCompletedTabIndex(currentIndex + 1);
          const nextTab = tabs[currentIndex + 1];
          if (nextTab) {
            setActiveTab(nextTab.id);
          }
        }
      }

    } catch (error) {
      console.log(error.response?.data?.message || 'Failed to save group.');
    } finally {
      setLoading(false);
      if (create) {
        fetchGroup(asd || groupId);
      } else {
        fetchGroup();
      }
    }
  };

  const tabs = [
    {
      id: 'details',
      title: 'Details',
      content: (
        <Detail
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          loading={loading}
          group={formData}
        />
      ),
    },
    {
      id: 'settings',
      title: 'Settings',
      content: (
        <Setting
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          loading={loading}
          group={formData}
        />
      ),
    },
    {
      id: 'forum',
      title: 'Forum',
      content: (
        <Forum
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          loading={loading}
          group={formData}
        />
      ),
    },
    {
      id: 'photo',
      title: 'Photo',
      content: (
        <ProfilePicture
          handleSubmit={handleSubmit}
          handleFileChange={handleFileChange}
          loading={loading}
          type="profile_picture"
        />
      ),
    },
    {
      id: 'media',
      title: 'Media',
      content: (
        <Album
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          loading={loading}
          group={formData}
        />
      ),
    },
    {
      id: 'cover',
      title: 'Cover Image',
      content: (
        <ProfilePicture
          handleSubmit={handleSubmit}
          handleFileChange={handleFileChange}
          loading={loading}
          type="cover_photo"
        />
      ),
    },
    {
      id: 'invite',
      title: 'Invite',
      content: <Invites create={create} group={group} />,
    },
  ];

  if (!create) {
    tabs.splice(6, 1);
    tabs.push({
      id: 'members',
      title: 'Members',
      content: (
        <Members group={group} />
      ),
    })
    if (group.user_id == auth?.id) {
      tabs.push({
        id: 'delete',
        title: 'Delete',
        content: (
          <Delete groupId={groupId} />
        ),
      })
    }
  }

  return (
    <div className="personal_right_box groupForm mt-4">
      <ul className="nav nav-pills mb-0" id="pills-tab" role="tablist">
        {tabs.map((tab, index) => (
          <li className="nav-item" role="presentation" key={tab.id}>
            <button
              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={(e) => handleTabClick(e, tab.id, index)}
            >
              {create && index + 1 + '. '}{tab.title}
            </button>
          </li>
        ))}
      </ul>

      <div className="tab-content" id="pills-tabContent">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-pane fade ${activeTab === tab.id ? 'show active' : ''}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupForm;
