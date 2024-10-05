// server/models/userModel.js
import { DataTypes } from 'sequelize';
import db from '../config/db.js';


const User = db.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'designer', 'developer', 'projectManager'),
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, 
        allowNull: false,
    },
    // New fields
    isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,  // Default value set to false
        allowNull: false,
    },
    otp: {
        type: DataTypes.INTEGER,
        allowNull: true,  // Allow NULL initially until OTP is generated
    },
    otpExpires: {
        type: DataTypes.DATE,
        defaultValue: () => new Date(Date.now() + 30 * 1000),  // Default expiration time: 30 seconds from now
        allowNull: true,
    },
});


const syncUserTable = async () => {
    try {
        await User.sync();
        console.log('User table created or exists already');
    } catch (error) {
        console.error('Error creating user table:', error);
    }
};


syncUserTable();

// Create User function using Sequelize
export const createUser = async (name, email, password, role, phoneNumber,otp) => {
    try {
        const user = await User.create({
            name,
            email,
            password,
            role,
            phoneNumber,
            isApproved: false, 
            isVerified: false,
            isBlocked: false, 
            otp,         
            otpExpires: new Date(Date.now() + 30 * 1000),  
        });
        return user; 
    } catch (error) {
        throw error; 
    }
};

// Get User by email function using Sequelize
export const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({
            where: { email },
        });
        return user;
    } catch (error) {
        throw error; 
    }
};
