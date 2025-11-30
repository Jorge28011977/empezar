const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');

require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Sync database
sequelize.sync({ force: false }).then(async () => {
    console.log('Database synced');

    // Create admin user if not exists
    const { User } = require('./models');
    const bcrypt = require('bcryptjs');

    const adminExists = await User.findOne({ where: { email: 'admin@mantto.com' } });
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            username: 'admin',
            email: 'admin@mantto.com',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('Admin user created');
    } else {
        console.log('Admin user already exists');
    }
}).catch(err => {
    console.error('Database sync error:', err);
});

// Rutas
const authRouter = require('./routes/auth');
const machinesRouter = require('./routes/machines');
const techniciansRouter = require('./routes/technicians');
const maintenancesRouter = require('./routes/maintenances');
const maintenanceTemplatesRouter = require('./routes/maintenanceTemplates');
const sparePartsRouter = require('./routes/spareParts');
const inventoryRouter = require('./routes/inventory');
const ticketsRouter = require('./routes/tickets');
const iotRouter = require('./routes/iot');
const erpRouter = require('./routes/erp');
app.use('/api/auth', authRouter);
app.use('/api/machines', machinesRouter);
app.use('/api/technicians', techniciansRouter);
app.use('/api/maintenances', maintenancesRouter);
app.use('/api/maintenance-templates', maintenanceTemplatesRouter);
app.use('/api/spare-parts', sparePartsRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/iot', iotRouter);
app.use('/api/erp', erpRouter);

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;