const sequelize = require('./src/database');
const User = require('./src/models/User');

async function createAdmin() {
    try {
        await sequelize.sync();

        // Check if admin already exists to prevent duplicate error
        const existingAdmin = await User.findOne({ where: { username: 'admin' } });

        if (existingAdmin) {
            console.log('Admin user already exists.');
        } else {
            await User.create({
                username: 'admin',
                password: 'admin123',
                role: 'admin'
            });
            console.log('Admin user (username: admin, password: admin123) created successfully!');
        }
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await sequelize.close();
    }
}

createAdmin();
