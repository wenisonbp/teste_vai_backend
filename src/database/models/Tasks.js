const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

class Tasks extends Model {
    static init(sequelize) {
        super.init({
            title: DataTypes.STRING,
            index: DataTypes.INTEGER,
            requester_name: DataTypes.STRING,
            requester_email: DataTypes.STRING,
            description: DataTypes.STRING,
            category: DataTypes.STRING,
            comment: DataTypes.STRING,
            due_date: DataTypes.DATE,
            stage: DataTypes.STRING,
            created_at: DataTypes.DATE,
        }, {
            hooks: {
                beforeCreate: (tasks, options) => {
                    tasks.id = uuidv4();
                }
            },
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    }

}

module.exports = Tasks;

