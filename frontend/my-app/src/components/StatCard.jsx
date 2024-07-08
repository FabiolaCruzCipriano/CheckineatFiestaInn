import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
    return (
        <div className={`p-4 rounded-lg shadow-md ${color} text-white`}>
            <div className="flex items-center">
                <div className="text-3xl">{icon}</div>
                <div className="ml-4">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <p className="text-2xl">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
