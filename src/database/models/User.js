const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            company_name: DataTypes.STRING,
            telephone: DataTypes.STRING,
            password: DataTypes.STRING,
        }, {
            hooks: {
                beforeCreate: (user, options) => {
                    user.password = bcrypt.hashSync(user.password, 10);
                    user.id = uuidv4();
                },
                afterCreate: function (user, options) {
                    user.password = null;
                }
            },
            sequelize
        })
    }

}

module.exports = User;

