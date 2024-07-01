import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200" style={{ backgroundColor: color }}>
            <div className="flex items-center">
                <div className="text-2xl mr-4" style={{ color: '#FFFFFF' }}>
                    {icon}
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-2 text-white">{title}</h2>
                    <p className="text-2xl font-bold text-white">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
