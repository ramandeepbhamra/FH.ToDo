using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FH.ToDo.Core.EF.Migrations
{
    /// <inheritdoc />
    public partial class AddIsSystemUserToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsSystemUser",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSystemUser",
                table: "Users");
        }
    }
}
