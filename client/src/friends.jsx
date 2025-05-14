import React from 'react';

const Friends = ({ name, avatar, description }) => {
  return (
    <div className="max-w-sm bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4">
      <img
        className="w-16 h-16 rounded-full object-cover"
        src={avatar}
        alt={`${name}'s avatar`}
      />
      <div>
        <div className="text-xl font-semibold text-gray-900">{name}</div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default Friends;
