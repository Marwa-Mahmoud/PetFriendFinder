module.exports = function(sequelize, DataTypes) {
    let Posts = sequelize.define('Posts', {
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        // ownerId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // }
    });
    Posts.associate = function(models) {
        Posts.belongsTo(models.Owners, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    return Posts;
};