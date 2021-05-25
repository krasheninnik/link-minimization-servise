using Microsoft.EntityFrameworkCore.Migrations;

namespace WebApi.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UrlTransformation",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    longUrl = table.Column<string>(type: "TEXT", nullable: true),
                    shortUrl = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UrlTransformation", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "UrlTransformation",
                columns: new[] { "Id", "longUrl", "shortUrl" },
                values: new object[] { 1L, "long_abc", "abc" });

            migrationBuilder.InsertData(
                table: "UrlTransformation",
                columns: new[] { "Id", "longUrl", "shortUrl" },
                values: new object[] { 2L, "long_cde", "cde" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UrlTransformation");
        }
    }
}
