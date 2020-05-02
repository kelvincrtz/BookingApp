using Microsoft.EntityFrameworkCore.Migrations;

namespace BookingApp.API.Migrations
{
    public partial class AddedColumnsForMessage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsSeenNotification",
                table: "Messages",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSeenNotification",
                table: "Messages");
        }
    }
}
