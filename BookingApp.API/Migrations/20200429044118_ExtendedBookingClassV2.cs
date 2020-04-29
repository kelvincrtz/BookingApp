using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BookingApp.API.Migrations
{
    public partial class ExtendedBookingClassV2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ApproveOrDeclineDate",
                table: "Bookings",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsSeenByAdmin",
                table: "Bookings",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsSeenNotification",
                table: "Bookings",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApproveOrDeclineDate",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "IsSeenByAdmin",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "IsSeenNotification",
                table: "Bookings");
        }
    }
}
